"use client";

import { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  PenTool, 
  Target, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Clock,
  FileText,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";

type AdmissionType = "comprehensive" | "grade" | "essay" | "regular";

interface TypeInfo {
  id: AdmissionType;
  name: string;
  fullName: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  ratio: string;
  evaluationItems: { name: string; weight: string }[];
  pros: string[];
  cons: string[];
  suitableFor: string[];
  timeline: { period: string; task: string }[];
  tips: string[];
  universities: string[];
}

const admissionTypes: TypeInfo[] = [
  {
    id: "comprehensive",
    name: "학생부종합",
    fullName: "학생부종합전형 (학종)",
    icon: <Users size={24} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "학생부(생활기록부)를 중심으로 학생의 학업역량, 진로역량, 공동체역량 등을 종합적으로 평가하는 전형입니다. 단순 성적보다 학생의 성장과정과 잠재력을 중시합니다.",
    ratio: "서울 주요대 기준 약 40~50%",
    evaluationItems: [
      { name: "학업역량", weight: "30~40%" },
      { name: "진로역량", weight: "25~35%" },
      { name: "공동체역량", weight: "20~30%" },
      { name: "자기소개서 (폐지 대학 多)", weight: "참고자료" },
      { name: "면접", weight: "20~40% (실시 시)" },
    ],
    pros: [
      "내신 등급이 다소 낮아도 활동으로 만회 가능",
      "자신만의 스토리와 강점을 어필할 수 있음",
      "수능 최저학력기준 없거나 낮은 경우 多",
      "다양한 경험과 역량을 인정받을 수 있음",
    ],
    cons: [
      "평가 기준이 모호해 예측이 어려움",
      "생기부 관리에 3년간 꾸준한 노력 필요",
      "면접 준비에 추가 시간 소요",
      "학교별로 생기부 작성 퀄리티 차이 존재",
    ],
    suitableFor: [
      "명확한 진로 목표가 있는 학생",
      "교내 활동에 적극적으로 참여하는 학생",
      "자기 주도적 학습 경험이 풍부한 학생",
      "내신은 2~3등급이지만 특별한 활동 이력이 있는 학생",
    ],
    timeline: [
      { period: "고1 3월~", task: "진로 탐색, 교내 활동 시작" },
      { period: "고1~2", task: "동아리, 독서, 세특 관리" },
      { period: "고3 6월", task: "자기소개서 작성 시작 (해당 시)" },
      { period: "고3 9월", task: "원서 접수 (수시)" },
      { period: "고3 10~11월", task: "면접 준비 및 실시" },
      { period: "고3 12월", task: "합격자 발표" },
    ],
    tips: [
      "세특에 '탐구 과정'을 구체적으로 기록하세요",
      "진로와 연계된 활동의 일관성이 중요합니다",
      "양보다 질! 깊이 있는 활동 2~3개가 효과적",
      "면접에서 생기부 내용을 완벽히 숙지하세요",
      "학교생활 충실도를 보여주는 것이 핵심입니다",
    ],
    universities: ["서울대 일반전형", "연세대 활동우수형", "고려대 학업우수형", "성균관대 계열모집", "한양대 일반"],
  },
  {
    id: "grade",
    name: "학생부교과",
    fullName: "학생부교과전형 (교과)",
    icon: <BookOpen size={24} />,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "교과 성적(내신)을 주요 평가 요소로 하는 전형입니다. 정량적 평가 비중이 높아 결과 예측이 비교적 용이하며, 수능 최저학력기준을 적용하는 경우가 많습니다.",
    ratio: "서울 주요대 기준 약 20~30%",
    evaluationItems: [
      { name: "교과 성적 (내신)", weight: "70~100%" },
      { name: "출결/봉사 등", weight: "0~10%" },
      { name: "수능 최저학력기준", weight: "충족 여부" },
      { name: "면접 (일부 대학)", weight: "10~30%" },
    ],
    pros: [
      "평가 기준이 명확하고 예측 가능",
      "생기부 활동 부담이 상대적으로 적음",
      "내신 성적이 우수하면 높은 합격 확률",
      "지역인재전형 등 다양한 기회 존재",
    ],
    cons: [
      "내신 경쟁이 매우 치열함",
      "학교별 내신 유불리 존재 (고교 프로필)",
      "수능 최저 충족이 관건인 경우 多",
      "1~2등급 초반의 높은 내신 필요",
    ],
    suitableFor: [
      "내신 1~2등급대의 우수한 학생",
      "정량적 평가를 선호하는 학생",
      "수능 최저학력기준 충족이 가능한 학생",
      "활동보다 학업에 집중하고 싶은 학생",
    ],
    timeline: [
      { period: "고1 3월~", task: "내신 관리 시작 (첫 시험부터 중요)" },
      { period: "고1~3", task: "매 학기 내신 성적 관리" },
      { period: "고3 6월", task: "지원 대학 리스트업" },
      { period: "고3 9월", task: "원서 접수 (수시)" },
      { period: "고3 11월", task: "수능 (최저 충족용)" },
      { period: "고3 12월", task: "합격자 발표" },
    ],
    tips: [
      "1학년 1학기 성적이 매우 중요합니다",
      "반영 과목과 가중치를 미리 파악하세요",
      "수능 최저가 있는 대학은 수능 준비 병행 필수",
      "학교 내신 변별력을 파악해 전략적으로 지원하세요",
      "지역인재전형, 고른기회전형 등 특별전형도 확인하세요",
    ],
    universities: ["연세대 추천형", "고려대 학교추천", "서강대 학교장추천", "이화여대 고교추천", "중앙대 학교장추천"],
  },
  {
    id: "essay",
    name: "논술",
    fullName: "논술전형",
    icon: <PenTool size={24} />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "대학별 논술고사 성적으로 선발하는 전형입니다. 내신과 생기부의 영향이 적어 '역전의 기회'로 불리지만, 경쟁률이 매우 높고 수능 최저학력기준을 적용하는 경우가 많습니다.",
    ratio: "서울 주요대 기준 약 10~15%",
    evaluationItems: [
      { name: "논술고사", weight: "60~80%" },
      { name: "학생부(교과/비교과)", weight: "20~40%" },
      { name: "수능 최저학력기준", weight: "충족 여부 (중요)" },
    ],
    pros: [
      "내신 불리함을 논술 실력으로 극복 가능",
      "생기부 활동의 영향이 적음",
      "단기간 준비로 성과를 낼 수 있음",
      "사고력과 논리력이 뛰어난 학생에게 유리",
    ],
    cons: [
      "경쟁률이 매우 높음 (30:1 이상)",
      "수능 최저학력기준이 높은 편",
      "대학별 출제 경향이 달라 복수 준비 부담",
      "실시 대학 수가 점점 줄어드는 추세",
    ],
    suitableFor: [
      "내신은 3~4등급이지만 수능/사고력이 우수한 학생",
      "글쓰기와 논리적 사고에 자신 있는 학생",
      "수능 최저학력기준 충족이 가능한 학생",
      "짧은 시간 내 집중력이 좋은 학생",
    ],
    timeline: [
      { period: "고2 겨울~", task: "논술 기초 학습 시작" },
      { period: "고3 3월~", task: "대학별 기출문제 분석" },
      { period: "고3 6월~", task: "실전 논술 연습" },
      { period: "고3 9월", task: "원서 접수 (수시)" },
      { period: "고3 10~11월", task: "논술고사 응시" },
      { period: "고3 11월", task: "수능 (최저 충족용)" },
    ],
    tips: [
      "지원 대학의 기출문제를 반드시 풀어보세요",
      "수능 최저 충족이 당락을 결정합니다",
      "2~3개 대학으로 좁혀서 집중 준비하세요",
      "시간 배분 연습이 매우 중요합니다",
      "인문계: 언어논술 / 자연계: 수리논술 집중",
    ],
    universities: ["연세대", "성균관대", "한양대(에리카)", "이화여대", "경희대", "중앙대", "한국외대"],
  },
  {
    id: "regular",
    name: "정시",
    fullName: "정시전형 (수능위주)",
    icon: <Target size={24} />,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "대학수학능력시험(수능) 성적을 중심으로 선발하는 전형입니다. 가장 객관적이고 공정한 평가 방식으로, 수능 성적에 따라 지원 가능 대학이 결정됩니다.",
    ratio: "서울 주요대 기준 약 30~40%",
    evaluationItems: [
      { name: "수능 성적", weight: "80~100%" },
      { name: "학생부", weight: "0~20%" },
      { name: "면접 (일부 학과)", weight: "일부 반영" },
    ],
    pros: [
      "가장 객관적이고 공정한 평가",
      "수능 한 번으로 당락 결정 (명확한 기준)",
      "내신, 생기부 영향 거의 없음",
      "수시 실패 후 재도전 기회",
    ],
    cons: [
      "수능 당일 컨디션의 영향이 큼",
      "재수생과의 경쟁",
      "단 한 번의 시험으로 결과 결정",
      "과목별 유불리에 따른 전략 필요",
    ],
    suitableFor: [
      "수능 모의고사 성적이 우수한 학생",
      "시험 당일 실력 발휘에 강한 학생",
      "내신보다 수능 성적이 좋은 학생",
      "객관적 평가를 선호하는 학생",
    ],
    timeline: [
      { period: "고1~2", task: "수능 기초 실력 다지기" },
      { period: "고3 3월~", task: "본격적인 수능 대비" },
      { period: "고3 6월", task: "6월 모의평가" },
      { period: "고3 9월", task: "9월 모의평가" },
      { period: "고3 11월", task: "대학수학능력시험" },
      { period: "고3 12월", task: "정시 원서 접수 (가/나/다)" },
      { period: "고4 1~2월", task: "면접(해당 시) 및 합격자 발표" },
    ],
    tips: [
      "모의고사 분석으로 취약점을 파악하세요",
      "수능 특강/완성 교재를 철저히 학습하세요",
      "영역별 반영비율을 고려해 전략적으로 준비하세요",
      "가/나/다 군별 지원 전략을 세우세요",
      "수능 당일 컨디션 관리가 매우 중요합니다",
    ],
    universities: ["서울대 일반전형", "연세대/고려대 일반전형", "서강대/성균관대/한양대", "이화여대/중앙대/경희대"],
  },
];

export function AdmissionTypesTab() {
  const [selectedType, setSelectedType] = useState<AdmissionType>("comprehensive");
  const typeInfo = admissionTypes.find((t) => t.id === selectedType)!;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        📋 전형별 상세 안내
      </h2>

      {/* 전형 선택 버튼 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {admissionTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedType === type.id
                ? `${type.bgColor} border-current ${type.color}`
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className={selectedType === type.id ? type.color : "text-gray-400"}>
              {type.icon}
            </span>
            <span className={`font-bold ${selectedType === type.id ? type.color : "text-gray-600"}`}>
              {type.name}
            </span>
          </button>
        ))}
      </div>

      {/* 선택된 전형 상세 정보 */}
      <div className={`p-6 rounded-2xl ${typeInfo.bgColor}`}>
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-4">
          <span className={typeInfo.color}>{typeInfo.icon}</span>
          <h3 className={`text-xl font-bold ${typeInfo.color}`}>{typeInfo.fullName}</h3>
        </div>
        <p className="text-gray-700 mb-4">{typeInfo.description}</p>
        <div className={`inline-block px-4 py-2 rounded-full ${typeInfo.color} bg-white font-medium mb-6`}>
          📊 선발 비율: {typeInfo.ratio}
        </div>

        {/* 평가 요소 */}
        <div className="bg-white rounded-xl p-5 mb-6">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp size={18} /> 평가 요소 및 반영 비율
          </h4>
          <div className="space-y-2">
            {typeInfo.evaluationItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{item.name}</span>
                <span className={`font-bold ${typeInfo.color}`}>{item.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 장단점 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5">
            <h4 className="font-bold text-green-600 mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} /> 장점
            </h4>
            <ul className="space-y-2">
              {typeInfo.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-5">
            <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2">
              <XCircle size={18} /> 단점
            </h4>
            <ul className="space-y-2">
              {typeInfo.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-red-500 mt-1">✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 이런 학생에게 추천 */}
        <div className="bg-white rounded-xl p-5 mb-6">
          <h4 className="font-bold text-purple-600 mb-3 flex items-center gap-2">
            <Users size={18} /> 이런 학생에게 추천!
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {typeInfo.suitableFor.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="text-purple-500">👉</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 준비 타임라인 */}
        <div className="bg-white rounded-xl p-5 mb-6">
          <h4 className="font-bold text-orange-600 mb-3 flex items-center gap-2">
            <Calendar size={18} /> 준비 타임라인
          </h4>
          <div className="relative">
            {typeInfo.timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${typeInfo.bgColor} border-2 ${typeInfo.color.replace('text-', 'border-')}`}></div>
                  {idx < typeInfo.timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200"></div>}
                </div>
                <div className="flex-1 pb-2">
                  <span className={`font-bold ${typeInfo.color}`}>{item.period}</span>
                  <p className="text-gray-600">{item.task}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 핵심 TIP */}
        <div className="bg-yellow-50 rounded-xl p-5 mb-6 border border-yellow-200">
          <h4 className="font-bold text-yellow-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> 핵심 TIP
          </h4>
          <ul className="space-y-2">
            {typeInfo.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="text-yellow-500">💡</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 주요 대학 */}
        <div className="bg-white rounded-xl p-5">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <GraduationCap size={18} /> 주요 대학 전형명 예시
          </h4>
          <div className="flex flex-wrap gap-2">
            {typeInfo.universities.map((uni, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm ${typeInfo.bgColor} ${typeInfo.color}`}
              >
                {uni}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 전형 비교표 */}
      <div className="mt-8 overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📊 전형 한눈에 비교</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">구분</th>
              <th className="p-3 text-center text-blue-600">학종</th>
              <th className="p-3 text-center text-green-600">교과</th>
              <th className="p-3 text-center text-purple-600">논술</th>
              <th className="p-3 text-center text-red-600">정시</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-medium">핵심 평가 요소</td>
              <td className="p-3 text-center">생기부 활동</td>
              <td className="p-3 text-center">내신 성적</td>
              <td className="p-3 text-center">논술고사</td>
              <td className="p-3 text-center">수능 성적</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">내신 중요도</td>
              <td className="p-3 text-center">⭐⭐⭐</td>
              <td className="p-3 text-center">⭐⭐⭐⭐⭐</td>
              <td className="p-3 text-center">⭐⭐</td>
              <td className="p-3 text-center">⭐</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">생기부 중요도</td>
              <td className="p-3 text-center">⭐⭐⭐⭐⭐</td>
              <td className="p-3 text-center">⭐⭐</td>
              <td className="p-3 text-center">⭐</td>
              <td className="p-3 text-center">⭐</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">수능 중요도</td>
              <td className="p-3 text-center">⭐⭐(최저)</td>
              <td className="p-3 text-center">⭐⭐⭐(최저)</td>
              <td className="p-3 text-center">⭐⭐⭐(최저)</td>
              <td className="p-3 text-center">⭐⭐⭐⭐⭐</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">결과 예측</td>
              <td className="p-3 text-center">어려움</td>
              <td className="p-3 text-center">쉬움</td>
              <td className="p-3 text-center">보통</td>
              <td className="p-3 text-center">매우 쉬움</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">경쟁률</td>
              <td className="p-3 text-center">10~20:1</td>
              <td className="p-3 text-center">5~15:1</td>
              <td className="p-3 text-center">30~100:1</td>
              <td className="p-3 text-center">3~10:1</td>
            </tr>
            <tr>
              <td className="p-3 font-medium">준비 기간</td>
              <td className="p-3 text-center">3년</td>
              <td className="p-3 text-center">3년</td>
              <td className="p-3 text-center">6개월~1년</td>
              <td className="p-3 text-center">1~2년</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
