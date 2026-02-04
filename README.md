# 🎓 고등 입시 도우미 (풀스택 버전)

> 목표 대학 기반 맞춤 입시 관리 시스템

## 📋 프로젝트 개요

고등학생의 입시 준비를 위한 종합 관리 플랫폼입니다.
성적 관리, 생기부 작성, AI 세특 생성, 입시 일정 관리 등 모든 기능을 제공합니다.

### 주요 기능

#### 🎯 코어 기능
- ✅ 회원가입/로그인 (JWT 인증)
- ✅ 프로필 관리 (학년, 학교, 희망 계열)
- ✅ 선택과목 관리 (감일고 등 학교별 데이터)
- ✅ 목표 대학/학과 설정 (1~5지망)
- ✅ 맞춤 입시 로드맵 생성

#### 📊 성적 관리
- ✅ 지필평가 (중간/기말) 점수 입력
- ✅ 수행평가 점수 입력
- ✅ 과목별 최종 등급 기록
- ✅ 모의고사 성적 관리 (원점수 + 등급)
- ✅ 내신 계산기
- ✅ 성적 추이 그래프

#### 📅 일정 관리
- ✅ 시험 일정 캘린더 (수행평가/지필/모의고사)
- ✅ 학원 스케줄 관리
- ✅ D-Day 자동 계산
- ✅ 푸시 알림 (시험 임박, 마감일 등)

#### 🎭 생기부 관리
- ✅ 동아리 활동 기록
- ✅ 세특/독서/수상/봉사 기록
- ✅ 카테고리별 분류
- ✅ 키워드 검색

#### 🤖 AI 기능
- ✅ AI 세특 초안 생성 (Gemini API)
- ✅ 자기소개서 작성 지원
- ✅ 면접 예상 질문 생성
- ✅ 학습 계획 추천
- ✅ 합격 가능성 예측

#### 📈 통계 & 분석
- ✅ 성적 추이 차트
- ✅ 과목별 분석
- ✅ 전국 평균 비교
- ✅ 목표 대학 합격선 비교
- ✅ 주간/월간 리포트

#### 👥 협업 & 공유
- ✅ 선생님 계정 (학생 모니터링)
- ✅ 학부모 계정 (자녀 성적 열람)
- ✅ 스터디 그룹

#### 🌐 커뮤니티
- ✅ Q&A 게시판
- ✅ 합격 후기
- ✅ 입시 정보 공유

---

## 🏗️ 프로젝트 구조

```
admission-toolkit-fullstack/
├── frontend/              # React + Next.js 14
│   ├── src/
│   │   ├── app/          # App Router
│   │   ├── components/   # 재사용 컴포넌트
│   │   ├── hooks/        # Custom Hooks
│   │   ├── lib/          # 유틸리티
│   │   └── types/        # TypeScript 타입
│   ├── public/           # 정적 파일
│   └── package.json
│
├── backend/              # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/  # API 컨트롤러
│   │   ├── services/     # 비즈니스 로직
│   │   ├── models/       # DB 모델 (Prisma)
│   │   ├── routes/       # API 라우트
│   │   ├── middleware/   # 인증, 로깅 등
│   │   ├── utils/        # 유틸리티
│   │   └── config/       # 설정
│   ├── prisma/           # DB 스키마
│   └── package.json
│
├── shared/               # 공통 타입/상수
│   └── types/
│
└── README.md
```

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **UI Components**: shadcn/ui

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **Validation**: Zod
- **Caching**: Redis
- **File Storage**: AWS S3 (또는 로컬)

### AI & External APIs
- **AI**: Google Gemini API
- **Push Notifications**: Firebase Cloud Messaging
- **Email**: SendGrid
- **SMS**: Twilio (선택)

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: 
  - Frontend: Vercel
  - Backend: AWS EC2 / Railway / Render
  - Database: Supabase / AWS RDS
- **Monitoring**: Sentry

---

## 📦 데이터베이스 스키마

### 주요 테이블

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String
  grade         String    // 고1, 고2, 고3
  school        String?
  schoolType    String?
  track         String?   // 자연, 인문, 예체능
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  goals         Goal[]
  grades        Grade[]
  schedules     Schedule[]
  clubs         Club[]
  records       Record[]
  mockExams     MockExam[]
}

model Goal {
  id            String    @id @default(uuid())
  userId        String
  rank          Int       // 1~5지망
  university    String
  major         String
  admissionType String    // 학종, 교과, 논술, 정시
  
  user          User      @relation(fields: [userId], references: [id])
}

model Grade {
  id              String   @id @default(uuid())
  userId          String
  semester        String   // 고1-1, 고1-2, ...
  subject         String
  midterm         Float?
  final           Float?
  performance     Float?
  finalGrade      Int?     // 1~9등급
  rawScore        Float?
  memo            String?
  
  user            User     @relation(fields: [userId], references: [id])
}

model MockExam {
  id              String   @id @default(uuid())
  userId          String
  date            DateTime
  type            String   // 3월 학평, 6월 평가원, ...
  koreanScore     Int?
  koreanGrade     Int
  mathScore       Int?
  mathGrade       Int
  englishScore    Int?
  englishGrade    Int
  
  user            User     @relation(fields: [userId], references: [id])
}

