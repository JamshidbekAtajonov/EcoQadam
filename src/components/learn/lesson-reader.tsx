"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Clock3, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { categoryLabels, type DemoLesson } from "@/data/demo";

export function LessonReader({ lesson }: { lesson: DemoLesson }) {
  const { locale } = useLanguage();
  const [completed, setCompleted] = useState(lesson.progress === 100);
  const [pending, setPending] = useState(false);
  const paragraphs = locale === "uz" ? lesson.contentUz : lesson.contentEn;

  async function markComplete() {
    setPending(true);
    try {
      const response = await fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonSlug: lesson.slug, percent: 100 }),
      });
      if (!response.ok) throw new Error("sync failed");
    } catch {
      const queued = JSON.parse(localStorage.getItem("ecoqadam_offline_queue") ?? "[]");
      queued.push({ id: crypto.randomUUID(), type: "lesson_progress", payload: { lessonSlug: lesson.slug, percent: 100 }, createdAt: new Date().toISOString() });
      localStorage.setItem("ecoqadam_offline_queue", JSON.stringify(queued));
    }
    setCompleted(true);
    setPending(false);
  }

  return (
    <article className="lesson-reader">
      <Link href="/learn" className="back-link"><ArrowLeft size={16} /> Darslarga qaytish</Link>
      <header className={`lesson-reader-hero tone-${lesson.category.toLowerCase()}`}>
        <div>
          <span>{categoryLabels[lesson.category][locale]} · <Clock3 size={14} /> {lesson.duration} min</span>
          <h1>{locale === "uz" ? lesson.titleUz : lesson.titleEn}</h1>
          <p>{locale === "uz" ? lesson.summaryUz : lesson.summaryEn}</p>
        </div>
        <div className="lesson-fact"><strong>{lesson.factValue}</strong><span>{locale === "uz" ? lesson.factUz : lesson.factEn}</span></div>
      </header>

      <div className="lesson-body">
        <div className="lesson-copy">
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <figure className="lesson-photo"><Image src="/og.png" width={1728} height={912} alt={locale === "uz" ? `${lesson.titleUz} darsi uchun Xorazm ekologik manzarasi` : `Khorazm environmental scene for ${lesson.titleEn}`} priority /><figcaption>EcoQadam · Xorazmda bilim va harakat</figcaption></figure>
          <div className="infographic-strip">
            <div><span>1</span><strong>Kuzating</strong><small>Muammoni toping</small></div>
            <i>→</i>
            <div><span>2</span><strong>Harakat qiling</strong><small>Kichik qadam tanlang</small></div>
            <i>→</i>
            <div><span>3</span><strong>O‘lchang</strong><small>Natijani yozing</small></div>
          </div>
          <aside className="lesson-task"><Lightbulb size={22} /><div><strong>Kichik topshiriq</strong><p>{locale === "uz" ? lesson.taskUz : lesson.taskEn}</p></div></aside>
        </div>
        <aside className="lesson-actions">
          <Sparkles size={20} />
          <h3>Darsni mustahkamlang</h3>
          <p>Topshiriqni bajaring va keyin qisqa testda bilimingizni tekshiring.</p>
          <button className="primary-button" onClick={markComplete} disabled={pending || completed}>
            {pending ? <LoaderCircle className="spin" size={17} /> : <CheckCircle2 size={17} />}
            {completed ? "Yakunlandi" : "Darsni yakunlash"}
          </button>
          <Link href="/quiz" className="secondary-button">Testga o‘tish</Link>
        </aside>
      </div>
    </article>
  );
}
