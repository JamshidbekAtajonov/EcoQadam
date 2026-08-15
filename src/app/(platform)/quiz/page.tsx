import type { Metadata } from "next";
import { AdaptiveQuiz } from "@/components/quiz/adaptive-quiz";

export const metadata: Metadata = { title: "Adaptiv test" };

export default function QuizPage() {
  return (
    <div className="quiz-page">
      <header className="page-heading compact"><p className="eyebrow">Bilimingizni sinang</p><h1>Eco adaptiv test</h1><p>Noto‘g‘ri javoblar asosida savollar mavzuga moslashadi.</p></header>
      <AdaptiveQuiz />
    </div>
  );
}
