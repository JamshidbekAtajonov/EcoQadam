import type { Metadata } from "next";
import { LessonLibrary } from "@/components/learn/lesson-library";

export const metadata: Metadata = { title: "O‘rganish" };

export default function LearnPage() {
  return (
    <div className="standard-page">
      <header className="page-heading"><p className="eyebrow">Eco kutubxona</p><h1>Tabiatni tushunishdan boshlang</h1><p>Xorazm hayotiga mos, qisqa va amaliy darslar.</p></header>
      <LessonLibrary />
    </div>
  );
}
