import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, detail, tone = "green" }: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "green" | "blue" | "orange" | "purple";
}) {
  return (
    <article className={`stat-card ${tone}`}>
      <span className="stat-icon"><Icon size={20} /></span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
