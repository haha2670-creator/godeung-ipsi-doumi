"use client";

import { useState, useEffect } from "react";
import { subjectsApi, goalsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { findRecommendation } from "@/lib/majorRecommendations";
import { Save, Check, BookOpen, Target, Star, Lightbulb } from "lucide-react";

interface SchoolSubjects {
  [grade: string]: {
    [category: string]: string[];
  };
}

interface Goal {
  id: string;
  university: string;
  major: string;
  admissionType: string;
}

export function SubjectsTab() {
  const { user } = useAuthStore();
  const [schoolSubjects, setSchoolSubjects] = useState<SchoolSubjects | null>(null);
  const [selectedGrade, setSelectedGrade] = useState("2-1");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [savedSubjects, setSavedSubjects] = useState<Record<string, string[]>>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(true);

  useEffect(() => {
    if (user?.school) {
      loadSchoolSubjects(user.school);
    } else {
      setSchoolSubjects(null);
    }
    loadSavedSubjects();
    loadGoals();
  }, [user?.school]);

  useEffect(() => {
    // 학년 변경 시 저장된 선택과목 불러오기
    if (savedSubjects[selectedGrade]) {
      setSelectedSubjects(savedSubjects[selectedGrade]);
    } else {
      setSelectedSubjects([]);
    }
  }, [selectedGrade, savedSubjects]);

  const loadSchoolSubjects = async (schoolName: string) => {
    try {
      const res = await subjectsApi.schoolSubjects(schoolName);
      setSchoolSubjects(res.data);
    } catch (error) {
      console.error("학교 선택과목 로드 실패:", error);
      setSchoolSubjects(null);
    }
  };

  const loadSavedSubjects = async () => {
    try {
      const res = await subjectsApi.list();
      const saved: Record<string, string[]> = {};
      res.data.forEach((item: any) => {
        saved[item.grade] = item.subjects;
      });
      setSavedSubjects(saved);
    } catch (error) {
      console.error("저장된 선택과목 로드 실패:", error);
    }
  };

  const loadGoals = async () => {
    try {
      const res = await goalsApi.list();
      setGoals(res.data);
    } catch (error) {
      console.error("목표 로드 실패:", error);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      await subjectsApi.save({
        grade: selectedGrade,
        subjects: selectedSubjects,
      });
      setSavedSubjects({ ...savedSubjects, [selectedGrade]: selectedSubjects });
      setMessage("✅ 선택과목이 저장되었습니다!");
    } catch (error) {
      setMessage("❌ 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 추천 과목이 현재 선택되었는지 확인
  const isSubjectSelected = (subject: string) => {
    // 모든 학기의 선택과목 합치기
    const allSelected = Object.values(savedSubjects).flat();
    return allSelected.some(s => s.includes(subject) || subject.includes(s.replace(/\(\d+\)/, '').trim()));
  };

  // DB에서 불러온 학교별 선택과목만 사용 (추후 DB에 데이터 추가 시 자동 표시)
  const hasSchoolData = schoolSubjects && schoolSubjects[selectedGrade] && Object.keys(schoolSubjects[selectedGrade]).length > 0;
  const gradeSubjects = hasSchoolData ? schoolSubjects[selectedGrade] : {};

  // 목표 학과에 대한 추천 과목 찾기
  const goalRecommendations = goals.map(goal => ({
    goal,
    recommendation: findRecommendation(goal.major)
  })).filter(item => item.recommendation !== null);

  const semesterLabel = selectedGrade ? `고${selectedGrade.split("-")[0]} ${selectedGrade.split("-")[1]}학기` : "";

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        📚 선택과목 관리
      </h2>

      {/* 학기 선택 - 맨 위에 배치 (학기별로 과목이 다름) */}
      <div className="mb-6">
        <label className="label">학기 선택</label>
        <p className="text-xs text-gray-500 mb-2">※ 선택과목은 학기마다 다르게 운영됩니다.</p>
        <div className="flex flex-wrap gap-2">
          {["2-1", "2-2", "3-1", "3-2"].map((semester) => (
            <button
              key={semester}
              onClick={() => setSelectedGrade(semester)}
              className={`px-5 py-2 rounded-full transition-all ${
                selectedGrade === semester
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {semester.replace("-", "학년 ")}학기
            </button>
          ))}
        </div>
      </div>

      {/* 목표 학과별 추천 과목 */}
      {goalRecommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Target size={20} className="text-primary-500" />
              내 목표 학과 맞춤 추천
            </h3>
            <button
              onClick={() => setShowRecommendation(!showRecommendation)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {showRecommendation ? "접기 ▲" : "펼치기 ▼"}
            </button>
          </div>

          {showRecommendation && (
            <div className="space-y-4">
              {goalRecommendations.map(({ goal, recommendation }) => (
                <div key={goal.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🎯</span>
                    <span className="font-bold text-gray-800">
                      {goal.university} {goal.major}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {recommendation?.category}계열
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
                    <Lightbulb size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    {recommendation?.description}
                  </p>

                  {/* 필수 과목 */}
                  {recommendation?.essential && recommendation.essential.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
                        <Star size={14} className="fill-red-500" />
                        필수 추천 과목
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.essential.map((subject) => (
                          <span
                            key={subject}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isSubjectSelected(subject)
                                ? "bg-green-100 text-green-700 border-2 border-green-400"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isSubjectSelected(subject) && "✓ "}{subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 추천 과목 */}
                  {recommendation?.recommended && recommendation.recommended.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-1">
                        <Star size={14} className="fill-blue-500" />
                        추가 추천 과목
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.recommended.map((subject) => (
                          <span
                            key={subject}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              isSubjectSelected(subject)
                                ? "bg-green-100 text-green-700 border-2 border-green-400"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {isSubjectSelected(subject) && "✓ "}{subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 목표가 없을 때 안내 */}
      {goals.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-800 text-sm">
            💡 <strong>목표 대학을 먼저 설정하세요!</strong> 
            <br />목표 학과에 맞는 추천 선택과목을 확인할 수 있습니다.
          </p>
        </div>
      )}

      {/* 선택한 과목 요약 (학기별) */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={18} className="text-purple-600" />
          <span className="font-bold text-purple-700">{semesterLabel} 선택한 과목 ({selectedSubjects.length}개)</span>
        </div>
        {selectedSubjects.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((subject) => (
              <span
                key={subject}
                className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm font-medium"
              >
                {subject}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">아래에서 과목을 선택해주세요.</p>
        )}
      </div>

      {/* 과목 선택 */}
      <div className="space-y-6">
        {Object.keys(gradeSubjects).length === 0 ? (
          <div className="text-center py-8">
            {!user?.school ? (
              <div>
                <p className="text-gray-600 mb-2">프로필에서 학교를 먼저 선택해주세요.</p>
                <p className="text-sm text-gray-500">학교 선택 후 해당 학교의 선택과목이 DB에서 불러와집니다.</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">이 학교의 선택과목 데이터가 아직 DB에 등록되지 않았습니다.</p>
                <p className="text-sm text-gray-500">추후 DB에 추가되면 자동으로 표시됩니다.</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-gray-800 mb-4">{semesterLabel} 선택과목</h3>
            {Object.entries(gradeSubjects).map(([category, subjectList]) => {
              const match = category.match(/\(택(\d+)\)/);
              const selectCount = match ? parseInt(match[1], 10) : null;
              const selectedInCategory = (subjectList as string[]).filter((s) => selectedSubjects.includes(s)).length;
              return (
                <div key={category} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      {category.replace(/\s*\(택\d+\)/, "")}
                    </h4>
                    {selectCount !== null && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedInCategory >= selectCount ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {selectedInCategory}/{selectCount}개 선택
                      </span>
                    )}
                  </div>
                  {selectCount !== null && (
                    <p className="text-xs text-gray-500 mb-2">※ 이 중 {selectCount}개를 선택하세요.</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(subjectList as string[]).map((subject) => (
                      <button
                        key={subject}
                        onClick={() => handleSubjectToggle(subject)}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                          selectedSubjects.includes(subject)
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {selectedSubjects.includes(subject) && <Check size={16} />}
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      {message && (
        <p className="mt-4 text-center font-medium">{message}</p>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={loading}
        >
          <Save className="inline mr-2" size={18} />
          {loading ? "저장 중..." : "선택과목 저장"}
        </button>
      </div>

      {/* 안내 */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
        <p className="text-sm text-yellow-800">
          💡 <strong>고교학점제 안내:</strong> 2025학년도 입학생(현 예비고1)부터 고교학점제가 전면 시행됩니다.
          진로에 맞는 과목을 선택하여 나만의 교육과정을 설계하세요!
        </p>
      </div>
    </div>
  );
}
