"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import WeeklyPlanner from "@/components/WeeklyPlanner";
import Calendar from "@/components/Calendar";
import { getTodayISO } from "@/lib/storage";

export default function Home() {
  const router = useRouter();

  function handleDateClick(isoDate: string) {
    const today = getTodayISO();
    if (isoDate < today) {
      router.push("/old-tasks");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        const el = document.getElementById(`day-col-${isoDate}`);
        if (!el) return;
        el.classList.remove("glow-highlight");
        void el.offsetWidth;
        el.classList.add("glow-highlight");
        setTimeout(() => el.classList.remove("glow-highlight"), 3200);
      }, 400);
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto mb-8">
        <img src="/logo.png" alt="Logo" className="h-28 w-auto object-contain" />
        <Link
          href="/old-tasks"
          className="bg-black/50 hover:bg-black/70 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors border border-white/20 backdrop-blur-sm"
        >
          Past Tasks
        </Link>
      </div>

      <WeeklyPlanner />

      <div className="mt-12">
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest text-center mb-5">
          Task Calendar
        </h2>
        <Calendar onDateClick={handleDateClick} />
      </div>
    </main>
  );
}
