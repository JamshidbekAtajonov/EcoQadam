import type { Metadata } from "next";
import { ImpactDashboard } from "@/components/dashboard/impact-dashboard";
import { requireUser } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Natijalar" };

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <div className="standard-page wide-page">
      <header className="page-heading"><p className="eyebrow">O‘lchanadigan ta’sir</p><h1>Eco natijalar paneli</h1><p>Tasdiqlangan harakatlarning suv, chiqindi, daraxt va faollik natijalari.</p></header>
      <ImpactDashboard role={user.role} />
    </div>
  );
}
