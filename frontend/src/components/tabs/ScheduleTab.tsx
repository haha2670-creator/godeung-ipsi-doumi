"use client";

import { useState, useEffect, useMemo } from "react";
import { schedulesApi } from "@/lib/api";
import { Plus, Trash2, ChevronLeft, ChevronRight, CalendarDays, List } from "lucide-react";
import { calculateDDay, formatDate } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { ko } from "date-fns/locale";

interface Schedule {
  id: string;
  type: string;
  subject: string;
  name: string;
  date: string;
  memo?: string;
  dDay?: string;
}

export function ScheduleTab() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [upcoming, setUpcoming] = useState<Schedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    type: "지필평가",
    subject: "",
    name: "",
    date: "",
    memo: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchedules();
    loadUpcoming();
  }, []);

  const loadSchedules = async () => {
    try {
      const res = await schedulesApi.list();
      setSchedules(res.data);
    } catch (error) {
      console.error("일정 로드 실패:", error);
    }
  };

  const loadUpcoming = async () => {
    try {
      const res = await schedulesApi.upcoming(30);
      setUpcoming(res.data);
    } catch (error) {
      console.error("다가오는 일정 로드 실패:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schedulesApi.create(formData);
      await loadSchedules();
      await loadUpcoming();
      setShowForm(false);
      setFormData({ type: "지필평가", subject: "", name: "", date: "", memo: "" });
    } catch (error) {
      console.error("일정 추가 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await schedulesApi.delete(id);
      await loadSchedules();
      await loadUpcoming();
    } catch (error) {
      console.error("일정 삭제 실패:", error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "지필평가": return "bg-red-100 text-red-700";
      case "수행평가": return "bg-blue-100 text-blue-700";
      case "모의고사": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // 달력용: 날짜별 일정 그룹
  const schedulesByDate = useMemo(() => {
    const map: Record<string, Schedule[]> = {};
    schedules.forEach((s) => {
      const key = s.date.split("T")[0];
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return map;
  }, [schedules]);

  // 달력 그리드용 날짜 배열 (현재 월 + 앞뒤 빈 칸)
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    const days: Date[] = [];
    let d = start;
    while (d <= end) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  }, [currentMonth]);

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        📅 시험 일정 관리
      </h2>

      {/* 보기 모드 전환 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setViewMode("calendar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === "calendar"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <CalendarDays size={18} />
          달력 보기
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === "list"
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <List size={18} />
          목록 보기
        </button>
      </div>

      {/* 달력 보기 */}
      {viewMode === "calendar" && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h3 className="text-xl font-bold text-gray-800">
              {format(currentMonth, "yyyy년 M월", { locale: ko })}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="py-2 text-sm font-semibold text-gray-600">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const key = format(day, "yyyy-MM-dd");
              const daySchedules = schedulesByDate[key] || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={i}
                  className={`min-h-[70px] sm:min-h-[90px] p-1 sm:p-2 rounded-lg border ${
                    isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${isToday ? "ring-2 ring-primary-500" : "border-gray-100"}`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isCurrentMonth ? "text-gray-800" : "text-gray-400"
                    } ${isToday ? "text-primary-600" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-1">
                    {daySchedules.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className={`text-xs truncate px-1 py-0.5 rounded ${getTypeColor(s.type)}`}
                        title={`${s.subject} - ${s.name}`}
                      >
                        {s.subject} {s.name}
                      </div>
                    ))}
                    {daySchedules.length > 3 && (
                      <div className="text-xs text-gray-500">+{daySchedules.length - 3}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 목록 보기 - 다가오는 일정 */}
      {viewMode === "list" && upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-3">⏰ 다가오는 시험</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.slice(0, 6).map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(schedule.type)}`}>
                      {schedule.type}
                    </span>
                    <p className="font-semibold mt-2">{schedule.subject} - {schedule.name}</p>
                    <p className="text-sm text-gray-500">{formatDate(schedule.date)}</p>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {schedule.dDay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 전체 일정 목록 */}
      {viewMode === "list" && (
      <div className="space-y-3 mb-6">
        <h3 className="font-bold text-gray-700">📋 전체 일정</h3>
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(schedule.type)}`}>
                {schedule.type}
              </span>
              <span className="font-semibold">{schedule.subject}</span>
              <span className="text-gray-600">{schedule.name}</span>
              <span className="text-sm text-gray-500">{formatDate(schedule.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary-500">
                {calculateDDay(schedule.date)}
              </span>
              <button
                onClick={() => handleDelete(schedule.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {schedules.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            등록된 일정이 없습니다.
          </p>
        )}
      </div>
      )}

      {/* 달력 보기일 때 전체 일정 요약 */}
      {viewMode === "calendar" && schedules.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-700 mb-2">
            이번 달 일정 ({schedules.filter((s) => (s.date.split("T")[0] || "").startsWith(format(currentMonth, "yyyy-MM"))).length}건)
          </h4>
          <div className="flex flex-wrap gap-2">
            {schedules
              .filter((s) => {
            const d = typeof s.date === "string" ? s.date.split("T")[0] : "";
            return d.startsWith(format(currentMonth, "yyyy-MM"));
          })
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getTypeColor(s.type)}`}
                >
                  <span className="font-medium">{format(parseISO(s.date.split("T")[0]), "M/d")}</span>
                  <span>{s.subject} - {s.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 추가 폼 */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">유형</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="지필평가">지필평가</option>
                <option value="수행평가">수행평가</option>
                <option value="모의고사">모의고사</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label className="label">과목</label>
              <input
                type="text"
                className="input"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="예: 수학"
                required
              />
            </div>

            <div>
              <label className="label">시험명</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 중간고사"
                required
              />
            </div>

            <div>
              <label className="label">날짜</label>
              <input
                type="date"
                className="input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">메모</label>
              <input
                type="text"
                className="input"
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder="범위, 준비물 등"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "추가 중..." : "추가"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus className="inline mr-2" size={18} />
            일정 추가
          </button>
        </div>
      )}
    </div>
  );
}
