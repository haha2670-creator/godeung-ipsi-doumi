"use client";

import { useState, useEffect } from "react";
import { gradesApi } from "@/lib/api";
import { Plus, Trash2, Info } from "lucide-react";

interface Grade {
  id: string;
  semester: string;
  subject: string;
  midterm?: number;
  final?: number;
  performance?: number;
  finalGrade?: number; // 최종 등급 (1~9)
  achievementGrade?: string; // A, B, C, D, E
  rawScore?: number;
  memo?: string;
}

// 5등급제 (고교학점제)
const ACHIEVEMENT_GRADES = [
  { grade: "A", min: 90, color: "text-blue-600", bg: "bg-blue-100" },
  { grade: "B", min: 80, color: "text-green-600", bg: "bg-green-100" },
  { grade: "C", min: 70, color: "text-yellow-600", bg: "bg-yellow-100" },
  { grade: "D", min: 60, color: "text-orange-600", bg: "bg-orange-100" },
  { grade: "E", min: 0, color: "text-red-600", bg: "bg-red-100" },
];

const getAchievementColor = (grade: string) => {
  const found = ACHIEVEMENT_GRADES.find(g => g.grade === grade);
  return found ? found.color : "text-gray-600";
};

const getAchievementBg = (grade: string) => {
  const found = ACHIEVEMENT_GRADES.find(g => g.grade === grade);
  return found ? found.bg : "bg-gray-100";
};

