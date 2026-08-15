import type { Metadata } from "next";
import { VerificationQueue } from "@/components/verify/verification-queue";
import { requirePermission } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Tekshirish" };

export default async function VerifyPage() {
  await requirePermission("submission:verify");
  return (
    <div className="standard-page">
      <header className="page-heading"><p className="eyebrow">O‘qituvchi nazorati</p><h1>Natijalarni tekshirish</h1><p>Dalillarni ko‘ring, tasdiqlang yoki tushunarli sabab bilan qaytaring.</p></header>
      <VerificationQueue />
    </div>
  );
}
