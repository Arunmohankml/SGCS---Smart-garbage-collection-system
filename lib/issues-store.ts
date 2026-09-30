"use client";

import { useEffect, useState } from "react";
import { type Issue, type IssueCategory, type IssueStatus, type IssueImage } from "@/lib/types";

const CUSTOM_ISSUES_KEY = "civiceye_garbage_requests_v3";
const STORE_CHANGE_EVENT = "civiceye_garbage_store_changed";
const DELETED_ISSUES_KEY = "civiceye_deleted_garbage_v3";

function getStoredCustomIssues(): Issue[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_ISSUES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomIssues(issues: Issue[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_ISSUES_KEY, JSON.stringify(issues));
    window.dispatchEvent(new Event(STORE_CHANGE_EVENT));
  } catch (e) {
    console.error("Failed to save garbage collection requests to localStorage", e);
  }
}

function getDeletedIssueIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DELETED_ISSUES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useIssuesStore() {
  const [customIssues, setCustomIssues] = useState<Issue[]>([]);
  const [apiIssues, setApiIssues] = useState<Issue[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCustomIssues(getStoredCustomIssues());
    setDeletedIds(getDeletedIssueIds());

    const handleUpdate = () => {
      setCustomIssues(getStoredCustomIssues());
      setDeletedIds(getDeletedIssueIds());
    };

    window.addEventListener(STORE_CHANGE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(STORE_CHANGE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    fetch("/api/issues")
      .then((res) => res.json())
      .then((data) => {
        setApiIssues(data.issues || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allIssues: Issue[] = [
    ...customIssues,
    ...apiIssues.filter((a) => !customIssues.some((c) => c.id === a.id))
  ].filter((i) => !deletedIds.includes(i.id));

  const addIssue = (newIssue: Omit<Issue, "id" | "reference" | "createdAt" | "updatedAt" | "votes" | "verification" | "comments" | "status"> & { id?: string; status?: IssueStatus }) => {
    const id = newIssue.id || String(Date.now());
    const fullIssue: Issue = {
      ...newIssue,
      id,
      reference: `CE-WASTE-${id.slice(-4)}`,
      municipality: newIssue.municipality || "Central Ward",
      status: newIssue.status || "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: 1,
      verification: { fixed: 0, stillExists: 0, voters: [] },
      comments: [],
    };

    const updated = [fullIssue, ...customIssues];
    saveCustomIssues(updated);
    return fullIssue;
  };

  const updateStatus = (id: string, status: IssueStatus, resolutionImageUrl?: string, assignedCrew?: string) => {
    const resolveImage: IssueImage | null = resolutionImageUrl ? {
      url: resolutionImageUrl,
      capturedAt: new Date().toISOString(),
      kind: "resolution"
    } : null;

    const updateIssueObject = (i: Issue): Issue => {
      const updatedImages = resolveImage ? [...i.images, resolveImage] : i.images;
      return {
        ...i,
        status,
        images: updatedImages,
        assignedCrew: assignedCrew || i.assignedCrew,
        updatedAt: new Date().toISOString(),
        ...(status === "resolved" ? { resolvedAt: new Date().toISOString() } : {})
      };
    };

    const isCustom = customIssues.some((i) => i.id === id);
    if (isCustom) {
      const updated = customIssues.map((i) =>
        i.id === id ? updateIssueObject(i) : i
      );
      saveCustomIssues(updated);
    } else {
      const apiItem = apiIssues.find((i) => i.id === id);
      if (apiItem) {
        const modifiedItem = updateIssueObject(apiItem);
        const updated = [modifiedItem, ...customIssues.filter((i) => i.id !== id)];
        saveCustomIssues(updated);
      }
    }
  };

  const dispatchCrew = (id: string, crewName: string) => {
    updateStatus(id, "in_progress", undefined, crewName);
  };

  const deleteIssue = (id: string) => {
    const updatedDeleted = [...deletedIds, id];
    setDeletedIds(updatedDeleted);
    localStorage.setItem(DELETED_ISSUES_KEY, JSON.stringify(updatedDeleted));
    
    // Dispatch event to sync other hooks/listeners
    window.dispatchEvent(new Event(STORE_CHANGE_EVENT));

    // Also remove from custom issues list
    const updatedCustom = customIssues.filter((i) => i.id !== id);
    saveCustomIssues(updatedCustom);
  };

  const upvoteIssue = (id: string) => {
    const isCustom = customIssues.some((i) => i.id === id);
    if (isCustom) {
      const updated = customIssues.map((i) =>
        i.id === id ? { ...i, votes: i.votes + 1 } : i
      );
      saveCustomIssues(updated);
    } else {
      const apiItem = apiIssues.find((i) => i.id === id);
      if (apiItem) {
        const modifiedItem: Issue = {
          ...apiItem,
          votes: apiItem.votes + 1,
        };
        const updated = [modifiedItem, ...customIssues.filter((i) => i.id !== id)];
        saveCustomIssues(updated);
      }
    }
  };

  return {
    issues: allIssues,
    addIssue,
    updateStatus,
    dispatchCrew,
    deleteIssue,
    upvoteIssue,
    loading,
  };
}