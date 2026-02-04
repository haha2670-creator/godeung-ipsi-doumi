"use client";

import { useState, useEffect } from "react";
import { goalsApi } from "@/lib/api";
import { Map, CheckCircle, Calendar, Lightbulb } from "lucide-react";

interface Goal {
  id: string;
  rank: number;
  university: string;
  major: string;
  admissionType: string;
}

interface KeyDate {
  label: string;
  date: string;
  note?: string;
}

interface Roadmap {
  title: string;
  targetYear?: string;
  keyDates?: KeyDate[];
  majorHints?: string[] | null;
  milestones: {
    semester: string;
    tasks: string[];
  }[];
}

export function RoadmapTab() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  // URL 해시 변경 감지 (목표대학 탭에서 로드맵 버튼 클릭 시)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#roadmap-')) {
        const goalId = hash.replace('#roadmap-', '');
        const goal = goals.find((g) => g.id === goalId);
        if (goal) {
          setSelectedGoal(goal);
          loadRoadmap(goal.id);
        }
      }
    };

    handleHashChange(); // 초기 로드 시 확인
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [goals]);

  const loadGoals = async () => {
    try {
      const res = await goalsApi.list();
      setGoals(res.data);
      if (res.data.length > 0) {
        // URL 해시에서 goalId 확인
        const hash = window.location.hash;
        if (hash.startsWith('#roadmap-')) {
          const goalId = hash.replace('#roadmap-', '');
          const goal = res.data.find((g) => g.id === goalId);
          if (goal) {
            setSelectedGoal(goal);
            loadRoadmap(goal.id);
            return;
          }
        }
        // 해시가 없으면 첫 번째 목표 사용
        setSelectedGoal(res.data[0]);
        loadRoadmap(res.data[0].id);
      }
    } catch (error) {
      console.error("목표 로드 실패:", error);
    }
  };

  const loadRoadmap = async (goalId: string) => {
    setLoading(true);
    try {
      const res = await goalsApi.roadmap(goalId);
      setRoadmap(res.data);
    } catch (error) {
      console.error("로드맵 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (goal: Goal) => {
    setSelectedGoal(goal);
    loadRoadmap(goal.id);
  };

  if (goals.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
          🗺️ 맞춤 입시 로드맵
        </h2>
        <div className="text-center py-12">
          <Map size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">
            목표 대학을 먼저 설정해주세요!
          </p>
          <p className="text-sm text-gray-400">
            "🎯 목표대학" 탭에서 목표를 추가하면 맞춤 로드맵이 생성됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        🗺️ 맞춤 입시 로드맵
      </h2>

      {/* 목표 선택 */}
      <div className="mb-6">
        <label className="label">목표 대학 선택</label>
        <div className="flex flex-wrap gap-2">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleGoalChange(goal)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedGoal?.id === goal.id
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {goal.rank}지망: {goal.university} {goal.major}
            </button>
          ))}
        </div>
      </div>

      {/* 로드맵 */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">로드맵을 불러오는 중...</p>
        </div>
      ) : roadmap ? (
        <div className="space-y-8">
          {/* 제목 + 연도 */}
          <div className="text-center">
            <h3 className="font-bold text-xl text-gray-800">{roadmap.title}</h3>
            {roadmap.targetYear && (
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {roadmap.targetYear}
              </span>
            )}
          </div>

          {/* 2028학년도 입시 일정 */}
          {roadmap.keyDates && roadmap.keyDates.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-amber-600" />
                2028학년도 입시 주요 일정
              </h4>
              <p className="text-xs text-gray-500 mb-4">
                대교협 확정 일정 기준 (연도별 공지 확인 권장)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roadmap.keyDates.map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                    <p className="text-primary-600 font-semibold text-sm mt-0.5">{item.date}</p>
                    {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 학과 맞춤 팁 */}
          {roadmap.majorHints && roadmap.majorHints.length > 0 && (
            <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Lightbulb size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 text-sm mb-1">이 학과에 맞는 포인트</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {roadmap.majorHints.map((hint, i) => (
                    <li key={i}>• {hint}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 학기별 마일스톤 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">학기별 To-Do</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500" />
              <div className="space-y-8">
                {roadmap.milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-2 w-5 h-5 bg-white border-4 border-primary-500 rounded-full" />
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h5 className="font-bold text-lg text-primary-600 mb-3">
                        📅 {milestone.semester}
                      </h5>
                      <ul className="space-y-2">
                        {milestone.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-2">
                            <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
