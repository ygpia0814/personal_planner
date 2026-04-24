"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Task, storage, getTodayISO, formatDate } from "@/lib/storage";

function TaskCard({
  task,
  onToggle,
  onDelete,
  onReschedule,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onReschedule: (date: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editDate, setEditDate] = useState(task.date);

  return (
    <div
      style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-colors ${
        task.completed
          ? "bg-black/30 border-white/5"
          : "bg-black/50 border-white/15"
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        className="mt-1 accent-teal-400 cursor-pointer shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            task.completed ? "line-through text-white/30" : "text-white/90"
          }`}
        >
          {task.text}
        </p>
        <p className="text-xs text-white/30 mt-0.5">Was scheduled: {formatDate(task.date)}</p>

        {editing ? (
          <div className="flex gap-2 mt-2 flex-wrap">
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="text-xs border border-white/20 bg-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-teal-400/50"
            />
            <button
              onClick={() => { onReschedule(editDate); setEditing(false); }}
              className="text-xs bg-teal-500 hover:bg-teal-400 text-black font-bold px-3 py-1 rounded-lg transition-colors"
            >
              Reschedule
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-white/40 hover:text-white/70 px-2 py-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setEditDate(task.date); setEditing(true); }}
            className="text-xs text-teal-400/70 hover:text-teal-300 mt-1 transition-colors"
          >
            Reschedule
          </button>
        )}
      </div>
      <button
        onClick={onDelete}
        className="text-white/20 hover:text-red-400 text-xs transition-colors shrink-0 mt-0.5"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
}

export default function OldTasksPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const today = getTodayISO();

  useEffect(() => {
    setAllTasks(storage.loadTasks());
  }, []);

  const oldPending = allTasks.filter((t) => t.date < today && !t.completed);
  const oldDone = allTasks.filter((t) => t.date < today && t.completed);

  function update(updated: Task[]) {
    setAllTasks(updated);
    storage.saveTasks(updated);
  }

  function toggleDone(id: string) {
    update(allTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function reschedule(id: string, date: string) {
    update(allTasks.map((t) => (t.id === id ? { ...t, date } : t)));
  }

  function deleteTask(id: string) {
    update(allTasks.filter((t) => t.id !== id));
  }

  const totalOld = oldPending.length + oldDone.length;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-white/50 hover:text-white text-sm font-medium transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">Past Tasks</h1>
        </div>

        {totalOld === 0 ? (
          <div className="text-center mt-24">
            <p className="text-white/40 text-lg">No old tasks.</p>
            <p className="text-white/20 text-sm mt-2">Tasks from past days will appear here.</p>
          </div>
        ) : (
          <>
            {oldPending.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                  Pending ({oldPending.length})
                </h2>
                <div className="space-y-3">
                  {oldPending.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onToggle={() => toggleDone(t.id)}
                      onDelete={() => deleteTask(t.id)}
                      onReschedule={(date) => reschedule(t.id, date)}
                    />
                  ))}
                </div>
              </section>
            )}

            {oldDone.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                  Completed ({oldDone.length})
                </h2>
                <div className="space-y-3">
                  {oldDone.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onToggle={() => toggleDone(t.id)}
                      onDelete={() => deleteTask(t.id)}
                      onReschedule={(date) => reschedule(t.id, date)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
