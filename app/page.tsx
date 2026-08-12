"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Local mini-app · state in this browser
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Data is stored in localStorage on this origin only. Portfolio demo — not a multi-user product.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

function uid() {
  return crypto.randomUUID();
}

type Habit = { id: string; name: string; checks: Record<string, boolean> };

function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function lastNDays(n: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(dateKey(d));
  }
  return out;
}

function streak(checks: Record<string, boolean>) {
  let s = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    if (checks[dateKey(d)]) s++;
    else break;
  }
  return s;
}

export default function Home() {
  const days = useMemo(() => lastNDays(14), []);
  const [habits, setHabits] = useLocalStorage<Habit[]>("habit-tracker-v1", [
    { id: "1", name: "Exercise", checks: {} },
    { id: "2", name: "Read 20 min", checks: {} },
    { id: "3", name: "No doomscroll", checks: {} },
  ]);
  const [name, setName] = useState("");

  const toggle = (id: string, day: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, checks: { ...h.checks, [day]: !h.checks[day] } } : h
      )
    );
  };

  return (
    <Shell title="Habit Tracker" subtitle="Mark daily habits for the last two weeks. Streaks update as you check today.">
      <div className="mb-4 flex gap-2">
        <input
          className={inputClass}
          placeholder="New habit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              setHabits((prev) => [...prev, { id: uid(), name: name.trim(), checks: {} }]);
              setName("");
            }
          }}
        />
        <Button
          onClick={() => {
            if (!name.trim()) return;
            setHabits((prev) => [...prev, { id: uid(), name: name.trim(), checks: {} }]);
            setName("");
          }}
        >
          Add habit
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-3 py-2 text-left font-medium">Habit</th>
              {days.map((d) => (
                <th key={d} className="px-1 py-2 text-center text-xs font-normal text-zinc-500">
                  {d.slice(5)}
                </th>
              ))}
              <th className="px-3 py-2 text-right font-medium">Streak</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {habits.map((h) => (
              <tr key={h.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="px-3 py-2 font-medium">{h.name}</td>
                {days.map((d) => (
                  <td key={d} className="px-1 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => toggle(h.id, d)}
                      className={`h-7 w-7 rounded-md border text-xs ${
                        h.checks[d]
                          ? "border-emerald-600 bg-emerald-500 text-white"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                      aria-label={`Toggle ${h.name} on ${d}`}
                    >
                      {h.checks[d] ? "✓" : ""}
                    </button>
                  </td>
                ))}
                <td className="px-3 py-2 text-right tabular-nums">{streak(h.checks)}</td>
                <td className="px-2 py-2">
                  <Button variant="ghost" onClick={() => setHabits((prev) => prev.filter((x) => x.id !== h.id))}>
                    ×
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
