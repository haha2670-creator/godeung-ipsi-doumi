"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { dataApi } from "@/lib/api";
import { Calendar, CalendarDays, GraduationCap, BookOpen, Users, Trophy } from "lucide-react";
import { format, parseISO, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";

interface CalendarEvent {
  month: number;
  date: number;
  name: string;
  type: string;
  endDate?: number;
  year?: number;
  note?: string;
}

interface AcademicCalendar {
  year: string;
  schoolDays: {
    "1-2": number;
    "3": number;
  };
  semesters: {
    "1": number;
    "2-1-2": number;
    "2-3": number;
  };
  events: CalendarEvent[];
}

export function AcademicCalendarTab() {
  const { user } = useAuthStore();
  const [calendar, setCalendar] = useState<AcademicCalendar | null>(null);
  // 학사일정이 2026년 기준이므로 기본 월을 2026년 3월로 설정
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  useEffect(() => {
    if (user?.school) {
      loadCalendar(user.school);
    }
  }, [user?.school]);

  // 학사일정 로드 후 해당 연도의 첫 달로 설정
  useEffect(() => {
    if (calendar && calendar.year) {
      const year = parseInt(calendar.year);
      // 현재 월이 학사일정 연도와 다르면 첫 달(3월)로 설정
      if (format(currentMonth, "yyyy") !== calendar.year) {
        setCurrentMonth(new Date(year, 2, 1)); // 3월 = 인덱스 2
      }
    }
  }, [calendar]);

  const loadCalendar = async (schoolName: string) => {
    try {
      const res = await dataApi.schoolCalendar(schoolName);
      
      // API 응답이 직접 데이터인 경우 처리
      const calendarData = res.data || res;
      if (calendarData && calendarData.events && Array.isArray(calendarData.events)) {
        setCalendar(calendarData);
      } else {
        console.error("학사일정 데이터 구조가 올바르지 않습니다:", calendarData);
      }
    } catch (error) {
      console.error("학사일정 로드 실패:", error);
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "공휴일": return "bg-red-100 text-red-700 border-red-300";
      case "평가": return "bg-purple-100 text-purple-700 border-purple-300";
      case "행사": return "bg-blue-100 text-blue-700 border-blue-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "공휴일": return <Calendar size={16} />;
      case "평가": return <BookOpen size={16} />;
      case "행사": return <Users size={16} />;
      default: return <CalendarDays size={16} />;
    }
  };

  // 현재 월의 이벤트 필터링
  const getEventsForMonth = (month: Date) => {
    if (!calendar) return [];
    const year = format(month, "yyyy");
    const monthNum = parseInt(format(month, "M"));
    
    return calendar.events.filter(event => {
      const eventYear = event.year || parseInt(calendar.year);
      return eventYear === parseInt(year) && event.month === monthNum;
    });
  };

  // 날짜별 이벤트 그룹화
  const eventsByDate = () => {
    if (!calendar) return {};
    const monthEvents = getEventsForMonth(currentMonth);
    const map: Record<string, CalendarEvent[]> = {};
    
    monthEvents.forEach(event => {
      // 이벤트의 연도 결정 (year 필드가 있으면 사용, 없으면 calendar.year 사용)
      const eventYear = event.year || parseInt(calendar.year);
      const startDate = `${eventYear}-${String(event.month).padStart(2, "0")}-${String(event.date).padStart(2, "0")}`;
      if (!map[startDate]) map[startDate] = [];
      map[startDate].push(event);
      
      // 기간 이벤트 처리
      if (event.endDate) {
        for (let d = event.date + 1; d <= event.endDate; d++) {
          const dateKey = `${eventYear}-${String(event.month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          if (!map[dateKey]) map[dateKey] = [];
          map[dateKey].push(event);
        }
      }
    });
    
    return map;
  };

  // 달력 그리드용 날짜 배열
  const calendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    const days: Date[] = [];
    let d = start;
    while (d <= end) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  };

  if (!user?.school) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
          📅 연간 학사일정
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">프로필에서 학교를 먼저 선택해주세요.</p>
          <p className="text-sm text-gray-400">학교 선택 후 해당 학교의 학사일정이 표시됩니다.</p>
        </div>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
          📅 연간 학사일정
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">학사일정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const eventsMap = eventsByDate();
  const days = calendarDays();

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        📅 연간 학사일정 ({user.school})
      </h2>

      {/* 통계 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={20} className="text-blue-600" />
            <span className="font-semibold text-blue-800">1,2학년 총 수업일수</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{calendar.schoolDays["1-2"]}일</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-purple-600" />
            <span className="font-semibold text-purple-800">3학년 총 수업일수</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{calendar.schoolDays["3"]}일</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={20} className="text-green-600" />
            <span className="font-semibold text-green-800">학기별 수업일수</span>
          </div>
          <p className="text-sm text-green-700">1학기: {calendar.semesters["1"]}일</p>
          <p className="text-sm text-green-700">2학기: {calendar.semesters["2-1-2"]}일</p>
        </div>
      </div>

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
          <BookOpen size={18} />
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
              ←
            </button>
            <h3 className="text-xl font-bold text-gray-800">
              {format(currentMonth, "yyyy년 M월", { locale: ko })}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="py-2 text-sm font-semibold text-gray-600">
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              const key = format(day, "yyyy-MM-dd");
              const dayEvents = eventsMap[key] || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={i}
                  className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 rounded-lg border ${
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
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedEvent(event)}
                        className={`text-xs truncate px-1 py-0.5 rounded cursor-pointer hover:opacity-80 ${getEventColor(event.type)}`}
                        title={event.name}
                      >
                        {event.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 목록 보기 */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1].map((monthNum) => {
            const monthDate = new Date(parseInt(calendar.year), monthNum - 1, 1);
            const monthEvents = calendar.events.filter(event => {
              const eventYear = event.year || parseInt(calendar.year);
              return eventYear === parseInt(format(monthDate, "yyyy")) && event.month === monthNum;
            });

            if (monthEvents.length === 0) return null;

            return (
              <div key={monthNum} className="border border-gray-200 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {monthNum}월
                </h3>
                <div className="space-y-2">
                  {monthEvents.map((event, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedEvent(event)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:opacity-80 ${getEventColor(event.type)}`}
                    >
                      <div className="flex-shrink-0">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{event.date}일</span>
                          {event.endDate && (
                            <span className="text-xs">~ {event.endDate}일</span>
                          )}
                          <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                            {event.type}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{event.name}</p>
                        {event.note && (
                          <p className="text-xs mt-1 opacity-75">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 이벤트 상세 모달 */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">일정 상세</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className={`p-4 rounded-lg mb-4 ${getEventColor(selectedEvent.type)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getEventIcon(selectedEvent.type)}
                <span className="font-semibold">{selectedEvent.type}</span>
              </div>
              <p className="text-lg font-bold">{selectedEvent.name}</p>
              <p className="text-sm mt-2">
                {selectedEvent.year || calendar.year}년 {selectedEvent.month}월 {selectedEvent.date}일
                {selectedEvent.endDate && ` ~ ${selectedEvent.endDate}일`}
              </p>
              {selectedEvent.note && (
                <p className="text-sm mt-2 opacity-75">{selectedEvent.note}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full btn btn-outline"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
