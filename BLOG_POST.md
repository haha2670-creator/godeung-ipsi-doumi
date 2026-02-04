# 🚀 Next.js 풀스택 프로젝트 배포 완료기 - 타입 오류부터 카카오톡 공유까지

> 고등학생 입시 관리 도구를 Railway + Vercel로 배포하며 겪은 시행착오와 해결 과정

## 📋 프로젝트 개요

**고등 입시 도우미** - 목표 대학 기반 맞춤 입시 관리 시스템
- 프론트엔드: Next.js 14 + TypeScript + Tailwind CSS
- 백엔드: Node.js + Express + TypeScript + Prisma
- 배포: Vercel (프론트엔드) + Railway (백엔드)

---

## 🐛 겪은 문제들과 해결 과정

### 1. TypeScript 타입 오류 해결

#### 문제 1: `finalGrade` 속성 누락
```typescript
// ❌ 오류 발생
Property 'finalGrade' does not exist on type 'Grade'.

// GradesTab.tsx:187
grade.finalGrade && grade.finalGrade <= 5
```

**원인:**
- 백엔드 Prisma 스키마에는 `finalGrade` 필드가 있었지만
- 프론트엔드 `Grade` 인터페이스에 누락됨

**해결:**
```typescript
// ✅ 해결
interface Grade {
  id: string;
  semester: string;
  subject: string;
  midterm?: number;
  final?: number;
  performance?: number;
  finalGrade?: number; // 추가!
  achievementGrade?: string;
  rawScore?: number;
  memo?: string;
}
```

**교훈:** 백엔드와 프론트엔드 타입을 항상 동기화해야 함

---

#### 문제 2: 암시적 `any` 타입 오류
```typescript
// ❌ 오류 발생
Parameter 'g' implicitly has an 'any' type.

// RoadmapTab.tsx:70
const goal = res.data.find((g) => g.id === goalId);
```

**해결:**
```typescript
// ✅ 해결
const goal = res.data.find((g: Goal) => g.id === goalId);
```

**교훈:** TypeScript의 엄격한 타입 체크는 개발 초기에 버그를 잡아줌

---

### 2. 빌드 성공까지의 여정

처음에는 여러 타입 오류로 빌드가 실패했지만, 하나씩 해결하며 성공!

```bash
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Collecting build traces
✓ Finalizing page optimization
```

**생성된 페이지:**
- `/` - 메인 페이지 (1.92 kB)
- `/dashboard` - 대시보드 (43.2 kB)
- `/login` - 로그인 (3.36 kB)
- `/register` - 회원가입 (3.19 kB)

---

### 3. Git 줄바꿈 문자 경고 해결

Windows 환경에서 Git이 줄바꿈 문자(LF/CRLF) 경고를 표시했습니다.

**해결: `.gitattributes` 파일 생성**
```gitattributes
# 소스 코드 파일은 LF 사용
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.json text eol=lf
*.css text eol=lf
*.md text eol=lf
```

**교훈:** 크로스 플랫폼 개발 시 `.gitattributes` 설정이 중요함

---

### 4. Railway 도메인 설정 문제

Railway 배포 후 `http://localhost:10000`만 보이는 문제가 있었습니다.

**문제:**
- Railway에서 공개 도메인을 생성하지 않아서 외부 접근 불가
- `localhost`는 내부 포트일 뿐

**해결:**
1. Railway Dashboard → Settings → Networking
2. **Generate Domain** 클릭
3. 생성된 도메인: `https://xxx.up.railway.app`

