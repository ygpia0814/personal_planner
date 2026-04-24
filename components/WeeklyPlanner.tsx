"use client";

import { useEffect, useState } from "react";
import DayColumn from "./DayColumn";
import {
  Task,
  storage,
  getTodayISO,
  getRollingWeek,
  formatDate,
  getDayName,
} from "@/lib/storage";

const DAY_IMAGES: Record<string, string> = {
  Monday:    "/yujiro hanma.jpeg",
  Tuesday:   "/Baki Hanma.jpeg",
  Wednesday: "/Musashi Miyamoto.jpeg",
  Thursday:  "/oliver.jpeg",
  Friday:    "/jack hanma.jpeg",
  Saturday:  "/hanayama.jpeg",
  Sunday:    "/Pickle Baki Hanma.jpeg",
};

export default function WeeklyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTasks(storage.loadTasks());
    setReady(true);
  }, []);

  function addTask(text: string, date: string) {
    const task: Task = { id: crypto.randomUUID(), text, date, completed: false };
    const updated = [...tasks, task];
    setTasks(updated);
    storage.saveTasks(updated);
  }

  function toggleTask(id: string) {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    storage.saveTasks(updated);
  }

  function deleteTask(id: string) {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    storage.saveTasks(updated);
  }

  if (!ready) return null;

  const today = getTodayISO();
  const week = getRollingWeek();

  return (
    <div className="flex gap-3 max-w-screen-2xl mx-auto items-start overflow-x-auto pt-3 pb-3 px-2">
      {week.map((isoDate) => (
        <DayColumn
          key={isoDate}
          isoDate={isoDate}
          dayName={getDayName(isoDate)}
          displayDate={formatDate(isoDate)}
          isToday={isoDate === today}
          characterImage={DAY_IMAGES[getDayName(isoDate)]}
          tasks={tasks.filter((t) => t.date === isoDate)}
          onAddTask={(text, date) => addTask(text, date)}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      ))}
    </div>
  );
}
