import { Navbar } from "@/components/layout/Navbar";
import { AdminDashboard } from "./AdminDashboard";

export const metadata = {
  title: "Dashboard Admin — AniNoren",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <AdminDashboard />
      </main>
    </div>
  );
}
