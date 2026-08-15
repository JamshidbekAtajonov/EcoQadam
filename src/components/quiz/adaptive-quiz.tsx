"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, ChevronRight, Lightbulb, RefreshCcw, X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { categoryLabels, demoLessons, demoQuestions, type DemoQuestion } from "@/data/demo";
import { findFollowUpQuestion, initialAdaptiveQueue, scoreAttempt, type AnswerRecord } from "@/lib/quiz";

export function AdaptiveQuiz() {
  const { locale } = useLanguage();
  const initial = useMemo(() => initialAdaptiveQueue(demoQuestions), []);
  const [queue, setQueue] = useState<DemoQuestion[]>(initial);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);

  const question = queue[index];
  const result = scoreAttempt(answers);

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    const correct = optionIndex === question.correctIndex;
    const record: AnswerRecord = { questionId: question.id, selectedIndex: optionIndex, correct, topic: question.topic };
    setAnswers((current) => [...current, record]);

    if (!correct) {
      const usedIds = new Set(queue.map((item) => item.id));
      const followUp = findFollowUpQuestion(demoQuestions, question.topic, usedIds);
      if (followUp) setQueue((current) => [...current, followUp]);
    }
  }

  async function next() {
    if (index < queue.length - 1) {
      setIndex((current) => current + 1);
      setSelected(null);
      return;
    }

    const finalResult = scoreAttempt(answers);
    setFinished(true);
    const payload = { quizSlug: "ecoqadam-adaptive", answers, ...finalResult };
    try {
      const response = await fetch("/api/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("sync failed");
    } catch {
      const queued = JSON.parse(localStorage.getItem("ecoqadam_offline_queue") ?? "[]");
      queued.push({ id: crypto.randomUUID(), type: "quiz_attempt", payload, createdAt: new Date().toISOString() });
      localStorage.setItem("ecoqadam_offline_queue", JSON.stringify(queued));
    }
  }

  function restart() {
    setQueue(initialAdaptiveQueue(demoQuestions));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  if (finished) {
    const weakTopic = result.weakTopics[0];
    const recommendation = demoLessons.find((lesson) => lesson.category === weakTopic) ?? demoLessons[0];
    return (
      <section className="quiz-result">
        <div className="result-score" style={{ "--score": `${result.score * 3.6}deg` } as React.CSSProperties}>
          <span><strong>{result.score}</strong><small>ball</small></span>
        </div>
        <div className="result-copy">
          <p className="eyebrow">Test yakunlandi</p>
          <h1>{result.score >= 80 ? "Ajoyib natija!" : result.score >= 60 ? "Yaxshi qadam!" : "Birga mustahkamlaymiz"}</h1>
          <p>Adaptiv test javoblaringizga qarab keyingi savollarni moslashtirdi.</p>
          <div className="result-breakdown">
            <span className="correct"><Check size={17} /><b>{result.correctCount}</b> to‘g‘ri</span>
            <span className="incorrect"><X size={17} /><b>{result.incorrectCount}</b> noto‘g‘ri</span>
          </div>
        </div>
        <aside className="recommendation-card">
          <Lightbulb size={21} />
          <div><span>Shaxsiy tavsiya</span><strong>{locale === "uz" ? recommendation.titleUz : recommendation.titleEn}</strong><small>{weakTopic ? `${categoryLabels[weakTopic][locale]} mavzusini yana bir bor ko‘ring.` : "Yangi mavzuga o‘tishga tayyorsiz."}</small></div>
          <Link href={`/learn/${recommendation.slug}`}><ArrowRight size={18} /></Link>
        </aside>
        <button className="secondary-button" onClick={restart}><RefreshCcw size={17} /> Qayta ishlash</button>
      </section>
    );
  }

  const options = locale === "uz" ? question.optionsUz : question.optionsEn;
  const isCorrect = selected === question.correctIndex;

  return (
    <section className="quiz-shell">
      <header className="quiz-topline">
        <div><span>Savol {index + 1}</span><b>{queue.length}</b></div>
        <small>{categoryLabels[question.topic][locale]}</small>
      </header>
      <div className="quiz-progress"><span style={{ width: `${((index + 1) / queue.length) * 100}%` }} /></div>

      <article className="question-card">
        <p>{locale === "uz" ? question.promptUz : question.promptEn}</p>
        <div className="answer-list">
          {options.map((option, optionIndex) => {
            const state = selected === null ? "" : optionIndex === question.correctIndex ? "correct" : optionIndex === selected ? "incorrect" : "muted";
            return (
              <button key={option} className={state} onClick={() => choose(optionIndex)}>
                <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                {state === "correct" && <CheckCircle2 size={20} />}
                {state === "incorrect" && <X size={20} />}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className={`answer-feedback ${isCorrect ? "correct" : "incorrect"}`}>
            {isCorrect ? <CheckCircle2 size={20} /> : <Lightbulb size={20} />}
            <div><strong>{isCorrect ? "To‘g‘ri!" : "Eslab qoling"}</strong><p>{locale === "uz" ? question.explanationUz : question.explanationEn}</p></div>
          </div>
        )}
      </article>

      <footer className="quiz-footer">
        <span>{selected === null ? "Javobni tanlang" : !isCorrect ? "Bu mavzudan qo‘shimcha savol qo‘shildi" : "Davom etishga tayyor"}</span>
        <button className="primary-button" disabled={selected === null} onClick={next}>
          {index === queue.length - 1 ? "Natijani ko‘rish" : "Keyingi savol"} <ChevronRight size={18} />
        </button>
      </footer>
    </section>
  );
}
