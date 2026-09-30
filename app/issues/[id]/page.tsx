import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { IssueDetail } from "@/components/issues/issue-detail";

export default function IssueDetailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-24 pt-32">
        <IssueDetail />
      </main>
      <Footer />
    </>
  );
}