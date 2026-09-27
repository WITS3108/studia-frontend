import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Sparkles, Timer } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { StatsRow } from "@/components/StatsRow";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { FlashcardDecks } from "@/components/FlashcardDecks";
import { TodayTodos } from "@/components/TodayTodos";
import { PomodoroPanel } from "@/components/PomodoroPanel";
import { useTodos } from "@/hooks/useTodos";
import { useStudyStats, formatStudyTime } from "@/hooks/useStudyStats";
import { useVisitRecord } from "@/hooks/useVisitTracking";
import { getDailyGoalSeconds } from "@/lib/dailyGoal";
import { quotes } from "@/data/mock";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "LearnFast — Trang chủ học tập tập trung" },
      {
        name: "description",
        content:
          "Trang chủ LearnFast: theo dõi to-do hôm nay, chuỗi học, tiến độ tuần, bộ flashcard đang ôn và đồng hồ Pomodoro kèm âm thanh lo-fi.",
      },
      { property: "og:title", content: "LearnFast — Trang chủ học tập tập trung" },
      {
        property: "og:description",
        content: "To-do, flashcard, tiến độ tuần và Pomodoro trong một trang gọn gàng.",
      },
    ],
  }),
  component: HomePage,
});

function DailyVisitProgress() {
  const record = useVisitRecord();

  const days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${dd}`;
    return {
      key,
      label: d.toLocaleDateString("vi-VN", { weekday: "short" }),
      seconds: record.dailySeconds[key] || 0,
      is_today: idx === 6,
    };
  });

  return (
    <section className="card-soft animate-fade-up p-5" style={{ animationDelay: "80ms" }}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-black text-foreground">Tiến độ thường ngày</h2>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            Tổng {formatStudyTime(record.totalSeconds)} truy cập · Gần nhất{" "}
            {record.lastVisit ? new Date(record.lastVisit).toLocaleString("vi-VN") : "—"}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 p-2 text-primary">
          <Timer className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-5 flex h-36 items-end gap-2">
        {days.map((day, i) => {
          const hours = day.seconds / 3600;
          const percent = Math.min(100, Math.round((day.seconds / getDailyGoalSeconds()) * 100));
          const height = day.seconds === 0 ? 0 : Math.max(8, percent);
          return (
            <div key={day.key} className="flex h-full flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground" title={`${hours.toFixed(1)} giờ`}>
                {day.seconds > 0 ? `${percent}%` : "--"}
              </span>
              <div className="relative w-full flex-1">
                <div
                  className="animate-grow-bar absolute bottom-0 left-0 w-full origin-bottom rounded-t-xl transition-colors"
                  style={{
                    height: `${height}%`,
                    animationDelay: `${i * 70}ms`,
                    backgroundColor: day.is_today
                      ? "var(--color-primary-deep)"
                      : hours > 0
                        ? "var(--color-primary)"
                        : "var(--color-muted)",
                    opacity: hours > 0 ? 1 : 0.6,
                  }}
                />
              </div>
              <span className={`text-[11px] font-bold ${day.is_today ? "text-primary-deep" : "text-muted-foreground"}`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HomePage() {
  const { todos, toggle } = useTodos();
  const { stats: studyStats, recordStudyTime } = useStudyStats();
  const done = todos.filter((t) => t.done).length;
  const quote = useMemo(() => quotes[new Date().getDay() % quotes.length], []);

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });


  return (
    <AppShell>
      <div className="paper-dots -mx-4 rounded-3xl px-4 py-1 sm:-mx-2 sm:px-2">
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          {/* Left / main column */}
          <div className="min-w-0 space-y-5">
            <header className="animate-fade-up">
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                {today}
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Chào buổi sáng👋
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                {quote}
              </p>
            </header>

            <StatsRow done={done} total={todos.length} studyStats={studyStats} />
            <FlashcardDecks />
            <TodayTodos todos={todos} onToggle={toggle} />
          </div>

          {/* Right column: weekly progress on top of pomodoro */}
          <div className="space-y-5 xl:sticky xl:top-24 xl:h-fit">
            <DailyVisitProgress />
            <WeeklyProgress />
            <PomodoroPanel onStudyTimeRecorded={recordStudyTime} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
