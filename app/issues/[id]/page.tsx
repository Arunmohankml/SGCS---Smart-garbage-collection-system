import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { IssueDetail } from "@/components/issues/issue-detail";

export default function IssueDetailPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white pb-24 pt-28">
        <IssueDetail />
      </main>
      <Footer />
    </>
  );
}