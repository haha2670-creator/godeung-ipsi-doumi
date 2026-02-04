"use client";

import { useState, useEffect } from "react";
import { clubsApi, goalsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Plus, Trash2, Target, Star, Lightbulb, CheckCircle2 } from "lucide-react";

interface Club {
  id: string;
  name: string;
  category: string;
  grade?: string;
  activity?: string;
  role?: string;
  period?: string;
}

interface SchoolClub {
  name: string;
  category: string;
  grade: string;
  activity: string;
  location: string;
}

interface Goal {
  id: string;
  university: string;
  major: string;
  admissionType: string;
}

// 학과별 추천 동아리 매핑
const MAJOR_CLUB_RECOMMENDATIONS: Record<string, {
  keywords: string[];
  recommendedCategories: string[];
  clubKeywords: string[];
  tips: string[];
  description: string;
}> = {
  "공학": {
    keywords: ["공학", "기계", "전기", "전자", "컴퓨터", "소프트웨어", "정보", "산업", "건축", "화학공학", "재료", "신소재", "로봇", "AI", "인공지능", "데이터"],
    recommendedCategories: ["과학", "학술"],
    clubKeywords: ["과학", "로봇", "코딩", "프로그래밍", "발명", "수학", "물리", "화학", "공학", "드론", "SW", "IT", "메이커"],
    tips: [
      "과학/발명 관련 동아리에서 프로젝트 경험을 쌓으세요",
      "대회 참가 경험이 생기부에 큰 도움이 됩니다",
      "팀 프로젝트에서 리더십을 발휘하세요",
    ],
    description: "공학계열은 실험/제작 경험이 중요합니다. 과학동아리나 발명동아리에서 프로젝트를 수행하고, 관련 대회에 참가하면 좋습니다."
  },
  "자연과학": {
    keywords: ["자연과학", "수학", "물리", "화학", "생명", "생물", "지구", "환경", "천문"],
    recommendedCategories: ["과학", "학술"],
    clubKeywords: ["과학", "수학", "물리", "화학", "생명", "생물", "환경", "천문", "실험", "탐구"],
    tips: [
      "실험 및 탐구 활동에 적극 참여하세요",
      "과학 관련 연구 보고서를 작성해보세요",
      "과학 캠프나 체험 프로그램에 참여하세요",
    ],
    description: "자연과학계열은 탐구 능력이 핵심입니다. 과학 동아리에서 실험하고, 소논문을 작성하는 경험이 큰 도움이 됩니다."
  },
  "의학": {
    keywords: ["의학", "의예", "의대", "치의", "치대", "한의", "약학", "약대", "간호", "수의"],
    recommendedCategories: ["과학", "봉사"],
    clubKeywords: ["생명", "생물", "의료", "봉사", "보건", "과학", "화학", "RCY", "적십자"],
    tips: [
      "의료 봉사 활동 경험을 쌓으세요",
      "생명과학 관련 탐구 활동을 하세요",
      "의료 윤리에 대한 고민을 생기부에 담으세요",
    ],
    description: "의약계열은 과학적 역량과 함께 봉사정신이 중요합니다. 과학동아리와 봉사동아리 활동을 병행하면 좋습니다."
  },
  "경영경제": {
    keywords: ["경영", "경제", "금융", "회계", "무역", "국제통상", "세무"],
    recommendedCategories: ["학술", "기타"],
    clubKeywords: ["경제", "경영", "금융", "창업", "마케팅", "시사", "토론", "신문"],
    tips: [
      "경제/시사 토론 동아리 활동을 추천합니다",
      "모의 창업이나 경영 시뮬레이션 경험을 쌓으세요",
      "경제 관련 기사 분석, 보고서 작성 활동을 하세요",
    ],
    description: "경영/경제계열은 시사에 대한 관심과 분석력이 중요합니다. 경제동아리나 토론동아리에서 활발히 활동하세요."
  },
  "인문": {
    keywords: ["인문", "국어국문", "영어영문", "사학", "역사", "철학", "문학", "어문", "언어", "문헌정보"],
    recommendedCategories: ["학술", "예술"],
    clubKeywords: ["독서", "문학", "토론", "역사", "철학", "글쓰기", "신문", "방송", "영어"],
    tips: [
      "독서 토론 동아리에서 깊이 있는 토론을 하세요",
      "교내 신문/방송부 활동도 좋은 경험입니다",
      "다양한 장르의 글쓰기에 도전하세요",
    ],
    description: "인문계열은 독서량과 글쓰기 능력이 중요합니다. 독서동아리나 문예창작 동아리 활동을 추천합니다."
  },
  "사회과학": {
    keywords: ["사회", "정치", "외교", "행정", "법학", "사회학", "심리", "미디어", "언론", "광고", "홍보"],
    recommendedCategories: ["학술", "봉사"],
    clubKeywords: ["토론", "시사", "사회", "봉사", "심리", "상담", "신문", "방송", "법"],
    tips: [
      "사회 문제에 관심을 갖고 토론하세요",
      "지역사회 봉사활동에 참여하세요",
      "모의 UN, 모의 재판 등에 참가해보세요",
    ],
    description: "사회과학계열은 사회 문제에 대한 관심이 중요합니다. 시사토론, 봉사동아리 활동이 도움됩니다."
  },
  "교육": {
    keywords: ["교육", "사범", "교대", "유아교육", "초등교육", "특수교육"],
    recommendedCategories: ["봉사", "학술"],
    clubKeywords: ["교육", "봉사", "멘토링", "또래", "상담", "독서"],
    tips: [
      "교육 봉사나 멘토링 활동을 적극 하세요",
      "또래 상담 동아리도 좋은 경험입니다",
      "다양한 연령대와 소통하는 경험을 쌓으세요",
    ],
    description: "교육계열은 가르치는 경험이 중요합니다. 교육봉사, 멘토링 동아리에서 지도 경험을 쌓으세요."
  },
  "예술": {
    keywords: ["예술", "미술", "음악", "디자인", "영화", "연극", "무용", "실용음악"],
    recommendedCategories: ["예술"],
    clubKeywords: ["미술", "음악", "밴드", "오케스트라", "연극", "영화", "디자인", "사진", "댄스"],
    tips: [
      "관련 예술 동아리에서 꾸준히 활동하세요",
      "교내 공연/전시에 적극 참여하세요",
      "포트폴리오를 체계적으로 준비하세요",
    ],
    description: "예술계열은 꾸준한 창작 활동이 중요합니다. 관련 동아리에서 작품 활동을 하고 공연/전시 경험을 쌓으세요."
  },
  "체육": {
    keywords: ["체육", "스포츠", "운동"],
    recommendedCategories: ["체육"],
    clubKeywords: ["축구", "농구", "야구", "배구", "수영", "태권도", "스포츠"],
    tips: [
      "해당 종목 동아리에서 꾸준히 활동하세요",
      "대회 참가 및 수상 경력을 쌓으세요",
      "스포츠 과학에 대한 관심도 보여주세요",
    ],
    description: "체육계열은 운동 능력과 함께 스포츠에 대한 이해가 필요합니다. 관련 동아리에서 활동하며 대회에 참가하세요."
  },
  "국제": {
    keywords: ["국제", "글로벌", "외국어", "통번역"],
    recommendedCategories: ["학술"],
    clubKeywords: ["영어", "일본어", "중국어", "외국어", "토론", "UN", "국제", "문화교류"],
    tips: [
      "외국어 동아리에서 실력을 키우세요",
      "모의 UN, 국제 교류 활동에 참여하세요",
      "다문화 이해 봉사활동도 좋습니다",
    ],
    description: "국제/외국어 계열은 어학 능력과 국제 감각이 중요합니다. 외국어 동아리나 국제교류 활동을 추천합니다."
  },
};

