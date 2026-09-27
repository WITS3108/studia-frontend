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

function VisitTimeCard() {
  const record = useVisitRecord();
  return (
    <div className="card-soft animate-fade-up p-5" style={{ animationDelay: "260ms" }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-muted-foreground">Thời gian truy cập</span>
        <Timer className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-black text-foreground">{formatStudyTime(record.totalSeconds)}</span>
        <span className="pb-1 text-xs font-bold text-muted-foreground">tổng cộng</span>
      </div>
      <p className="mt-2 text-xs font-medium text-muted-foreground">
        Lần truy cập gần nhất:{" "}
        {record.lastVisit ? new Date(record.lastVisit).toLocaleString("vi-VN") : "—"}
      </p>
    </div>
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
            <VisitTimeCard />
            <WeeklyProgress studyStats={studyStats} />
            <PomodoroPanel onStudyTimeRecorded={recordStudyTime} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
