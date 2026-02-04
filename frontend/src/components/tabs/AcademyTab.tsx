"use client";

import { useState, useEffect } from "react";
import { academyApi } from "@/lib/api";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface AcademySchedule {
  id: string;
  academyName: string;
  subject: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export function AcademyTab() {
  const [schedules, setSchedules] = useState<AcademySchedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    academyName: "",
    subject: "",
    dayOfWeek: "월",
    startTime: "18:00",
    endTime: "20:00",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const res = await academyApi.list();
      setSchedules(res.data);
    } catch (error) {
      console.error("학원 스케줄 로드 실패:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await academyApi.create(formData);
      await loadSchedules();
      setShowForm(false);
      setFormData({ academyName: "", subject: "", dayOfWeek: "월", startTime: "18:00", endTime: "20:00" });
    } catch (error) {
      console.error("학원 스케줄 추가 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await academyApi.delete(id);
      await loadSchedules();
    } catch (error) {
      console.error("학원 스케줄 삭제 실패:", error);
    }
  };

  // 요일별로 그룹화
  const groupedByDay = DAYS.map((day) => ({
    day,
    items: schedules.filter((s) => s.dayOfWeek === day),
  }));

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        🏫 학원 스케줄
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        다니는 학원 수업 일정을 등록하면 시험 일정과 함께 시간 관리에 도움이 됩니다.
      </p>

      {/* 요일별 스케줄 표시 */}
      <div className="space-y-4 mb-6">
        {groupedByDay.map(({ day, items }) => (
          <div key={day} className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">
                {day}
              </span>
              {day}요일
            </div>
            <div className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <p className="px-4 py-6 text-center text-gray-400 text-sm">등록된 수업이 없습니다.</p>
              ) : (
                items.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <GraduationCap size={20} className="text-primary-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">{schedule.academyName}</p>
                        <p className="text-sm text-gray-600">
                          {schedule.subject} · {schedule.startTime} ~ {schedule.endTime}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 추가 폼 */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">학원명</label>
              <input
                type="text"
                className="input"
                value={formData.academyName}
                onChange={(e) => setFormData({ ...formData, academyName: e.target.value })}
                placeholder="예: 메가스터디"
                required
              />
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
              <label className="label">요일</label>
              <select
                className="input"
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}요일
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">시작 시간</label>
              <input
                type="time"
                className="input"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">종료 시간</label>
              <input
                type="time"
                className="input"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "추가 중..." : "추가"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus className="inline mr-2" size={18} />
            학원 수업 등록
          </button>
        </div>
      )}
    </div>
  );
}
