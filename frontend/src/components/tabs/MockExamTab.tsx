"use client";

import { useState, useEffect } from "react";
import { mockExamsApi } from "@/lib/api";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { formatDate, getGradeColor } from "@/lib/utils";

interface MockExam {
  id: string;
  date: string;
  type: string;
  koreanScore?: number;
  koreanGrade: number;
  mathScore?: number;
  mathGrade: number;
  englishScore?: number;
  englishGrade: number;
}

export function MockExamTab() {
  const [exams, setExams] = useState<MockExam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    type: "3월 학평",
    koreanScore: "",
    koreanGrade: "1",
    mathScore: "",
    mathGrade: "1",
    englishScore: "",
    englishGrade: "1",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const res = await mockExamsApi.list();
      setExams(res.data);
    } catch (error) {
      console.error("모의고사 로드 실패:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await mockExamsApi.create({
        date: formData.date,
        type: formData.type,
        koreanScore: formData.koreanScore ? Number(formData.koreanScore) : undefined,
        koreanGrade: Number(formData.koreanGrade),
        mathScore: formData.mathScore ? Number(formData.mathScore) : undefined,
        mathGrade: Number(formData.mathGrade),
        englishScore: formData.englishScore ? Number(formData.englishScore) : undefined,
        englishGrade: Number(formData.englishGrade),
      });
      await loadExams();
      setShowForm(false);
    } catch (error) {
      console.error("모의고사 추가 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await mockExamsApi.delete(id);
      await loadExams();
    } catch (error) {
      console.error("모의고사 삭제 실패:", error);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        📝 모의고사 성적 관리
      </h2>

      {/* 모의고사 목록 */}
      <div className="space-y-4 mb-6">
        {exams.map((exam) => (
          <div key={exam.id} className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-sm text-gray-500">{formatDate(exam.date)}</span>
                <h3 className="font-bold text-lg">{exam.type}</h3>
              </div>
              <button
                onClick={() => handleDelete(exam.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-500">국어</p>
                <p className={`text-2xl font-bold ${getGradeColor(exam.koreanGrade)}`}>
                  {exam.koreanGrade}등급
                </p>
                {exam.koreanScore && (
                  <p className="text-xs text-gray-400">{exam.koreanScore}점</p>
                )}
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-500">수학</p>
                <p className={`text-2xl font-bold ${getGradeColor(exam.mathGrade)}`}>
                  {exam.mathGrade}등급
                </p>
                {exam.mathScore && (
                  <p className="text-xs text-gray-400">{exam.mathScore}점</p>
                )}
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-500">영어</p>
                <p className={`text-2xl font-bold ${getGradeColor(exam.englishGrade)}`}>
                  {exam.englishGrade}등급
                </p>
                {exam.englishScore && (
                  <p className="text-xs text-gray-400">{exam.englishScore}점</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {exams.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            등록된 모의고사가 없습니다.
          </p>
        )}
      </div>

      {/* 추가 폼 */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="label">시험 유형</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="3월 학평">3월 학평</option>
                <option value="4월 학평">4월 학평</option>
                <option value="6월 평가원">6월 평가원</option>
                <option value="7월 학평">7월 학평</option>
                <option value="9월 평가원">9월 평가원</option>
                <option value="10월 학평">10월 학평</option>
                <option value="수능">수능</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">국어 등급</label>
              <select
                className="input"
                value={formData.koreanGrade}
                onChange={(e) => setFormData({ ...formData, koreanGrade: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                  <option key={g} value={g}>{g}등급</option>
                ))}
              </select>
              <input
                type="number"
                className="input mt-2"
                value={formData.koreanScore}
                onChange={(e) => setFormData({ ...formData, koreanScore: e.target.value })}
                placeholder="원점수 (선택)"
              />
            </div>
            <div>
              <label className="label">수학 등급</label>
              <select
                className="input"
                value={formData.mathGrade}
                onChange={(e) => setFormData({ ...formData, mathGrade: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                  <option key={g} value={g}>{g}등급</option>
                ))}
              </select>
              <input
                type="number"
                className="input mt-2"
                value={formData.mathScore}
                onChange={(e) => setFormData({ ...formData, mathScore: e.target.value })}
                placeholder="원점수 (선택)"
              />
            </div>
            <div>
              <label className="label">영어 등급</label>
              <select
                className="input"
                value={formData.englishGrade}
                onChange={(e) => setFormData({ ...formData, englishGrade: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                  <option key={g} value={g}>{g}등급</option>
                ))}
              </select>
              <input
                type="number"
                className="input mt-2"
                value={formData.englishScore}
                onChange={(e) => setFormData({ ...formData, englishScore: e.target.value })}
                placeholder="원점수 (선택)"
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
            모의고사 추가
          </button>
        </div>
      )}
    </div>
  );
}
