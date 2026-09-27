import { TrendingUp } from "lucide-react";
import { formatStudyTime } from "@/hooks/useStudyStats";
import { useVisitRecord } from "@/hooks/useVisitTracking";

export function WeeklyProgress() {
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

  const max = Math.max(...days.map((day) => day.seconds / 3600), 1);
  const activeCount = days.filter((day) => day.seconds > 0).length;
  const weekSeconds = days.reduce((sum, day) => sum + day.seconds, 0);

  return (
    <section className="card-soft animate-fade-up p-5" style={{ animationDelay: "80ms" }}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-black text-foreground">Tiến độ tuần này</h2>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            Tổng cộng {formatStudyTime(weekSeconds)} truy cập trong tuần
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
          <TrendingUp className="h-3.5 w-3.5" />
          {activeCount}/7 ngày
        </span>
      </div>

      <div className="mt-5 flex h-36 items-end gap-2">
        {days.map((day, i) => {
          const hours = day.seconds / 3600;
          const height = hours === 0 ? 4 : Math.max(5, Math.round((hours / max) * 100));
          return (
            <div key={day.key} className="flex h-full flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground">
                {hours > 0 ? `${hours.toFixed(1)}h` : "--"}
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
              <span
                className={`text-[11px] font-bold ${day.is_today ? "text-primary-deep" : "text-muted-foreground"}`}
              >
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
