"use client";

import { useEffect, useState } from "react";
import { storage, getTodayISO } from "@/lib/storage";

function buildPendingCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const task of storage.loadTasks()) {
    if (!task.completed && task.date) {
      counts[task.date] = (counts[task.date] ?? 0) + 1;
    }
  }
  return counts;
}

export default function Calendar({ onDateClick }: { onDateClick?: (isoDate: string) => void }) {
  const [pendingDates, setPendingDates] = useState<Record<string, number>>({});
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    setPendingDates(buildPendingCounts());
  }, []);

  const [year, month] = currentMonth.split("-").map(Number);
  const startDow = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month, 0).getDate();
  const todayISO = getTodayISO();

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  function nextMonth() {
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  return (
    <div
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      className="bg-black/50 border border-white/10 rounded-xl p-6 max-w-lg mx-auto shadow-xl"
    >
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="text-white/40 hover:text-white text-xl px-2 py-1 rounded hover:bg-white/10 transition-colors"
        >
          ‹
        </button>
        <h3 className="font-bold text-white tracking-wide">{monthLabel}</h3>
        <button
          onClick={nextMonth}
          className="text-white/40 hover:text-white text-xl px-2 py-1 rounded hover:bg-white/10 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-xs text-white/30 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-10" />;
          const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = iso === todayISO;
          const count = pendingDates[iso] ?? 0;

          return (
            <div
              key={i}
              title={count > 0 ? `${count} pending task${count > 1 ? "s" : ""}` : undefined}
              onClick={() => count > 0 && onDateClick?.(iso)}
              className={`relative flex flex-col items-center justify-center h-10 rounded-lg text-sm transition-colors ${
                count > 0 ? "cursor-pointer" : "cursor-default"
              } ${
                isToday
                  ? "bg-teal-400 text-black font-black"
                  : count > 0
                  ? "text-white hover:bg-white/15"
                  : "text-white/30"
              }`}
            >
              {day}
              {count > 0 && (
                <span
                  className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                    isToday ? "bg-black/50" : "bg-red-400"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
        Days with pending tasks
      </div>
    </div>
  );
}
