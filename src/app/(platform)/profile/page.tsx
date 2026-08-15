import type { Metadata } from "next";
import { Award, BookOpen, Droplets, Leaf, LogOut, School, ShieldCheck, Target } from "lucide-react";
import { requireUser } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-large-avatar">{user.name.slice(0, 1)}</div>
        <div><p className="eyebrow">EcoQadam profili</p><h1>{user.name}</h1><span><School size={14} /> Urganch 12-maktab · 7-A sinf</span></div>
        <div className="profile-level"><Award size={24} /><span><strong>3-daraja</strong><small>Yashil izlovchi</small></span></div>
      </section>
      <section className="profile-quick-stats">
        <article><BookOpen size={20} /><strong>4 / 6</strong><span>yakunlangan dars</span></article>
        <article><Target size={20} /><strong>8</strong><span>bajarilgan vazifa</span></article>
        <article><Droplets size={20} /><strong>185 L</strong><span>tejalgan suv</span></article>
        <article><Leaf size={20} /><strong>720</strong><span>eco ball</span></article>
      </section>
      <section className="profile-settings-card">
        <div><ShieldCheck size={20} /><span><strong>Hisob va xavfsizlik</strong><small>Email/telefon, parol va qurilma sinxronlash sozlamalari.</small></span><button>Sozlash</button></div>
        <div><Leaf size={20} /><span><strong>Til va ko‘rinish</strong><small>O‘zbek tili standart; yuqoridagi UZ/EN tugmasi bilan almashtiring.</small></span></div>
        <div><LogOut size={20} /><span><strong>Seansdan chiqish</strong><small>Profil menyusidagi “Chiqish” orqali xavfsiz yakunlang.</small></span></div>
      </section>
    </div>
  );
}
