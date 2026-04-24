"use client";

import { useEffect, useState } from "react";
import { storage, getTodayISO, addDays } from "@/lib/storage";
import { Task } from "@/lib/storage";

export default function NotificationBanner() {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [tomorrowTasks, setTomorrowTasks] = useState<Task[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const today = getTodayISO();
    const tomorrow = addDays(today, 1);
    const all = storage.loadTasks();
    setTodayTasks(all.filter((t) => t.date === today && !t.completed));
    setTomorrowTasks(all.filter((t) => t.date === tomorrow && !t.completed));
  }, []);

  if (dismissed) return null;
  if (todayTasks.length === 0 && tomorrowTasks.length === 0) return null;

  return (
    <div
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      className="fixed top-4 right-4 z-50 w-80 bg-black/80 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            Task Reminder
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/40 hover:text-white text-sm transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-3 space-y-4 max-h-72 overflow-y-auto">
        {todayTasks.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1.5">
              Due Today ({todayTasks.length})
            </p>
            <ul className="space-y-1">
              {todayTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tomorrowTasks.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-1.5">
              Due Tomorrow ({tomorrowTasks.length})
            </p>
            <ul className="space-y-1">
              {tomorrowTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-2 text-sm text-white/80">
                  <span className="w-1 h-1 rounded-full bg-teal-400 shrink-0" />
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
