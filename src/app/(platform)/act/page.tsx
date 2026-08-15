import type { Metadata } from "next";
import { ChallengeBoard } from "@/components/act/challenge-board";

export const metadata: Metadata = { title: "Harakat" };

export default function ActPage() {
  return (
    <div className="standard-page">
      <header className="page-heading"><p className="eyebrow">Bilimdan harakatga</p><h1>Tabiat uchun vazifa bajaring</h1><p>Kunlik qadamlarni belgilang, dalil qo‘shing va ta’siringizni o‘lchang.</p></header>
      <ChallengeBoard />
    </div>
  );
}
