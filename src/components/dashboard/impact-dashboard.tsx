"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, CheckCircle2, Droplets, Sprout, Trees, UsersRound } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import type { AppRole } from "@/lib/auth/permissions";

type Scope = "student" | "class" | "school" | "mahalla" | "district";

const scopeLabels: Record<Scope, string> = { student: "O‘quvchi", class: "Sinf", school: "Maktab", mahalla: "Mahalla", district: "Tuman" };
const scopeScale: Record<Scope, number> = { student: 1, class: 18, school: 210, mahalla: 430, district: 1180 };
const trends = [
  { month: "Mar", water: 760, tasks: 32 }, { month: "Apr", water: 1080, tasks: 48 },
  { month: "May", water: 1420, tasks: 63 }, { month: "Iyun", water: 1930, tasks: 84 },
  { month: "Iyul", water: 2640, tasks: 112 }, { month: "Avg", water: 3180, tasks: 136 },
];
const schoolRanking = [
  { name: "12-maktab", score: 940, water: 3180 },
  { name: "7-maktab", score: 835, water: 2720 },
  { name: "21-maktab", score: 690, water: 2310 },
  { name: "5-maktab", score: 605, water: 1940 },
];

export function ImpactDashboard({ role }: { role: AppRole }) {
  const allowedScopes = scopesForRole(role);
  const [scope, setScope] = useState<Scope>(allowedScopes[0]);
  const [liveSummary, setLiveSummary] = useState<{ water?: number; tasks?: number; students?: number } | null>(null);
  const scale = scopeScale[scope];
  const metrics = useMemo(() => ({
    water: liveSummary?.water ?? Math.round(185 * scale),
    tasks: liveSummary?.tasks ?? Math.round(8 * scale * .72),
    trees: Math.max(3, Math.round(3 * scale * .16)),
    survival: scope === "student" ? 100 : 90,
    active: liveSummary?.students ?? Math.max(1, Math.round(scale * .81)),
  }), [liveSummary, scale, scope]);

  useEffect(() => {
    fetch(`/api/dashboard/summary?scope=${scope}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setLiveSummary(data.summary))
      .catch(() => setLiveSummary(null));
  }, [scope]);

  return (
    <div className="impact-dashboard">
      <div className="scope-tabs" role="tablist">
        {allowedScopes.map((item) => <button key={item} className={scope === item ? "active" : ""} onClick={() => setScope(item)}>{scopeLabels[item]}</button>)}
      </div>

      <div className="dashboard-stats">
        <StatCard icon={Droplets} label="Tejalgan suv" value={`${metrics.water.toLocaleString()} L`} detail="Tasdiqlangan natija" tone="blue" />
        <StatCard icon={CheckCircle2} label="Bajarilgan vazifa" value={`${metrics.tasks.toLocaleString()} ta`} detail="+12% oxirgi oy" tone="green" />
        <StatCard icon={Trees} label="Parvarishlangan" value={`${metrics.trees.toLocaleString()} daraxt`} detail={`${metrics.survival}% yashab qolgan`} tone="orange" />
        <StatCard icon={UsersRound} label="Faol o‘quvchilar" value={metrics.active.toLocaleString()} detail="Oxirgi 30 kun" tone="purple" />
      </div>

      <div className="dashboard-chart-grid">
        <article className="chart-card trend-card">
          <header><div><p className="eyebrow">Dinamika</p><h2>Vaqt bo‘yicha ta’sir</h2></div><span><i /> Tejalgan suv</span></header>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.map((item) => ({ ...item, water: Math.round(item.water * Math.max(1, scale / 210)) }))} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs><linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a98d0" stopOpacity={0.34}/><stop offset="100%" stopColor="#3a98d0" stopOpacity={0.02}/></linearGradient></defs>
                <CartesianGrid stroke="#e9efed" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "#7c8e88" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 8, fill: "#9aaba5" }} />
                <Tooltip contentStyle={{ border: "1px solid #dfe9e5", borderRadius: 12, fontSize: 10 }} />
                <Area type="monotone" dataKey="water" stroke="#2e83c6" strokeWidth={2.5} fill="url(#waterFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card survival-card">
          <header><div><p className="eyebrow">Daraxtlar</p><h2>Yashab qolish</h2></div><Sprout size={20} /></header>
          <div className="survival-chart">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: "Survived", value: metrics.survival }, { name: "Lost", value: 100 - metrics.survival }]} innerRadius={56} outerRadius={72} startAngle={90} endAngle={-270} dataKey="value" stroke="none"><Cell fill="#3cbd82"/><Cell fill="#e8efec"/></Pie></PieChart></ResponsiveContainer>
            <span><strong>{metrics.survival}%</strong><small>yashab qolgan</small></span>
          </div>
          <div className="survival-legend"><span><i className="healthy" /> {Math.round(metrics.trees * metrics.survival / 100)} sog‘lom</span><span><i className="lost" /> {Math.round(metrics.trees * (100 - metrics.survival) / 100)} nobud</span></div>
        </article>
      </div>

      <div className="dashboard-chart-grid lower">
        <article className="chart-card ranking-chart">
          <header><div><p className="eyebrow">Reyting</p><h2>Eng faol maktablar</h2></div><Activity size={19} /></header>
          <div className="bar-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={schoolRanking} layout="vertical" margin={{ top: 4, right: 15, left: 5, bottom: 0 }}><CartesianGrid stroke="#edf2f0" horizontal={false}/><XAxis type="number" hide/><YAxis type="category" dataKey="name" width={75} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#51665f" }}/><Tooltip contentStyle={{ border: "1px solid #dfe9e5", borderRadius: 12, fontSize: 10 }}/><Bar dataKey="score" fill="#3cbd82" radius={[0, 7, 7, 0]} barSize={15}/></BarChart></ResponsiveContainer></div>
        </article>
        <article className="leaderboard-card">
          <header><p className="eyebrow">Top natijalar</p><h2>Maktab reytingi</h2></header>
          <ol>{schoolRanking.map((school, index) => <li key={school.name}><b>{index + 1}</b><span><strong>{school.name}</strong><small>{school.water.toLocaleString()} L suv tejaldi</small></span><em>{school.score} ball</em></li>)}</ol>
        </article>
      </div>
    </div>
  );
}

function scopesForRole(role: AppRole): Scope[] {
  if (role === "DISTRICT_ADMIN") return ["district", "mahalla", "school", "class", "student"];
  if (role === "SCHOOL_ADMIN") return ["school", "class", "student"];
  if (role === "TEACHER") return ["class", "student"];
  return ["student"];
}
