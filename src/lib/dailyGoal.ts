const STORAGE_KEY = "learnfast-daily-goal";

export const DEFAULT_DAILY_GOAL_HOURS = 4;

export function getDailyGoalHours(): number {
  if (typeof window === "undefined") return DEFAULT_DAILY_GOAL_HOURS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DAILY_GOAL_HOURS;
    const parsed = JSON.parse(raw) as { hours?: number };
    return typeof parsed?.hours === "number" && parsed.hours > 0
      ? parsed.hours
      : DEFAULT_DAILY_GOAL_HOURS;
  } catch {
    return DEFAULT_DAILY_GOAL_HOURS;
  }
}

export function getDailyGoalSeconds(): number {
  return Math.round(getDailyGoalHours() * 3600);
}

export function saveDailyGoalHours(hours: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ hours }));
  } catch {
    /* ignore */
  }
}