**서버 코드 개선:**
```typescript
// Railway 환경에서 실제 도메인 표시
const publicDomain = process.env.RAILWAY_PUBLIC_DOMAIN 
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : `http://localhost:${PORT}`;
```

---

### 5. 카카오톡 공유 이미지 설정

카카오톡으로 URL을 공유했을 때 이미지가 표시되도록 설정했습니다.

**작업 내용:**

1. **OG 이미지 생성** (1200x630px)
   - 입시 도우미 앱 디자인의 OG 이미지 생성
   - `public/og-image.png`에 저장

2. **메타데이터 설정**
```typescript
// layout.tsx
export const metadata: Metadata = {
  title: "🎓 고등 입시 도우미",
  description: "목표 대학 기반 맞춤 입시 로드맵...",
  openGraph: {
    title: "🎓 고등 입시 도우미",
    description: "...",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "고등 입시 도우미",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};
```

**결과:**
- 카카오톡 공유 시 이미지와 설명이 표시됨
- SNS 공유 시 더 전문적인 모습

---

## 🎯 배포 체크리스트

### 백엔드 (Railway)
- [x] Railway 프로젝트 생성
- [x] GitHub 저장소 연결
- [x] Root Directory: `backend` 설정
- [x] 환경 변수 설정
- [x] 도메인 생성
- [x] 데이터베이스 마이그레이션

### 프론트엔드 (Vercel)
- [x] Vercel 프로젝트 생성
- [x] GitHub 저장소 연결
- [x] Root Directory: `frontend` 설정
- [x] 환경 변수 설정 (`NEXT_PUBLIC_API_URL`)
- [x] 빌드 성공 확인
- [x] OG 이미지 설정

---

## 💰 비용 정리

### 무료로 운영 가능!
- **Vercel**: 완전 무료 (개인 프로젝트)
- **Railway**: 월 $5 크레딧 무료 (소규모 프로젝트 충분)
- **Supabase**: 무료 플랜 (500MB 저장공간)

**예상 월 비용: $0-3/월** (무료 크레딧 범위 내)

---

## 📚 배운 점

### 1. 타입 안정성의 중요성
- TypeScript의 엄격한 타입 체크가 런타임 오류를 예방
- 백엔드와 프론트엔드 타입 동기화 필수

### 2. 배포 전 로컬 빌드 테스트
- 배포 전에 반드시 `npm run build`로 테스트
- 타입 오류를 미리 발견하여 시간 절약

### 3. 환경 변수 관리
- `.env.local` (프론트엔드)와 `.env` (백엔드) 분리
- Vercel과 Railway에서 환경 변수 설정 중요

### 4. 크로스 플랫폼 개발
- `.gitattributes`로 줄바꿈 문자 통일
- Windows/Mac/Linux 모두에서 일관된 환경

### 5. SNS 공유 최적화
- OG 이미지 설정으로 공유 시 전문적인 모습
- 카카오톡, 페이스북, 트위터 등 다양한 플랫폼 지원

---

## 🚀 다음 단계

1. **사용자 피드백 수집**
   - 실제 사용자 테스트
   - 버그 리포트 수집

2. **성능 최적화**
   - 이미지 최적화
   - 코드 스플리팅
   - 캐싱 전략

3. **기능 추가**
   - 모바일 반응형 개선
   - 다크 모드
   - 알림 기능

---

## 🎉 결론

오늘 하루 동안:
- ✅ TypeScript 타입 오류 해결
- ✅ 빌드 성공
- ✅ Railway + Vercel 배포 완료
- ✅ 카카오톡 공유 이미지 설정
- ✅ Git 설정 최적화

처음에는 여러 오류로 고생했지만, 하나씩 해결하며 배포까지 완료했습니다! 

풀스택 프로젝트를 배포하는 과정에서 많은 것을 배웠고, 앞으로 더 나은 서비스를 만들 수 있을 것 같습니다. 🚀

---

## 📝 참고 자료

- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Railway 문서](https://docs.railway.app)
- [Vercel 문서](https://vercel.com/docs)
- [Open Graph 프로토콜](https://ogp.me/)

---

**작성일:** 2026년 2월 4일  
**프로젝트:** 고등 입시 도우미  
**기술 스택:** Next.js 14, TypeScript, Railway, Vercel
