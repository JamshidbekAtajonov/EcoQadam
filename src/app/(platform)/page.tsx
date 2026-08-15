import Link from "next/link";
import { ArrowRight, BookOpen, Check, Droplets, Flame, Leaf, Sprout, Target, Trophy } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth/guards";

export default async function HomePage() {
  const user = await requireUser();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="dashboard-home">
      <section className="welcome-row">
        <div>
          <p className="eyebrow">3-avgust, dushanba</p>
          <h1>Salom, {firstName}! <span>👋</span></h1>
          <p>Bugun tabiat uchun yana bir kichik qadam tashlaymizmi?</p>
        </div>
        <div className="streak-pill"><Flame size={20} /> <strong>6 kun</strong><span>faol seriya</span></div>
      </section>

      <section className="home-hero-grid">
        <article className="continue-card">
          <div className="continue-visual">
            <span className="sun-dot" />
            <Droplets size={52} />
            <div className="water-lines"><i /><i /><i /></div>
          </div>
          <div className="continue-copy">
            <span className="card-kicker"><BookOpen size={15} /> Davom etayotgan dars</span>
            <h2>Har bir tomchi qadrli</h2>
            <p>Uyda va maktabda suvni tejashning oddiy usullari.</p>
            <div className="inline-progress"><span><i style={{ width: "65%" }} /></span><b>65%</b></div>
            <Link href="/learn/har-bir-tomchi-qadrli" className="primary-button">Davom etish <ArrowRight size={18} /></Link>
          </div>
        </article>

        <article className="overall-card">
          <div className="overall-top"><span><Trophy size={19} /> Umumiy natija</span><b>3-daraja</b></div>
          <ProgressRing value={72} label="yakunlandi" />
          <h3>Yashil izlovchi</h3>
          <p>Keyingi darajaga 280 ball qoldi</p>
          <div className="points-bar"><span style={{ width: "68%" }} /></div>
          <small>720 / 1000 ball</small>
        </article>
      </section>

      <section>
        <SectionHeading title="Faol vazifangiz" href="/act" />
        <article className="active-challenge-card">
          <div className="challenge-icon"><Droplets size={27} /></div>
          <div className="challenge-main">
            <p className="card-kicker">SUVNI TEJASH</p>
            <h3>7 kun suvni tejash</h3>
            <div className="day-checks">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <span key={day} className={day <= 4 ? "done" : day === 5 ? "today" : ""}>
                  {day <= 4 ? <Check size={15} /> : day}<small>{day === 5 ? "Bugun" : `${day}-kun`}</small>
                </span>
              ))}
            </div>
          </div>
          <div className="challenge-impact"><Droplets size={18} /><strong>60 L</strong><span>taxminiy tejaldi</span></div>
          <Link href="/act" className="secondary-button">Bugunni belgilash <ArrowRight size={17} /></Link>
        </article>
      </section>

      <section>
        <SectionHeading title="Sizning ta’siringiz" description="Tasdiqlangan vazifalaringiz natijasi" href="/dashboard" />
        <div className="stats-grid">
          <StatCard icon={Droplets} label="Tejalgan suv" value="185 L" detail="+45 L bu hafta" tone="blue" />
          <StatCard icon={Sprout} label="Parvarishlangan" value="3 daraxt" detail="Barchasi sog‘lom" />
          <StatCard icon={Target} label="Bajarilgan vazifa" value="8 ta" detail="+2 bu oy" tone="orange" />
          <StatCard icon={Leaf} label="Eco ball" value="720" detail="Sinfda 4-o‘rin" tone="purple" />
        </div>
      </section>
    </div>
  );
}
