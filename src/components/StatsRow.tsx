import { Check, CheckCircle2, Clock, Flame } from "lucide-react";
import { formatStudyTime } from "@/hooks/useStudyStats";
import { getVisitStreak, useVisitRecord } from "@/hooks/useVisitTracking";
import { getDailyGoalSeconds, getDailyGoalHours } from "@/lib/dailyGoal";

export function StatsRow({ done, total }: { done: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const record = useVisitRecord();
  const visitDays = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${dd}`;
    const seconds = record.dailySeconds[key] || 0;
    return {
      key,
      label: d.toLocaleDateString("vi-VN", { weekday: "short" }),
      seconds,
      visited: seconds > 0,
      is_today: idx === 6,
    };
  });

  const todayVisitSeconds = visitDays[6].seconds;
  const dailyGoalSeconds = getDailyGoalSeconds();
  const dailyGoalHours = getDailyGoalHours();
  const goalReached = todayVisitSeconds >= dailyGoalSeconds;
  const studyGoalPercent = Math.min(
    100,
    Math.round((todayVisitSeconds / dailyGoalSeconds) * 100),
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="card-soft animate-fade-up p-5" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-muted-foreground">Nhiệm vụ hôm nay</span>
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-black text-foreground">
            {done}/{total}
          </span>
          <span className="pb-1 text-xs font-bold text-muted-foreground">hoàn thành</span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          {percent}% — còn {total - done} việc nữa là xong ngày hôm nay.
        </p>
      </div>

      <div className="card-soft animate-fade-up p-5" style={{ animationDelay: "140ms" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-muted-foreground">Chuỗi học</span>
          <Flame className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-black text-foreground">{getVisitStreak()}</span>
          <span className="pb-1 text-xs font-bold text-muted-foreground">ngày liên tục</span>
        </div>
        <div className="mt-4 flex gap-1.5">
          {visitDays.map((day) => (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-1">
              <span
                title={day.visited ? "Đã truy cập trong ngày" : "Chưa truy cập trong ngày"}
                className={`grid h-7 w-full place-items-center rounded-lg border transition-colors ${
                  day.visited
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-transparent"
                }`}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span
                className={`text-[10px] font-bold ${day.is_today ? "text-primary" : "text-muted-foreground"}`}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-soft animate-fade-up p-5 sm:col-span-2 xl:col-span-1" style={{ animationDelay: "220ms" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-muted-foreground">Giờ học hôm nay</span>
          <div className="flex items-center gap-2">
            {goalReached && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Đã hoàn thành
              </span>
            )}
            <Clock className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-3xl font-black text-foreground">
            {formatStudyTime(todayVisitSeconds)}
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          {goalReached
            ? `🎉 Hoàn thành mục tiêu ${dailyGoalHours} giờ truy cập hôm nay.`
            : `Còn ${formatStudyTime(dailyGoalSeconds - todayVisitSeconds)} để đạt ${dailyGoalHours} giờ truy cập hôm nay.`}
        </p>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary-deep transition-all duration-500"
            style={{ width: `${studyGoalPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
