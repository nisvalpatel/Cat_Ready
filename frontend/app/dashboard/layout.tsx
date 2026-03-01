import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: "Fleet Dashboard | CAT Ready",
  description: "Monitor your fleet status, inspection history, and reports",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cat-gray flex">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
