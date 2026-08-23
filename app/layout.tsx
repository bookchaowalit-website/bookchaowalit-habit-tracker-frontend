import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata: Metadata = { title: "Habit Tracker | Bookchaowalit", description: "A 14-day local patchbay for daily habits.", metadataBase: new URL("https://bookchaowalit.com"), robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>
  {/* THESIS: Habit change is a live circuit; the visitor should see and close one signal at a time.
OWN-WORLD: A backlit machine-room jackfield: black glass, amber signal ink, lane numbers, hard ruled schedule.
STORY: Read the fixed lanes, tap a day to close its circuit, then add a new lane when the system changes.
FIRST VIEWPORT: The daily readout and 14-day patch schedule are the first thing on screen.
FORM: The add field opens a new lane; cells are the primary controls and checked cells are closed signals; direction seed 2694c587.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}
  <Analytics /><SpeedInsights />{children}</body></html>; }
