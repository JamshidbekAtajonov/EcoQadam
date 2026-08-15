"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CloudOff, RefreshCw } from "lucide-react";

type QueueItem = { id: string; type: string; payload: Record<string, unknown>; createdAt: string };

const endpoints: Record<string, string> = {
  lesson_progress: "/api/learn/progress",
  quiz_attempt: "/api/quiz/attempt",
  challenge_progress: "/api/challenges/progress",
};

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [queued, setQueued] = useState(0);

  const refreshCount = useCallback(() => {
    const queue = JSON.parse(localStorage.getItem("ecoqadam_offline_queue") ?? "[]") as QueueItem[];
    setQueued(queue.length);
    return queue;
  }, []);

  const flushQueue = useCallback(async () => {
    if (!navigator.onLine) return;
    const queue = refreshCount();
    if (!queue.length) return;
    setSyncing(true);
    const remaining: QueueItem[] = [];
    let completed = 0;

    for (const item of queue) {
      const endpoint = endpoints[item.type];
      if (!endpoint) continue;
      try {
        const payload = item.type === "quiz_attempt" ? { ...item.payload, syncId: item.id } : item.payload;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) remaining.push(item);
        else completed += 1;
      } catch {
        remaining.push(item);
      }
    }

    localStorage.setItem("ecoqadam_offline_queue", JSON.stringify(remaining));
    setQueued(remaining.length);
    setSyncing(false);
    if (completed > 0) {
      setSynced(true);
      window.setTimeout(() => setSynced(false), 3500);
    }
  }, [refreshCount]);

  useEffect(() => {
    window.setTimeout(refreshCount, 0);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then(() => flushQueue()).catch(() => undefined);
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SYNC_REQUEST") flushQueue();
      });
    }
    const goOnline = () => { setOnline(true); flushQueue(); };
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    const timer = window.setInterval(refreshCount, 5000);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.clearInterval(timer);
    };
  }, [flushQueue, refreshCount]);

  return (
    <>
      {children}
      {!online && <div className="connection-pill offline"><CloudOff size={15} /><span><strong>Offline rejim</strong><small>Natijalar qurilmada saqlanadi</small></span>{queued > 0 && <b>{queued}</b>}</div>}
      {online && syncing && <div className="connection-pill syncing"><RefreshCw className="spin" size={15} /><span><strong>Sinxronlanmoqda</strong><small>{queued} ta natija</small></span></div>}
      {online && synced && <div className="connection-pill synced"><CheckCircle2 size={15} /><span><strong>Sinxronlandi</strong><small>Barcha natijalar serverda</small></span></div>}
    </>
  );
}
