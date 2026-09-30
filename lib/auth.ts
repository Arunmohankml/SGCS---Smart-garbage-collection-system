"use client";

import { useEffect, useState } from "react";

export interface DemoUser {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: "citizen" | "authority";
  municipality?: string;
  loggedInAt: number;
}

const STORAGE_KEY = "sgcs_user_session";
const AUTH_EVENT = "sgcs_auth_changed";

export function getStoredUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: DemoUser | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function useAuth() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());

    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const loginCitizen = (
    name = "Arun Mohan",
    phone = "98451 22310",
    municipality = "Poonamallee",
    email?: string
  ) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const id = `cit_${cleanPhone || Date.now()}`;
    const newUser: DemoUser = {
      id,
      name: name.trim() || "Resident Citizen",
      phone: phone.trim() || "98451 22310",
      email: email || `${(name || "citizen").toLowerCase().replace(/[^a-z0-9]/g, "")}@citizen.sgcs.gov`,
      role: "citizen",
      municipality: municipality || "Poonamallee",
      loggedInAt: Date.now(),
    };
    setStoredUser(newUser);
    return newUser;
  };

  const loginAuthority = (municipalityName: string) => {
    const newUser: DemoUser = {
      id: `admin_${municipalityName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      name: `Officer — ${municipalityName}`,
      email: `authority@${municipalityName.toLowerCase().replace(/[^a-z0-9]/g, "")}.gov`,
      role: "authority",
      municipality: municipalityName,
      loggedInAt: Date.now(),
    };
    setStoredUser(newUser);
    return newUser;
  };

  const logout = () => {
    setStoredUser(null);
  };

  return { user, loginCitizen, loginAuthority, logout };
}
