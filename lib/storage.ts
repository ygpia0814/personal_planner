export type Task = {
  id: string;
  text: string;
  date: string; // "YYYY-MM-DD" — which day this task is scheduled for
  completed: boolean;
};

const TASKS_KEY = "pplanner-tasks-v2";

function safeLoad<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const storage = {
  loadTasks: () => safeLoad<Task[]>(TASKS_KEY, []),
  saveTasks: (tasks: Task[]) =>
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)),
};

export function getTodayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDays(isoDate: string, n: number): string {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getDayName(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
  });
}

// Returns the 7 ISO dates for the rolling week starting today
export function getRollingWeek(): string[] {
  const today = getTodayISO();
  return Array.from({ length: 7 }, (_, i) => addDays(today, i));
}
