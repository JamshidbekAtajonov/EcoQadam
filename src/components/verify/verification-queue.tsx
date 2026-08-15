"use client";

import { useState } from "react";
import { Check, Clock3, Droplets, ImageIcon, MessageSquare, X } from "lucide-react";

const initialItems = [
  { id: "demo-participation-1", student: "Aziza Karimova", className: "7-A", challenge: "7 kun suvni tejash", submitted: "Bugun, 10:24", value: "105 L", days: "7 / 7", evidence: 2 },
  { id: "demo-participation-2", student: "Bekzod Rasulov", className: "8-B", challenge: "10 kg chiqindini saralash", submitted: "Kecha, 16:05", value: "10.4 kg", days: "5 qayd", evidence: 3 },
  { id: "demo-participation-3", student: "Madina Sobirova", className: "7-A", challenge: "Daraxtni 30 kun parvarishlash", submitted: "1-avgust, 14:42", value: "1 daraxt", days: "30 / 30", evidence: 5 },
];

export function VerificationQueue() {
  const [items, setItems] = useState(initialItems);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");

  async function decide(id: string, decision: "APPROVED" | "REJECTED") {
    if (decision === "REJECTED" && !reason.trim()) {
      setNotice("Rad etish sababini yozing.");
      return;
    }
    const response = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ participationId: id, decision, reason: decision === "REJECTED" ? reason : undefined }) });
    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id));
      setNotice(decision === "APPROVED" ? "Natija tasdiqlandi va dashboardga qo‘shildi." : "Natija sabab bilan o‘quvchiga qaytarildi.");
      setRejecting(null);
      setReason("");
    } else {
      const data = await response.json();
      setNotice(data.message ?? "Amal bajarilmadi.");
    }
  }

  return (
    <section className="verification-list">
      {notice && <p className="verify-notice">{notice}</p>}
      {items.length === 0 && <div className="empty-state"><Check size={31} /><h2>Navbat toza</h2><p>Barcha yuborilgan natijalar tekshirildi.</p></div>}
      {items.map((item) => (
        <article key={item.id} className="verification-item">
          <div className="student-avatar">{item.student.split(" ").map((part) => part[0]).join("")}</div>
          <div className="verification-main">
            <div className="verification-title"><div><strong>{item.student}</strong><span>{item.className} · {item.challenge}</span></div><small><Clock3 size={12} /> {item.submitted}</small></div>
            <div className="verification-metrics">
              <span><Droplets size={16} /><b>{item.value}</b><small>hisoblangan ta’sir</small></span>
              <span><Check size={16} /><b>{item.days}</b><small>kunlik qaydlar</small></span>
              <span><ImageIcon size={16} /><b>{item.evidence} rasm</b><small>dalil</small></span>
              <span><MessageSquare size={16} /><b>Izoh bor</b><small>o‘quvchi qaydi</small></span>
            </div>
            {rejecting === item.id && (
              <div className="reject-box"><label>Rad etish sababi<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="O‘quvchiga nima tuzatish kerakligini tushuntiring..." /></label><button onClick={() => decide(item.id, "REJECTED")}>Sabab bilan qaytarish</button></div>
            )}
          </div>
          <div className="verification-actions">
            <button className="approve" onClick={() => decide(item.id, "APPROVED")}><Check size={17} /> Tasdiqlash</button>
            <button className="reject" onClick={() => setRejecting(rejecting === item.id ? null : item.id)}><X size={17} /> Rad etish</button>
          </div>
        </article>
      ))}
    </section>
  );
}