export function GradesTab() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    semester: "고1-1",
    subject: "",
    midterm: "",
    final: "",
    performance: "",
    achievementGrade: "",
    rawScore: "",
    memo: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGrades();
  }, [selectedSemester]);

  const loadGrades = async () => {
    try {
      const res = await gradesApi.list(selectedSemester || undefined);
      setGrades(res.data);
    } catch (error) {
      console.error("성적 로드 실패:", error);
    }
  };

  // 성취도 통계 계산
  const getStats = () => {
    const gradeCount: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    grades.forEach(g => {
      if (g.achievementGrade && gradeCount[g.achievementGrade] !== undefined) {
        gradeCount[g.achievementGrade]++;
      }
    });
    const total = Object.values(gradeCount).reduce((a, b) => a + b, 0);
    return { gradeCount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await gradesApi.create({
        ...formData,
        midterm: formData.midterm ? Number(formData.midterm) : undefined,
        final: formData.final ? Number(formData.final) : undefined,
        performance: formData.performance ? Number(formData.performance) : undefined,
        finalGrade: formData.achievementGrade ? ACHIEVEMENT_GRADES.findIndex(g => g.grade === formData.achievementGrade) + 1 : undefined,
        rawScore: formData.rawScore ? Number(formData.rawScore) : undefined,
        memo: formData.memo || (formData.achievementGrade ? `성취도: ${formData.achievementGrade}` : undefined),
      });
      await loadGrades();
      setShowForm(false);
      setFormData({
        semester: "고1-1",
        subject: "",
        midterm: "",
        final: "",
        performance: "",
        achievementGrade: "",
        rawScore: "",
        memo: "",
      });
    } catch (error) {
      console.error("성적 추가 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await gradesApi.delete(id);
      await loadGrades();
    } catch (error) {
      console.error("성적 삭제 실패:", error);
    }
  };

  const stats = getStats();

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        📊 성적 관리 (고교학점제)
      </h2>

      {/* 5등급제 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <Info size={20} className="text-blue-500 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-700 mb-2">5등급 성취평가제</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {ACHIEVEMENT_GRADES.map((g) => (
                <span key={g.grade} className={`px-3 py-1 rounded-full ${g.bg} ${g.color} font-medium`}>
                  {g.grade} ({g.grade === "E" ? "60미만" : `${g.min}이상`})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 필터 & 통계 */}
      <div className="flex flex-wrap gap-4 items-start mb-6">
        <div>
          <label className="label">학기 선택</label>
          <select
            className="input"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">전체</option>
            <option value="고1-1">고1-1</option>
            <option value="고1-2">고1-2</option>
            <option value="고2-1">고2-1</option>
            <option value="고2-2">고2-2</option>
            <option value="고3-1">고3-1</option>
          </select>
        </div>

        {stats.total > 0 && (
          <div className="ml-auto">
            <p className="text-sm text-gray-500 mb-2">성취도 현황</p>
            <div className="flex gap-2">
              {ACHIEVEMENT_GRADES.map((g) => (
                <div key={g.grade} className={`px-3 py-2 rounded-lg ${g.bg} text-center min-w-[50px]`}>
                  <span className={`font-bold ${g.color}`}>{g.grade}</span>
                  <p className="text-xs text-gray-600">{stats.gradeCount[g.grade]}개</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 성적 목록 */}
      <div className="space-y-3 mb-6">
        {grades.map((grade) => {
          // memo에서 성취도 추출 또는 finalGrade로부터 변환
          const achieveGrade = grade.memo?.includes("성취도:") 
            ? grade.memo.split("성취도:")[1]?.trim().charAt(0) 
            : (grade.finalGrade && grade.finalGrade <= 5 ? ACHIEVEMENT_GRADES[grade.finalGrade - 1]?.grade : null);
          
          return (
            <div
              key={grade.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 w-16">{grade.semester}</span>
                <span className="font-semibold">{grade.subject}</span>
                {achieveGrade && (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getAchievementBg(achieveGrade)} ${getAchievementColor(achieveGrade)}`}>
                    {achieveGrade}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 flex gap-3">
                  {grade.midterm !== undefined && grade.midterm !== null && (
                    <span className="bg-white px-2 py-1 rounded">중간: <b>{grade.midterm}</b>점</span>
                  )}
                  {grade.final !== undefined && grade.final !== null && (
                    <span className="bg-white px-2 py-1 rounded">기말: <b>{grade.final}</b>점</span>
                  )}
                  {grade.performance !== undefined && grade.performance !== null && (
                    <span className="bg-white px-2 py-1 rounded">수행: <b>{grade.performance}</b>점</span>
                  )}
                  {grade.rawScore !== undefined && grade.rawScore !== null && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">원점수: <b>{grade.rawScore}</b></span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(grade.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {grades.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            등록된 성적이 없습니다.
          </p>
        )}
      </div>

      {/* 추가 폼 */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">학기</label>
              <select
                className="input"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              >
                <option value="고1-1">고1-1</option>
                <option value="고1-2">고1-2</option>
                <option value="고2-1">고2-1</option>
                <option value="고2-2">고2-2</option>
                <option value="고3-1">고3-1</option>
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
              <label className="label">중간고사</label>
              <input
                type="number"
                className="input"
                value={formData.midterm}
                onChange={(e) => setFormData({ ...formData, midterm: e.target.value })}
                placeholder="원점수"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="label">기말고사</label>
              <input
                type="number"
                className="input"
                value={formData.final}
                onChange={(e) => setFormData({ ...formData, final: e.target.value })}
                placeholder="원점수"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="label">수행평가</label>
              <input
                type="number"
                className="input"
                value={formData.performance}
                onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
                placeholder="점수"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="label">성취도 (5등급)</label>
              <select
                className="input"
                value={formData.achievementGrade}
                onChange={(e) => setFormData({ ...formData, achievementGrade: e.target.value })}
              >
                <option value="">선택</option>
                {ACHIEVEMENT_GRADES.map((g) => (
                  <option key={g.grade} value={g.grade}>
                    {g.grade} ({g.grade === "E" ? "60미만" : `${g.min}이상`})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">원점수 (총점)</label>
              <input
                type="number"
                className="input"
                value={formData.rawScore}
                onChange={(e) => setFormData({ ...formData, rawScore: e.target.value })}
                placeholder="예: 85"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="label">메모</label>
              <input
                type="text"
                className="input"
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder="평균, 표준편차 등"
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
            성적 추가
          </button>
        </div>
      )}

      {/* 등급 기준 안내 */}
      <div className="mt-6 p-4 bg-gray-100 rounded-xl">
        <h3 className="font-semibold text-gray-700 mb-2">📋 고교학점제 성취평가 기준</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left py-1">성취도</th>
              <th className="text-left py-1">원점수 기준</th>
              <th className="text-left py-1">의미</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1 text-blue-600 font-bold">A</td><td>90점 이상</td><td>매우 우수</td></tr>
            <tr><td className="py-1 text-green-600 font-bold">B</td><td>80~89점</td><td>우수</td></tr>
            <tr><td className="py-1 text-yellow-600 font-bold">C</td><td>70~79점</td><td>보통</td></tr>
            <tr><td className="py-1 text-orange-600 font-bold">D</td><td>60~69점</td><td>노력 필요</td></tr>
            <tr><td className="py-1 text-red-600 font-bold">E</td><td>60점 미만</td><td>미이수 위험</td></tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">
          * 고교학점제에서는 E등급 과목이 많으면 미이수 처리되어 졸업에 영향을 줄 수 있습니다.
        </p>
      </div>
    </div>
  );
}
