"use client";

import { Suspense, useState, type FormEvent } from "react";
import { Leaf, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return <Suspense fallback={<main className="login-shell"><section className="login-card">EcoQadam yuklanmoqda…</section></main>}><LoginForm /></Suspense>;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("student01@ecoqadam.uz");
  const [password, setPassword] = useState("EcoQadam123!");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Kirish amalga oshmadi.");
      setPending(false);
      return;
    }

    router.replace(searchParams.get("next") || "/");
    router.refresh();
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-mark"><Leaf size={26} /></div>
        <p className="eyebrow">EcoQadam</p>
        <h1>Yaxshi odatlar shu yerdan boshlanadi.</h1>
        <p className="muted">Iqlimni o‘rganing, amalda sinang va Xorazm uchun ta’siringizni o‘lchang.</p>

        <form onSubmit={submit} className="login-form">
          <label>
            Email yoki telefon
            <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" />
          </label>
          <label>
            Parol
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={pending}>
            {pending ? <LoaderCircle className="spin" size={18} /> : <LockKeyhole size={18} />}
            Kirish
          </button>
        </form>

        <div className="demo-note">
          <strong>Demo o‘quvchi</strong>
          <span>student01@ecoqadam.uz · EcoQadam123!</span>
        </div>
      </section>
    </main>
  );
}