model Schedule {
  id              String   @id @default(uuid())
  userId          String
  type            String   // 수행평가, 지필평가, 모의고사
  subject         String
  name            String
  date            DateTime
  memo            String?
  
  user            User     @relation(fields: [userId], references: [id])
}

model Club {
  id              String   @id @default(uuid())
  userId          String
  name            String
  category        String
  role            String?
  period          String?
  activities      ClubActivity[]
  
  user            User     @relation(fields: [userId], references: [id])
}

model ClubActivity {
  id              String   @id @default(uuid())
  clubId          String
  date            DateTime
  content         String
  
  club            Club     @relation(fields: [clubId], references: [id])
}

model Record {
  id              String   @id @default(uuid())
  userId          String
  semester        String
  category        String   // 세특, 독서, 수상, 봉사, 동아리
  title           String
  content         String
  
  user            User     @relation(fields: [userId], references: [id])
}
```

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 20+
- PostgreSQL 15+
- Redis (선택)
- Gemini API Key

### 설치

```bash
# 저장소 클론
git clone [repository-url]
cd admission-toolkit-fullstack

# 백엔드 설치
cd backend
npm install
cp .env.example .env  # 환경변수 설정

# DB 마이그레이션
npx prisma migrate dev
npx prisma generate

# 백엔드 실행
npm run dev

# 프론트엔드 설치 (새 터미널)
cd ../frontend
npm install
cp .env.example .env.local  # 환경변수 설정

# 프론트엔드 실행
npm run dev
```

### 환경 변수

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/admission_toolkit"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## 📝 API 엔드포인트

### 인증
```
POST   /api/auth/register       # 회원가입
POST   /api/auth/login          # 로그인
POST   /api/auth/refresh        # 토큰 갱신
GET    /api/auth/me             # 내 정보
```

### 프로필
```
GET    /api/profile             # 프로필 조회
PUT    /api/profile             # 프로필 수정
```

### 목표 대학
```
GET    /api/goals               # 목표 목록
POST   /api/goals               # 목표 추가
PUT    /api/goals/:id           # 목표 수정
DELETE /api/goals/:id           # 목표 삭제
```

### 성적
```
GET    /api/grades              # 성적 목록
POST   /api/grades              # 성적 추가
PUT    /api/grades/:id          # 성적 수정
DELETE /api/grades/:id          # 성적 삭제
GET    /api/grades/stats        # 성적 통계
```

### 모의고사
```
GET    /api/mock-exams          # 모의고사 목록
POST   /api/mock-exams          # 모의고사 추가
GET    /api/mock-exams/chart    # 성적 추이
```

### 일정
```
GET    /api/schedules           # 일정 목록
POST   /api/schedules           # 일정 추가
GET    /api/schedules/calendar  # 캘린더 뷰
```

### 생기부
```
GET    /api/records             # 생기부 목록
POST   /api/records             # 생기부 추가
POST   /api/records/ai-generate # AI 세특 생성
```

### AI
```
POST   /api/ai/setech           # 세특 생성
POST   /api/ai/essay            # 자소서 생성
POST   /api/ai/interview        # 면접 질문 생성
POST   /api/ai/study-plan       # 학습 계획 생성
```

---

## 🎯 개발 로드맵

### Phase 1: MVP (4주)
- [x] 프로젝트 초기 설정
- [ ] 회원가입/로그인
- [ ] 프로필 관리
- [ ] 성적 관리 (지필/수행/등급)
- [ ] 모의고사 관리
- [ ] 생기부 기록
- [ ] AI 세특 생성 (Gemini API)

### Phase 2: 고급 기능 (4주)
- [ ] 일정 관리 (캘린더)
- [ ] 푸시 알림
- [ ] 통계 대시보드
- [ ] 로드맵 생성
- [ ] 파일 업로드
- [ ] 데이터 백업/복원

### Phase 3: 확장 기능 (4주)
- [ ] 선생님/학부모 계정
- [ ] 커뮤니티 (Q&A)
- [ ] 입시 정보 크롤링
- [ ] OCR (성적표 인식)
- [ ] 모바일 앱 (PWA)

### Phase 4: 출시 준비 (2주)
- [ ] 성능 최적화
- [ ] 보안 강화
- [ ] 테스트 자동화
- [ ] 배포 자동화
- [ ] 모니터링 설정

---

## 📊 버전 히스토리

### v1.0 (2026-02-04) - HTML 단일 파일
- 기본 UI 및 localStorage 기반
- 모든 기능 프론트엔드에서 처리
- **백업 완료**: `C:\Users\haha2\admission-toolkit-backup\index_v1_backup.html`

### v2.0 (진행 중) - 풀스택 전환
- 백엔드 API 서버 구축
- 데이터베이스 연동
- 실제 AI 기능 통합
- 회원 시스템 구현

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 📞 문의

프로젝트 관련 문의: [이메일 주소]

---

## 🙏 감사의 말

- 감일고등학교 동아리 정보 제공
- Google Gemini API
- shadcn/ui 컴포넌트 라이브러리
