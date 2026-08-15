"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Droplets, Recycle, Sprout, Sun, Wind } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { categoryLabels, demoLessons, type LessonCategory } from "@/data/demo";

const icons = { WATER: Droplets, DROUGHT: Sun, TREE_CARE: Sprout, WASTE: Recycle, AIR: Wind };

export function LessonLibrary() {
  const { locale } = useLanguage();
  const [filter, setFilter] = useState<"ALL" | LessonCategory>("ALL");
  const lessons = filter === "ALL" ? demoLessons : demoLessons.filter((lesson) => lesson.category === filter);

  return (
    <>
      <div className="filter-row" role="tablist" aria-label="Dars kategoriyalari">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>Barchasi</button>
        {(Object.keys(categoryLabels) as LessonCategory[]).map((category) => (
          <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>
            {categoryLabels[category][locale]}
          </button>
        ))}
      </div>

      <div className="lesson-grid">
        {lessons.map((lesson) => {
          const Icon = icons[lesson.category];
          const completed = lesson.progress === 100;
          return (
            <article className={`lesson-card tone-${lesson.category.toLowerCase()}`} key={lesson.slug}>
              <div className="lesson-art"><Icon size={48} /><span>{lesson.factValue}</span></div>
              <div className="lesson-card-body">
                <div className="lesson-meta"><b>{categoryLabels[lesson.category][locale]}</b><span><Clock3 size={13} /> {lesson.duration} min</span></div>
                <h2>{locale === "uz" ? lesson.titleUz : lesson.titleEn}</h2>
                <p>{locale === "uz" ? lesson.summaryUz : lesson.summaryEn}</p>
                {lesson.progress > 0 && (
                  <div className="lesson-progress"><span><i style={{ width: `${lesson.progress}%` }} /></span><small>{lesson.progress}%</small></div>
                )}
                <Link href={`/learn/${lesson.slug}`}>
                  {completed ? <><CheckCircle2 size={17} /> Qayta ko‘rish</> : <>O‘rganish <ArrowRight size={17} /></>}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