// 학과명으로 추천 카테고리 찾기
const findClubRecommendation = (major: string) => {
  for (const [category, data] of Object.entries(MAJOR_CLUB_RECOMMENDATIONS)) {
    if (data.keywords.some(keyword => major.includes(keyword))) {
      return { category, ...data };
    }
  }
  return null;
};

export function ClubsTab() {
  const { user } = useAuthStore();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [schoolClubs, setSchoolClubs] = useState<SchoolClub[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [inputMethod, setInputMethod] = useState<"select" | "manual">("select");
  const [selectedSchoolClub, setSelectedSchoolClub] = useState<SchoolClub | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "학술",
    grade: "",
    activity: "",
    role: "",
    period: "",
  });
  const [loading, setLoading] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(true);
  const [expandedMatchingClubs, setExpandedMatchingClubs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadClubs();
    loadGoals();
    if (user?.school) {
      loadSchoolClubs(user.school);
    } else {
      setSchoolClubs([]);
    }
  }, [user?.school]);

  const loadClubs = async () => {
    try {
      const res = await clubsApi.list();
      setClubs(res.data);
    } catch (error) {
      console.error("동아리 로드 실패:", error);
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

  const loadSchoolClubs = async (schoolName: string) => {
    try {
      const res = await clubsApi.schoolClubs(schoolName);
      setSchoolClubs(res.data || []);
    } catch (error) {
      console.error("학교 동아리 로드 실패:", error);
      setSchoolClubs([]);
    }
  };

  const handleSchoolClubSelect = (clubName: string) => {
    const club = schoolClubs.find((c) => c.name === clubName);
    if (club) {
      setSelectedSchoolClub(club);
      setFormData({
        ...formData,
        name: club.name,
        category: club.category,
        grade: club.grade,
        activity: club.activity,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await clubsApi.create(formData);
      await loadClubs();
      setShowForm(false);
      setFormData({ name: "", category: "학술", grade: "", activity: "", role: "", period: "" });
      setSelectedSchoolClub(null);
    } catch (error) {
      console.error("동아리 추가 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await clubsApi.delete(id);
      await loadClubs();
    } catch (error) {
      console.error("동아리 삭제 실패:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "학술": return "bg-blue-100 text-blue-700";
      case "과학": return "bg-green-100 text-green-700";
      case "예술": return "bg-purple-100 text-purple-700";
      case "체육": return "bg-orange-100 text-orange-700";
      case "봉사": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // 학교 동아리 카테고리별 그룹화
  const groupedSchoolClubs = schoolClubs.reduce((acc, club) => {
    if (!acc[club.category]) acc[club.category] = [];
    acc[club.category].push(club);
    return acc;
  }, {} as Record<string, SchoolClub[]>);

  // 목표 학과에 대한 추천 동아리 찾기
  const goalRecommendations = goals.map(goal => ({
    goal,
    recommendation: findClubRecommendation(goal.major)
  })).filter(item => item.recommendation !== null);

  // 추천 동아리가 학교에 있는지 확인 + 우선순위 정렬 (높은 것 먼저)
  const findMatchingSchoolClubs = (recommendation: typeof MAJOR_CLUB_RECOMMENDATIONS[string]) => {
    const matched = schoolClubs.filter(club => {
      if (recommendation.recommendedCategories.includes(club.category)) return true;
      return recommendation.clubKeywords.some(keyword => 
        club.name.includes(keyword) || club.activity.includes(keyword)
      );
    });
    // 우선순위: 1) 추천 카테고리 매칭, 2) 키워드 매칭 수 많은 순, 3) 사용자가 가입한 동아리 우선
    return matched.sort((a, b) => {
      const catMatchA = recommendation.recommendedCategories.includes(a.category) ? 10 : 0;
      const catMatchB = recommendation.recommendedCategories.includes(b.category) ? 10 : 0;
      if (catMatchA !== catMatchB) return catMatchB - catMatchA;
      const kwCountA = recommendation.clubKeywords.filter(k => a.name.includes(k) || a.activity.includes(k)).length;
      const kwCountB = recommendation.clubKeywords.filter(k => b.name.includes(k) || b.activity.includes(k)).length;
      if (kwCountA !== kwCountB) return kwCountB - kwCountA;
      const joinedA = clubs.some(c => c.name === a.name) ? 1 : 0;
      const joinedB = clubs.some(c => c.name === b.name) ? 1 : 0;
      return joinedB - joinedA;
    });
  };

  // 내가 가입한 동아리가 추천에 맞는지 확인
  const isClubRecommended = (clubName: string, recommendation: typeof MAJOR_CLUB_RECOMMENDATIONS[string]) => {
    return recommendation.clubKeywords.some(keyword => clubName.includes(keyword)) ||
           recommendation.recommendedCategories.some(cat => 
             clubs.find(c => c.name === clubName)?.category === cat
           );
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        🎭 동아리 관리
      </h2>

      {/* 목표 학과별 추천 동아리 */}
      {goalRecommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Target size={20} className="text-primary-500" />
              내 목표 학과 맞춤 동아리 추천
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
              {goalRecommendations.map(({ goal, recommendation }) => {
                const matchingClubs = findMatchingSchoolClubs(recommendation!);
                
                return (
                  <div key={goal.id} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-5 border border-green-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">🎯</span>
                      <span className="font-bold text-gray-800">
                        {goal.university} {goal.major}
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                        {recommendation?.category}계열
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 flex items-start gap-2">
                      <Lightbulb size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      {recommendation?.description}
                    </p>

                    {/* 추천 카테고리 */}
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-purple-600 mb-2 flex items-center gap-1">
                        <Star size={14} className="fill-purple-500" />
                        추천 동아리 유형
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recommendation?.recommendedCategories.map((cat) => (
                          <span
                            key={cat}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(cat)}`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 학교에서 추천하는 동아리 (우선순위순, +N개 더 클릭 시 전체 표시) */}
                    {matchingClubs.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-1">
                          <Star size={14} className="fill-blue-500" />
                          우리 학교 추천 동아리 (우선순위순)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(expandedMatchingClubs[goal.id] ? matchingClubs : matchingClubs.slice(0, 8)).map((club) => {
                            const isJoined = clubs.some(c => c.name === club.name);
                            return (
                              <span
                                key={club.name}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  isJoined
                                    ? "bg-green-100 text-green-700 border-2 border-green-400"
                                    : "bg-white text-gray-700 border border-gray-200"
                                }`}
                              >
                                {isJoined && <CheckCircle2 size={12} className="inline mr-1" />}
                                {club.name}
                              </span>
                            );
                          })}
                          {matchingClubs.length > 8 && !expandedMatchingClubs[goal.id] && (
                            <button
                              type="button"
                              onClick={() => setExpandedMatchingClubs(prev => ({ ...prev, [goal.id]: true }))}
                              className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full font-medium transition-colors"
                            >
                              +{matchingClubs.length - 8}개 더 보기
                            </button>
                          )}
                          {matchingClubs.length > 8 && expandedMatchingClubs[goal.id] && (
                            <button
                              type="button"
                              onClick={() => setExpandedMatchingClubs(prev => ({ ...prev, [goal.id]: false }))}
                              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                            >
                              접기
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 활동 팁 */}
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-700 mb-2">💡 활동 TIP</p>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {recommendation?.tips.map((tip, idx) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 목표가 없을 때 안내 */}
      {goals.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-800 text-sm">
            💡 <strong>목표 대학을 먼저 설정하세요!</strong> 
            <br />목표 학과에 맞는 추천 동아리를 확인할 수 있습니다.
          </p>
        </div>
      )}

      {/* 학교 선택 안내 */}
      {!user?.school && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 text-sm">
            📋 <strong>프로필에서 학교를 먼저 선택해주세요.</strong> 
            <br />학교 선택 후 해당 학교의 동아리가 DB에서 불러와집니다.
          </p>
        </div>
      )}

      {/* 학교별 동아리 DB 안내 */}
      {user?.school && schoolClubs.length === 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-800 text-sm">
            📋 <strong>이 학교의 동아리 데이터가 아직 DB에 등록되지 않았습니다.</strong> 
            <br />직접 입력으로 동아리를 추가할 수 있으며, 추후 DB에 추가되면 학교 목록에서 선택할 수 있습니다.
          </p>
        </div>
      )}

      {/* 내 동아리 목록 */}
      <div className="space-y-4 mb-6">
        <h3 className="font-bold text-gray-700">내 동아리</h3>
        {clubs.map((club) => (
          <div key={club.id} className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(club.category)}`}>
                    {club.category}
                  </span>
                  {club.grade && (
                    <span className="text-xs text-gray-500">{club.grade}학년</span>
                  )}
                  {/* 추천 동아리 표시 */}
                  {goalRecommendations.some(({ recommendation }) => 
                    recommendation && isClubRecommended(club.name, recommendation)
                  ) && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> 목표에 적합
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg">{club.name}</h3>
                {club.role && <p className="text-sm text-primary-500">{club.role}</p>}
                {club.activity && <p className="text-sm text-gray-600">{club.activity}</p>}
                {club.period && <p className="text-xs text-gray-400">{club.period}</p>}
              </div>
              <button
                onClick={() => handleDelete(club.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {clubs.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            가입한 동아리가 없습니다.
          </p>
        )}
      </div>

      {/* 추가 폼 */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-4">
          {/* 입력 방식 선택 */}
          {schoolClubs.length > 0 && (
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={inputMethod === "select"}
                  onChange={() => setInputMethod("select")}
                />
                학교 동아리에서 선택
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={inputMethod === "manual"}
                  onChange={() => setInputMethod("manual")}
                />
                직접 입력
              </label>
            </div>
          )}

          {inputMethod === "select" && schoolClubs.length > 0 ? (
            <div>
              <label className="label">동아리 선택</label>
              <select
                className="input"
                value={selectedSchoolClub?.name || ""}
                onChange={(e) => handleSchoolClubSelect(e.target.value)}
              >
                <option value="">동아리 선택</option>
                {Object.entries(groupedSchoolClubs).map(([category, clubList]) => (
                  <optgroup key={category} label={category}>
                    {clubList.map((club) => (
                      <option key={club.name} value={club.name}>
                        {club.name} ({club.grade}학년)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {selectedSchoolClub && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p><strong>동아리명:</strong> {selectedSchoolClub.name}</p>
                  <p><strong>분류:</strong> {selectedSchoolClub.category}</p>
                  <p><strong>대상학년:</strong> {selectedSchoolClub.grade}학년</p>
                  <p><strong>활동개요:</strong> {selectedSchoolClub.activity}</p>
                  <p><strong>장소:</strong> {selectedSchoolClub.location}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">동아리명</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">분류</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="학술">학술</option>
                  <option value="과학">과학</option>
                  <option value="예술">예술</option>
                  <option value="체육">체육</option>
                  <option value="봉사">봉사</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="label">활동 개요</label>
                <input
                  type="text"
                  className="input"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">역할</label>
              <input
                type="text"
                className="input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="예: 부장, 부원"
              />
            </div>
            <div>
              <label className="label">활동 기간</label>
              <input
                type="text"
                className="input"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="예: 2025.03 ~ 2026.02"
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
            동아리 추가
          </button>
        </div>
      )}
    </div>
  );
}
