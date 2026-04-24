import { useState } from "react";

type Props = {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
};

export default function Login({ onSubmit, loading, error }: Props) {
  const [email, setEmail] = useState("grupo@32kt.com");
  const [password, setPassword] = useState("123456");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(email.trim(), password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-brand-panel border border-brand-border rounded-2xl shadow-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-black text-lg">
            S
          </div>
          <div>
            <div className="text-brand-text font-bold text-lg leading-tight">SecondServing</div>
            <div className="text-[11px] text-brand-dim leading-tight">Analytics Dashboard</div>
          </div>
        </div>

        <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          className="w-full bg-brand-panel2 border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-primary mb-4"
        />

        <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full bg-brand-panel2 border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-primary mb-4"
        />

        {error && (
          <div className="text-brand-danger text-xs mb-4 text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-3 py-2 rounded-lg text-sm font-semibold bg-brand-primary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
