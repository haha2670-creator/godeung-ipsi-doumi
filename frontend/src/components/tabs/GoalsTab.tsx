"use client";

import { useState, useEffect } from "react";
import { goalsApi, dataApi } from "@/lib/api";
import { useTabStore } from "@/lib/store";
import { Plus, Trash2, Map, AlertCircle, BarChart3, ExternalLink } from "lucide-react";

interface Goal {
  id: string;
  rank: number;
  university: string;
  major: string;
  admissionType: string;
}

export function GoalsTab() {
  const { setActiveTab } = useTabStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [universities, setUniversities] = useState<string[]>([]);
  const [majors, setMajors] = useState<Record<string, string[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rank: 1,
    university: "",
    major: "",
    admissionType: "학생부종합",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [publicDataEnabled, setPublicDataEnabled] = useState(false);
  const [universityStats, setUniversityStats] = useState<Record<string, { year: string; competitionRate: string }>>({});
  const [statsLoading, setStatsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadGoals();
    loadUniversities();
    dataApi.publicDataStatus().then((r) => setPublicDataEnabled(r.data?.enabled ?? false)).catch(() => {});
  }, []);

  const fetchUniversityStats = async (universityName: string) => {
    setStatsLoading((p) => ({ ...p, [universityName]: true }));
    try {
      const res = await dataApi.universityStatsFromPublic(universityName);
      setUniversityStats((p) => ({
        ...p,
        [universityName]: { year: res.data.year, competitionRate: res.data.competitionRate },
      }));
    } catch {
      setUniversityStats((p) => ({ ...p, [universityName]: { year: "-", competitionRate: "API 준비 중" } }));
    } finally {
      setStatsLoading((p) => ({ ...p, [universityName]: false }));
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

  const loadUniversities = async () => {
    try {
      const res = await dataApi.universities();
      setUniversities(res.data.map((u: any) => u.name));
    } catch (error) {
      console.error("대학 목록 로드 실패:", error);
    }
  };

  const loadMajors = async (universityName: string) => {
    try {
      const res = await dataApi.universityMajors(universityName);
      // Flatten majors from all colleges
      const allMajors: string[] = [];
      Object.values(res.data).forEach((collegeMajors: any) => {
        allMajors.push(...collegeMajors);
      });
      setMajors({ ...majors, [universityName]: allMajors });
    } catch (error) {
      console.error("학과 목록 로드 실패:", error);
    }
  };

  const handleUniversityChange = (university: string) => {
    setFormData({ ...formData, university, major: "" });
    if (!majors[university]) {
      loadMajors(university);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 필수 필드 검증
    if (!formData.university) {
      setError("대학교를 선택해주세요.");
      return;
    }
    if (!formData.major) {
      setError("학과를 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      await goalsApi.create(formData);
      await loadGoals();
      setShowForm(false);
      setFormData({ rank: goals.length + 2, university: "", major: "", admissionType: "학생부종합" });
      setError("");
    } catch (error) {
      console.error("목표 추가 실패:", error);
      setError("목표 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await goalsApi.delete(id);
      await loadGoals();
    } catch (error) {
      console.error("목표 삭제 실패:", error);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        🎯 목표 대학 설정
      </h2>

      {/* 목표 목록 */}
      <div className="space-y-4 mb-6">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`flex items-center justify-between p-4 rounded-xl border-l-4 bg-gray-50 ${
              goal.rank === 1 ? "border-red-500" :
              goal.rank === 2 ? "border-teal-500" :
              "border-blue-500"
            }`}
          >
            <div className="flex-1 min-w-0">
              <span className="font-bold text-primary-500 mr-2">{goal.rank}지망</span>
              <span className="text-lg font-semibold">{goal.university} {goal.major}</span>
              <span className="ml-2 text-sm text-gray-500">({goal.admissionType})</span>
              <div className="mt-2 flex items-center gap-2">
                {universityStats[goal.university] ? (
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                    {universityStats[goal.university].year}년 학교(전체) 정원내 신입생 경쟁률: {universityStats[goal.university].competitionRate}
                  </span>
                ) : publicDataEnabled ? (
                  <button
                    type="button"
                    onClick={() => fetchUniversityStats(goal.university)}
                    disabled={statsLoading[goal.university]}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center gap-1"
                  >
                    {statsLoading[goal.university] ? "조회 중..." : (
                      <>
                        <BarChart3 size={12} />
                        공공데이터 학교 경쟁률 조회
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded" title="백엔드 .env에 DATA_GO_KR_SERVICE_KEY 설정">
                    <BarChart3 size={12} className="inline mr-1" />
                    학교 경쟁률 조회 (API 키 설정 필요)
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  window.location.hash = `roadmap-${goal.id}`;
                  setActiveTab('roadmap');
                }}
                className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                title="로드맵 보기"
              >
                <Map size={18} />
              </button>
              <button
                onClick={() => handleDelete(goal.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            목표 대학을 추가해주세요!
          </p>
        )}
      </div>

      {goals.length > 0 && (
        <div className={`mb-6 p-4 rounded-xl ${publicDataEnabled ? "bg-blue-50 border border-blue-100" : "bg-amber-50 border border-amber-100"}`}>
          <p className={`text-sm flex items-center gap-2 ${publicDataEnabled ? "text-blue-800" : "text-amber-800"}`}>
            <ExternalLink size={16} />
            {publicDataEnabled ? (
              <>
                <strong>공공데이터 연동됨:</strong> 각 목표 카드의 &quot;경쟁률 조회&quot; 버튼을 눌러 학교(전체) 정원내 신입생 경쟁률을 확인하세요. (학과별이 아닌 학교 단위 수치입니다.)
              </>
            ) : (
              <>
                <strong>공공데이터 미연동:</strong> 경쟁률 조회 기능은 현재 준비 중입니다. (서비스 키 등록 필요)
              </>
            )}
          </p>
        </div>
      )}

      {/* 추가 폼 */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">지망 순위</label>
              <select
                className="input"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}지망</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">전형</label>
              <select
                className="input"
                value={formData.admissionType}
                onChange={(e) => setFormData({ ...formData, admissionType: e.target.value })}
              >
                <option value="학생부종합">학생부종합</option>
                <option value="학생부교과">학생부교과</option>
                <option value="논술">논술</option>
                <option value="정시">정시</option>
              </select>
            </div>

            <div>
              <label className="label">
                대학 <span className="text-red-500">*</span>
              </label>
              <select
                className={`input ${error && !formData.university ? "border-red-400" : ""}`}
                value={formData.university}
                onChange={(e) => {
                  handleUniversityChange(e.target.value);
                  if (error) setError("");
                }}
              >
                <option value="">대학 선택</option>
                {universities.map((univ) => (
                  <option key={univ} value={univ}>{univ}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                학과 <span className="text-red-500">*</span>
              </label>
              <select
                className={`input ${error && formData.university && !formData.major ? "border-red-400" : ""}`}
                value={formData.major}
                onChange={(e) => {
                  setFormData({ ...formData, major: e.target.value });
                  if (error) setError("");
                }}
                disabled={!formData.university}
              >
                <option value="">학과 선택</option>
                {(majors[formData.university] || []).map((major) => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "추가 중..." : "추가"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="inline mr-2" size={18} />
            목표 추가
          </button>
        </div>
      )}
    </div>
  );
}
