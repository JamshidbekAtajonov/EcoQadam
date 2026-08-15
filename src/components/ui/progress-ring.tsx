export function ProgressRing({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress-ring" style={{ "--progress": `${Math.min(100, Math.max(0, value)) * 3.6}deg` } as React.CSSProperties}>
      <span><strong>{value}%</strong>{label && <small>{label}</small>}</span>
    </div>
  );
}
