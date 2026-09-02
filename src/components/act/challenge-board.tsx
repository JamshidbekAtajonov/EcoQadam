"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Camera, Check, Clock3, Droplets, Flag, LoaderCircle, MapPin, Recycle, Send, Sprout, Users } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { demoChallenges } from "@/data/demo";
import { calculateWaterSaved } from "@/lib/impact";

const challengeIcons = { WATER: Droplets, WASTE: Recycle, TREE_CARE: Sprout, AIR: MapPin, DROUGHT: Flag };

export function ChallengeBoard() {
  const { locale } = useLanguage();
  const active = demoChallenges[0];
  const [days, setDays] = useState([true, true, true, true, false, false, false]);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const completedDays = days.filter(Boolean).length;
  const waterSaved = useMemo(() => calculateWaterSaved(completedDays), [completedDays]);

  async function toggleDay(dayIndex: number) {
    const nextCompleted = !days[dayIndex];
    setDays((current) => current.map((done, index) => index === dayIndex ? nextCompleted : done));
    const payload = { challengeSlug: active.slug, dayIndex, completed: nextCompleted };
    try {
      const response = await fetch("/api/challenges/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("offline");
    } catch {
      queueOffline("challenge_progress", payload);
      setMessage("Natija qurilmada saqlandi — internet kelganda yuboriladi.");
    }
  }

  async function startChallenge(challengeSlug: string) {
    setMessage("");
    const response = await fetch("/api/challenges/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challengeSlug }) });
    setMessage(response.ok ? "Vazifa boshlandi. Faol vazifalar qatoriga qo‘shildi." : "Vazifani boshlash uchun ma’lumotlar bazasini ishga tushiring.");
  }

  async function submitForReview() {
    setPending(true);
    setMessage("");
    try {
      if (file) {
        const form = new FormData();
        form.set("file", file);
        form.set("challengeSlug", active.slug);
        form.set("caption", comment);
        const upload = await fetch("/api/evidence", { method: "POST", body: form });
        if (!upload.ok) throw new Error((await upload.json()).message ?? "Rasm yuklanmadi");
      }
      const response = await fetch("/api/challenges/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeSlug: active.slug, comment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage("Natija o‘qituvchiga tekshirish uchun yuborildi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Yuborib bo‘lmadi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="challenge-board">
      <section className="active-action-panel">
        <div className="action-panel-top">
          <div className="challenge-icon"><Droplets size={28} /></div>
          <div><p className="card-kicker">Faol vazifa · suv</p><h2>{locale === "uz" ? active.titleUz : active.titleEn}</h2><span><CalendarDays size={14} /> 29-iyul — 4-avgust</span></div>
          <div className="impact-live"><small>Hozirgacha</small><strong>{waterSaved} L</strong><span>taxminiy suv tejaldi</span></div>
        </div>

        <div className="action-days">
          {days.map((done, dayIndex) => (
            <button key={dayIndex} className={done ? "done" : dayIndex === completedDays ? "today" : ""} onClick={() => toggleDay(dayIndex)}>
              <span>{done ? <Check size={18} /> : dayIndex + 1}</span><strong>{dayIndex + 1}-kun</strong><small>{done ? "Bajarildi" : dayIndex === completedDays ? "Bugun" : "Kutilmoqda"}</small>
            </button>
          ))}
        </div>

        <div className="evidence-form">
          <label className="photo-drop"><Camera size={21} /><span>{file ? file.name : "Rasm qo‘shish"}</span><small>JPG, PNG yoki WebP · 4 MB</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
          <label className="comment-field"><span>Bugungi izoh</span><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Qanday suv tejadingiz?" /></label>
          <button className="primary-button" onClick={submitForReview} disabled={pending}>
            {pending ? <LoaderCircle className="spin" size={17} /> : <Send size={17} />} Tekshirishga yuborish
          </button>
        </div>
        {message && <p className="action-message" role="status">{message}</p>}
      </section>

      <section>
        <div className="section-heading"><div><h2>Yangi vazifani tanlang</h2><p>Har bir vazifa o‘lchanadigan haqiqiy natija beradi.</p></div></div>
        <div className="challenge-catalog">
          {demoChallenges.slice(1).map((challenge) => {
            const Icon = challengeIcons[challenge.category];
            return (
              <article key={challenge.slug} className={`challenge-catalog-card tone-${challenge.category.toLowerCase()}`}>
                <span className="catalog-icon"><Icon size={25} /></span>
                <p className="card-kicker">{challenge.unit}</p>
                <h3>{locale === "uz" ? challenge.titleUz : challenge.titleEn}</h3>
                <p>{locale === "uz" ? challenge.descriptionUz : challenge.descriptionEn}</p>
                <div className="catalog-meta"><span><Clock3 size={13} /> {challenge.durationDays} kun</span><span><Users size={13} /> {challenge.joined} ishtirokchi</span></div>
                <button className="secondary-button" onClick={() => startChallenge(challenge.slug)}>Vazifani boshlash</button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function queueOffline(type: string, payload: unknown) {
  const queue = JSON.parse(localStorage.getItem("ecoqadam_offline_queue") ?? "[]");
  queue.push({ id: crypto.randomUUID(), type, payload, createdAt: new Date().toISOString() });
  localStorage.setItem("ecoqadam_offline_queue", JSON.stringify(queue));
}
