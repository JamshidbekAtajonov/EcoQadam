"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Camera, CheckCircle2, Droplets, Filter, MapPin, Search, Send, Sprout, TriangleAlert, XCircle } from "lucide-react";
import { demoTrees } from "@/data/demo";
import { calculateTreeSurvival } from "@/lib/impact";

const statusCopy = {
  HEALTHY: { label: "Sog‘lom", icon: CheckCircle2 },
  NEEDS_ATTENTION: { label: "E’tibor kerak", icon: TriangleAlert },
  DEAD: { label: "Nobud bo‘lgan", icon: XCircle },
};

export function TreeMonitoring() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | keyof typeof statusCopy>("ALL");
  const [selectedTree, setSelectedTree] = useState(demoTrees[0].identifier);
  const [notice, setNotice] = useState("");
  const survived = demoTrees.filter((tree) => tree.survived).length;
  const filtered = useMemo(() => demoTrees.filter((tree) =>
    (status === "ALL" || tree.status === status) &&
    `${tree.identifier} ${tree.species} ${tree.school}`.toLowerCase().includes(query.toLowerCase()),
  ), [query, status]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/trees/monitor", { method: "POST", body: new FormData(event.currentTarget) });
    const data = await response.json();
    setNotice(response.ok ? "Monitoring qaydi saqlandi." : data.message ?? "Qayd saqlanmadi.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <div className="tree-layout">
      <section className="tree-main">
        <div className="tree-summary-row">
          <article><Sprout size={21} /><span><strong>{demoTrees.length}</strong><small>monitoringdagi daraxt</small></span></article>
          <article><CheckCircle2 size={21} /><span><strong>{survived}</strong><small>yashab qolgan</small></span></article>
          <article><TriangleAlert size={21} /><span><strong>{demoTrees.filter((tree) => tree.status === "NEEDS_ATTENTION").length}</strong><small>e’tibor talab qiladi</small></span></article>
          <article><span><strong>{calculateTreeSurvival(survived, demoTrees.length)}%</strong><small>yashab qolish darajasi</small></span></article>
        </div>
        <div className="tree-toolbar">
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ID, tur yoki maktab..." /></label>
          <label><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="ALL">Barcha holatlar</option><option value="HEALTHY">Sog‘lom</option><option value="NEEDS_ATTENTION">E’tibor kerak</option><option value="DEAD">Nobud bo‘lgan</option></select></label>
        </div>
        <div className="tree-table-wrap">
          <table className="tree-table"><thead><tr><th>Daraxt</th><th>Joylashuv</th><th>Oxirgi tekshiruv</th><th>Holati</th></tr></thead><tbody>
            {filtered.map((tree) => {
              const StatusIcon = statusCopy[tree.status].icon;
              return <tr key={tree.identifier} onClick={() => setSelectedTree(tree.identifier)}><td><span className="tree-dot"><Sprout size={18} /></span><span><strong>{tree.identifier}</strong><small>{tree.species} · {tree.plantedAt}</small></span></td><td><span><strong>{tree.school}</strong><small><MapPin size={10} /> {tree.area}</small></span></td><td>{tree.lastCheckedAt}</td><td><b className={`tree-status ${tree.status.toLowerCase()}`}><StatusIcon size={13} />{statusCopy[tree.status].label}</b></td></tr>;
            })}
          </tbody></table>
        </div>
      </section>

      <aside className="monitor-form-card">
        <p className="eyebrow">Yangi qayd</p><h2>Daraxtni tekshirish</h2><p>Surat va joriy holatni kiriting.</p>
        <form onSubmit={submit}>
          <label>Daraxt<select name="treeIdentifier" value={selectedTree} onChange={(event) => setSelectedTree(event.target.value)}>{demoTrees.map((tree) => <option key={tree.identifier}>{tree.identifier}</option>)}</select></label>
          <label>Holati<select name="status" defaultValue="HEALTHY"><option value="HEALTHY">Sog‘lom</option><option value="NEEDS_ATTENTION">E’tibor kerak</option><option value="DEAD">Nobud bo‘lgan</option></select></label>
          <label className="check-line"><input type="checkbox" name="watered" /><Droplets size={15} /> Bugun sug‘orildi</label>
          <label className="photo-drop small"><Camera size={20} /><span>Monitoring rasmi</span><input type="file" name="file" accept="image/jpeg,image/png,image/webp" /></label>
          <label>Izoh<textarea name="notes" placeholder="Barglar, tuproq va umumiy holat..." /></label>
          <button className="primary-button"><Send size={16} /> Qaydni saqlash</button>
        </form>
        {notice && <p className="action-message">{notice}</p>}
      </aside>
    </div>
  );
}
