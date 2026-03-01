import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inspection | CAT Ready",
  description: "Start a new machine inspection with CAT Ready",
};

export default function InspectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
