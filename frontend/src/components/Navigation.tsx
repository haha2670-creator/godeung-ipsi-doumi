"use client";

import { useTabStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "👤 프로필", icon: "👤" },
  { id: "goals", label: "🎯 목표대학", icon: "🎯" },
  { id: "roadmap", label: "🗺️ 로드맵", icon: "🗺️" },
  { id: "admissions", label: "📋 전형안내", icon: "📋" },
  { id: "subjects", label: "📚 선택과목", icon: "📚" },
  { id: "grades", label: "📊 성적관리", icon: "📊" },
  { id: "mock", label: "📝 모의고사", icon: "📝" },
  { id: "record", label: "📖 생기부", icon: "📖" },
  { id: "schedule", label: "📅 시험일정", icon: "📅" },
  { id: "academy", label: "🏫 학원", icon: "🏫" },
  { id: "clubs", label: "🎭 동아리", icon: "🎭" },
  { id: "ai", label: "🤖 AI도우미", icon: "🤖" },
];

export function Navigation() {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <nav className="bg-white rounded-2xl p-2 sm:p-3 shadow-lg mb-6">
      <div className="flex flex-nowrap sm:flex-wrap gap-2 justify-start sm:justify-center overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "nav-tab",
              activeTab === tab.id && "active"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
