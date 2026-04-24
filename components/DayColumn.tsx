"use client";

import { useState } from "react";
import { Task, getTodayISO } from "@/lib/storage";
import CelebrationOverlay from "./CelebrationOverlay";

type Props = {
  isoDate: string;
  dayName: string;
  displayDate: string;
  isToday: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  characterImage?: string;
  tasks: Task[];
  onAddTask: (text: string, date: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export default function DayColumn({
  isoDate,
  dayName,
  displayDate,
  isToday,
  isExpanded,
  onSelect,
  characterImage,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: Props) {
  const [text, setText] = useState("");
  const [scheduledDate, setScheduledDate] = useState(isoDate);
  const [showForm, setShowForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddTask(trimmed, scheduledDate);
    setText("");
    setScheduledDate(isoDate);
    setShowForm(false);
  }

  function openForm() {
    setScheduledDate(isoDate);
    setShowForm(true);
  }

  const completed = tasks.filter((t) => t.completed).length;

  return (
    <>
      {showCelebration && (
        <CelebrationOverlay onDone={() => setShowCelebration(false)} />
      )}
    <div
      id={`day-col-${isoDate}`}
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onSelect}
      className={`rounded-xl flex flex-col transition-all relative overflow-hidden cursor-pointer ${
        isExpanded
          ? "bg-black/70 border-2 border-teal-400 shadow-[0_0_24px_rgba(45,212,191,0.25)] min-h-[620px] flex-[2] min-w-[220px]"
          : "bg-black/40 border border-white/10 shadow-lg min-h-[400px] flex-1 min-w-[130px]"
      }`}
    >
      {/* Character background */}
      {characterImage && (
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={characterImage}
            alt=""
            className="w-full h-full object-cover object-top"
            style={{ opacity: isExpanded ? 0.18 : 0.08, mixBlendMode: "luminosity" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className={`px-4 py-4 border-b ${isExpanded ? "border-teal-400/30" : "border-white/10"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`font-bold ${isExpanded ? "text-teal-300 text-base" : "text-white/60 text-sm"}`}>
              {dayName}
              {isToday && (
                <span className="ml-2 text-xs font-semibold bg-teal-400 text-black px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </h2>
            <p className={`text-xs mt-0.5 ${isExpanded ? "text-teal-400/60" : "text-white/30"}`}>
              {displayDate}
            </p>
          </div>
          {tasks.length > 0 && (
            <span className={`text-xs ${isExpanded ? "text-teal-400/70" : "text-white/30"}`}>
              {completed}/{tasks.length}
            </span>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className={`flex-1 py-2 space-y-2 overflow-y-auto ${isExpanded ? "px-4" : "px-3"}`}>
        {tasks.length === 0 && (
          <p className="text-xs text-center mt-8 text-white/20">No tasks</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={(e) => e.stopPropagation()}
            className={`flex items-start gap-2 p-2 rounded-lg group transition-colors ${
              task.completed
                ? "bg-white/5"
                : "bg-white/10 hover:bg-white/15"
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                if (isToday && !task.completed) {
                  const remaining = tasks.filter((t) => !t.completed && t.id !== task.id);
                  if (remaining.length === 0) setShowCelebration(true);
                }
                onToggleTask(task.id);
              }}
              className="mt-0.5 accent-teal-400 cursor-pointer shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm break-words leading-snug ${
                  task.completed ? "line-through text-white/30" : "text-white/90"
                }`}
              >
                {task.text}
              </p>
              {isToday && !task.completed && (
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-red-400 bg-red-900/40 px-1.5 py-0.5 rounded-full">
                  Due Today!!
                </span>
              )}
            </div>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-opacity text-xs shrink-0"
              aria-label="Delete task"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add task form */}
      <div onClick={(e) => e.stopPropagation()} className={`py-3 border-t ${isExpanded ? "px-4 border-teal-400/20" : "px-3 border-white/10"}`}>
        {showForm ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Task name..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full text-sm text-white bg-zinc-700 placeholder-zinc-400 border border-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              autoFocus
            />
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full text-sm text-white bg-zinc-700 border border-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {isToday && (
              <button
                type="button"
                onClick={() => setScheduledDate(getTodayISO())}
                className="w-full text-sm font-bold text-white bg-red-600 hover:bg-red-500 border border-red-400 py-2 rounded-lg transition-colors"
              >
                Due Today
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-teal-500 hover:bg-teal-400 text-black text-sm font-bold py-2 rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => { setShowForm(false); setText(""); setScheduledDate(isoDate); }}
                className="flex-1 bg-zinc-600 hover:bg-zinc-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : isExpanded ? (
          <button
            onClick={openForm}
            className="w-full text-sm font-semibold py-2 rounded-lg transition-colors text-teal-300 bg-teal-500/25 hover:bg-teal-500/40 border border-teal-400/50"
          >
            + Add task
          </button>
        ) : null}
      </div>
    </div>
    </>
  );
}
