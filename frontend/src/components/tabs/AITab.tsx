"use client";

import { useState, useEffect } from "react";
import { aiApi, goalsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Sparkles, Copy, Check, Loader2, FileText, MessageCircle, BookOpen, Target } from "lucide-react";

type AIMode = "setech" | "essay" | "interview" | "study" | "chance";

interface Goal {
  id: string;
  university: string;
  major: string;
  admissionType: string;
}

export function AITab() {
  const { user } = useAuthStore();
  const [mode, setMode] = useState<AIMode>("setech");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  // 세특 생성 폼
  const [setechForm, setSetechForm] = useState({
    category: "세특",
    title: "",
    subject: "",
    content: "",
  });

  // 자소서 폼
  const [essayForm, setEssayForm] = useState({
    prompt: "",
    activities: "",
  });

  // 면접 폼
  const [interviewForm, setInterviewForm] = useState({
    university: "",
    major: "",
    activities: "",
  });

  // 학습 계획 폼
  const [studyForm, setStudyForm] = useState({
    targetUniversity: "",
    targetMajor: "",
  });

  // 합격 가능성 폼
  const [chanceForm, setChanceForm] = useState({
    targetUniversity: "",
    targetMajor: "",
    admissionType: "학생부종합",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const res = await goalsApi.list();
      setGoals(res.data);
    } catch (error) {
      console.error("목표 로드 실패:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI 세특 생성
  const handleSetech = async () => {
    if (!setechForm.title || !setechForm.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await aiApi.generateSetech(setechForm);
      setResult(res.data.setech);
    } catch (error) {
      setResult("❌ 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // AI 자소서 생성
  const handleEssay = async () => {
    if (!essayForm.prompt || !essayForm.activities) {
      alert("문항과 활동 내역을 입력해주세요.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await aiApi.generatePersonalStatement({
        prompt: essayForm.prompt,
        activities: essayForm.activities.split("\n").filter(a => a.trim()),
      });
      setResult(res.data.essay);
    } catch (error) {
      setResult("❌ 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // AI 면접 질문 생성
  const handleInterview = async () => {
    if (!interviewForm.university || !interviewForm.major) {
      alert("대학과 학과를 입력해주세요.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await aiApi.generateInterviewQuestions({
        university: interviewForm.university,
        major: interviewForm.major,
        activities: interviewForm.activities.split("\n").filter(a => a.trim()),
      });
      const questions = res.data.questions;
      setResult(questions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n\n"));
    } catch (error) {
      setResult("❌ 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // AI 학습 계획 생성
  const handleStudyPlan = async () => {
    if (!studyForm.targetUniversity || !studyForm.targetMajor) {
      alert("목표 대학과 학과를 입력해주세요.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await aiApi.generateStudyPlan({
        grade: user?.grade || "고1",
        targetUniversity: studyForm.targetUniversity,
        targetMajor: studyForm.targetMajor,
        currentGrades: [],
      });
      setResult(res.data.plan);
    } catch (error) {
      setResult("❌ 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 합격 가능성 분석
  const handleChance = async () => {
    if (!chanceForm.targetUniversity || !chanceForm.targetMajor) {
      alert("목표 대학과 학과를 입력해주세요.");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await aiApi.analyzeAdmissionChance({
        targetUniversity: chanceForm.targetUniversity,
        targetMajor: chanceForm.targetMajor,
        admissionType: chanceForm.admissionType,
        studentProfile: {
          grade: user?.grade,
          school: user?.school,
          track: user?.track,
        },
      });
      setResult(res.data.analysis);
    } catch (error) {
      setResult("❌ 분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    { id: "setech", label: "✨ 세특 생성", icon: Sparkles },
    { id: "essay", label: "📝 자소서", icon: FileText },
    { id: "interview", label: "🎤 면접 질문", icon: MessageCircle },
    { id: "study", label: "📊 학습 계획", icon: BookOpen },
    { id: "chance", label: "🎯 합격 분석", icon: Target },
  ];

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        🤖 AI 입시 도우미
      </h2>

      {/* 모드 선택 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as AIMode); setResult(""); }}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              mode === m.id
                ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 세특 생성 */}
      {mode === "setech" && (
        <div className="space-y-4">
          <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            💡 생활기록부 세특은 <strong>과목별 500자 이내</strong>로 작성됩니다. AI가 500자 제한을 준수해 생성합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">카테고리</label>
              <select
                className="input"
                value={setechForm.category}
                onChange={(e) => setSetechForm({ ...setechForm, category: e.target.value })}
              >
                <option value="세특">세특</option>
                <option value="독서">독서</option>
                <option value="동아리">동아리</option>
                <option value="봉사">봉사</option>
              </select>
            </div>
            <div>
              <label className="label">과목 (선택)</label>
              <input
                className="input"
                value={setechForm.subject}
                onChange={(e) => setSetechForm({ ...setechForm, subject: e.target.value })}
                placeholder="예: 물리학"
              />
            </div>
            <div>
              <label className="label">제목</label>
              <input
                className="input"
                value={setechForm.title}
                onChange={(e) => setSetechForm({ ...setechForm, title: e.target.value })}
                placeholder="예: 뉴턴 운동법칙 탐구"
              />
            </div>
          </div>
          <div>
            <label className="label">활동 내용</label>
            <textarea
              className="input min-h-[120px]"
              value={setechForm.content}
              onChange={(e) => setSetechForm({ ...setechForm, content: e.target.value })}
              placeholder="활동 내용을 자세히 입력하세요. AI가 전문적인 세특 문구로 변환합니다."
            />
          </div>
          <button onClick={handleSetech} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : <Sparkles className="inline mr-2" size={18} />}
            {loading ? "생성 중..." : "AI 세특 생성"}
          </button>
        </div>
      )}

      {/* 자소서 작성 */}
      {mode === "essay" && (
        <div className="space-y-4">
          <div>
            <label className="label">자소서 문항</label>
            <textarea
              className="input min-h-[80px]"
              value={essayForm.prompt}
              onChange={(e) => setEssayForm({ ...essayForm, prompt: e.target.value })}
              placeholder="예: 고등학교 재학 기간 중 학업에 기울인 노력과 학습 경험에 대해 서술하시오."
            />
          </div>
          <div>
            <label className="label">주요 활동 (줄바꿈으로 구분)</label>
            <textarea
              className="input min-h-[120px]"
              value={essayForm.activities}
              onChange={(e) => setEssayForm({ ...essayForm, activities: e.target.value })}
              placeholder="물리 동아리 활동&#10;과학 탐구 대회 수상&#10;독서 활동 (책 제목)"
            />
          </div>
          <button onClick={handleEssay} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : <FileText className="inline mr-2" size={18} />}
            {loading ? "생성 중..." : "AI 자소서 초안 생성"}
          </button>
        </div>
      )}

      {/* 면접 질문 */}
      {mode === "interview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">지원 대학</label>
              <input
                className="input"
                value={interviewForm.university}
                onChange={(e) => setInterviewForm({ ...interviewForm, university: e.target.value })}
                placeholder="예: 서울대학교"
              />
            </div>
            <div>
              <label className="label">지원 학과</label>
              <input
                className="input"
                value={interviewForm.major}
                onChange={(e) => setInterviewForm({ ...interviewForm, major: e.target.value })}
                placeholder="예: 컴퓨터공학부"
              />
            </div>
          </div>
          <div>
            <label className="label">주요 활동 (줄바꿈으로 구분)</label>
            <textarea
              className="input min-h-[100px]"
              value={interviewForm.activities}
              onChange={(e) => setInterviewForm({ ...interviewForm, activities: e.target.value })}
              placeholder="코딩 동아리 부장&#10;앱 개발 프로젝트&#10;정보올림피아드 수상"
            />
          </div>
          <button onClick={handleInterview} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : <MessageCircle className="inline mr-2" size={18} />}
            {loading ? "생성 중..." : "AI 면접 예상 질문 생성"}
          </button>
        </div>
      )}

      {/* 학습 계획 */}
      {mode === "study" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            목표 대학과 학과를 입력하면 맞춤형 학습 계획을 추천해드립니다.
          </p>
          {goals.length > 0 && (
            <div className="mb-4">
              <label className="label">내 목표 대학에서 선택</label>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setStudyForm({ targetUniversity: goal.university, targetMajor: goal.major })}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
                  >
                    {goal.university} {goal.major}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">목표 대학</label>
              <input
                className="input"
                value={studyForm.targetUniversity}
                onChange={(e) => setStudyForm({ ...studyForm, targetUniversity: e.target.value })}
                placeholder="예: 연세대학교"
              />
            </div>
            <div>
              <label className="label">목표 학과</label>
              <input
                className="input"
                value={studyForm.targetMajor}
                onChange={(e) => setStudyForm({ ...studyForm, targetMajor: e.target.value })}
                placeholder="예: 경영학과"
              />
            </div>
          </div>
          <button onClick={handleStudyPlan} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : <BookOpen className="inline mr-2" size={18} />}
            {loading ? "생성 중..." : "AI 학습 계획 추천"}
          </button>
        </div>
      )}

      {/* 합격 가능성 */}
      {mode === "chance" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            현재 프로필을 바탕으로 합격 가능성을 분석하고 개선 방안을 제시합니다.
          </p>
          {goals.length > 0 && (
            <div className="mb-4">
              <label className="label">내 목표 대학에서 선택</label>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setChanceForm({ 
                      targetUniversity: goal.university, 
                      targetMajor: goal.major,
                      admissionType: goal.admissionType 
                    })}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                  >
                    {goal.university} {goal.major}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">목표 대학</label>
              <input
                className="input"
                value={chanceForm.targetUniversity}
                onChange={(e) => setChanceForm({ ...chanceForm, targetUniversity: e.target.value })}
                placeholder="예: 고려대학교"
              />
            </div>
            <div>
              <label className="label">목표 학과</label>
              <input
                className="input"
                value={chanceForm.targetMajor}
                onChange={(e) => setChanceForm({ ...chanceForm, targetMajor: e.target.value })}
                placeholder="예: 전기전자공학부"
              />
            </div>
            <div>
              <label className="label">전형</label>
              <select
                className="input"
                value={chanceForm.admissionType}
                onChange={(e) => setChanceForm({ ...chanceForm, admissionType: e.target.value })}
              >
                <option value="학생부종합">학생부종합</option>
                <option value="학생부교과">학생부교과</option>
                <option value="논술">논술</option>
                <option value="정시">정시</option>
              </select>
            </div>
          </div>
          <button onClick={handleChance} className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Loader2 className="inline animate-spin mr-2" size={18} /> : <Target className="inline mr-2" size={18} />}
            {loading ? "분석 중..." : "합격 가능성 분석"}
          </button>
        </div>
      )}

      {/* 결과 표시 */}
      {result && (
        <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <h3 className="font-bold text-purple-700">
              {mode === "setech" && "✨ 생성된 세특"}
              {mode === "essay" && "📝 자소서 초안"}
              {mode === "interview" && "🎤 면접 예상 질문"}
              {mode === "study" && "📊 맞춤 학습 계획"}
              {mode === "chance" && "🎯 합격 가능성 분석"}
            </h3>
            <div className="flex items-center gap-2">
              {mode === "setech" && (
                <span className={`text-sm ${result.length > 500 ? "text-red-600 font-medium" : "text-gray-500"}`}>
                  {result.length}자 / 500자
                </span>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
          </div>
          {mode === "setech" && result.length > 500 && (
            <p className="text-red-600 text-sm mb-2">⚠️ 500자를 초과했습니다. 생활기록부 등록 전 축약이 필요합니다.</p>
          )}
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
