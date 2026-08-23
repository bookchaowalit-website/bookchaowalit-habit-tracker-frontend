"use client";

import { useEffect, useMemo, useState } from "react";

type Habit = { id: string; name: string; checks: Record<string, boolean> };
const seedHabits: Habit[] = [{ id: "move", name: "Move for 20 min", checks: {} }, { id: "read", name: "Read before bed", checks: {} }, { id: "focus", name: "One deep-work block", checks: {} }];
function dateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function daysBack(count: number) { const today = new Date(); return Array.from({ length: count }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() - count + index + 1); return dateKey(date); }); }
function currentStreak(checks: Record<string, boolean>) { let total = 0; const today = new Date(); for (let i = 0; i < 365; i += 1) { const date = new Date(today); date.setDate(today.getDate() - i); if (!checks[dateKey(date)]) break; total += 1; } return total; }

export default function Home() {
  const days = useMemo(() => daysBack(14), []);
  const [habits, setHabits] = useState<Habit[]>(seedHabits);
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("habit-tracker-v2"); if (saved) setHabits(JSON.parse(saved) as Habit[]); } catch { /* preserve the starter lanes */ } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("habit-tracker-v2", JSON.stringify(habits)); }, [habits, ready]);
  const completedToday = habits.filter((habit) => habit.checks[days[days.length - 1]]).length;
  const totalSignals = habits.reduce((total, habit) => total + days.filter((day) => habit.checks[day]).length, 0);
  function addHabit() { if (!name.trim()) return; setHabits((current) => [...current, { id: crypto.randomUUID(), name: name.trim(), checks: {} }]); setName(""); }
  function toggle(id: string, day: string) { setHabits((current) => current.map((habit) => habit.id === id ? { ...habit, checks: { ...habit.checks, [day]: !habit.checks[day] } } : habit)); }

  return <main className="patchbay-shell">
    <header className="patchbay-header"><div className="machine-mark" aria-hidden="true"><span /><span /><span /></div><div><p className="eyebrow">SOLO OPERATIONS / DAILY SIGNALS</p><h1>Keep the circuit alive.</h1><p className="lede">A 14-day patchbay for the small actions that keep a good day connected.</p></div><div className="status-readout"><span>LOCAL MEMORY</span><strong>ON</strong><span>no account · no sync</span></div></header>
    <div className="amber-line" />
    <section className="readouts" aria-label="Habit tracker summary"><div><span>LIVE LANES</span><strong>{String(habits.length).padStart(2, "0")}</strong></div><div><span>TODAY</span><strong>{completedToday}/{habits.length || 0}</strong></div><div><span>14-DAY SIGNALS</span><strong>{String(totalSignals).padStart(2, "0")}</strong></div><p>Tap a cell to close the circuit for that day.</p></section>
    <section className="console" aria-labelledby="lanes-heading"><div className="console-top"><div><span className="section-label">PATCH SCHEDULE / 14 DAYS</span><h2 id="lanes-heading">Your lanes</h2></div><div className="legend"><span className="legend-wire active" /> completed <span className="legend-wire" /> open</div></div>
      <div className="table-wrap"><table><thead><tr><th scope="col">Lane</th>{days.map((day, index) => <th scope="col" key={day}><span>{index === days.length - 1 ? "NOW" : day.slice(5)}</span></th>)}<th scope="col">Streak</th><th scope="col"><span className="sr-only">Remove</span></th></tr></thead><tbody>{habits.map((habit, row) => <tr key={habit.id}><th scope="row"><span className="lane-number">{String(row + 1).padStart(2, "0")}</span>{habit.name}</th>{days.map((day) => <td key={day}><button type="button" aria-label={`${habit.checks[day] ? "Unmark" : "Mark"} ${habit.name} on ${day}`} aria-pressed={Boolean(habit.checks[day])} className={`patch ${habit.checks[day] ? "patched" : ""}`} onClick={() => toggle(habit.id, day)}><span /></button></td>)}<td className="streak">{currentStreak(habit.checks)}<small>d</small></td><td><button className="remove" type="button" onClick={() => setHabits((current) => current.filter((item) => item.id !== habit.id))} aria-label={`Remove ${habit.name}`}>×</button></td></tr>)}</tbody></table></div>
      {habits.length === 0 && <p className="empty">No lanes are patched. Add one below to restore the schedule.</p>}
      <div className="add-lane"><label htmlFor="new-habit">Open a new lane</label><input id="new-habit" value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addHabit(); }} placeholder="e.g. Drink water" /><button type="button" onClick={addHabit}>Patch lane <span>+</span></button></div>
    </section>
    <footer className="patchbay-footer"><span>HABIT TRACKER / BUILD 02</span><span>Data stays on this device.</span></footer>
  </main>;
}
