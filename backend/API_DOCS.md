# 📡 API 문서

## Base URL
```
http://localhost:4000/api
```

---

## 🔐 인증

대부분의 API는 JWT 인증이 필요합니다.

### 헤더 형식
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 API 엔드포인트

### 1. 인증 (Auth)

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "홍길동",
  "grade": "고1",
  "school": "감일고등학교",
  "track": "자연"
}
```

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 프로필 조회 🔒
```http
GET /api/auth/profile
Authorization: Bearer TOKEN
```

#### 프로필 수정 🔒
```http
PUT /api/auth/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "홍길동",
  "grade": "고2",
  "school": "감일고등학교",
  "track": "자연"
}
```

---

### 2. AI 기능 🤖 🔒

#### AI 세특 생성
```http
POST /api/ai/setech
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "category": "세특",
  "title": "물리 실험 탐구",
  "content": "뉴턴의 운동 법칙을 실험을 통해 검증하고...",
  "subject": "물리학",
  "grade": "고2"
}
```

#### AI 자기소개서 작성
```http
POST /api/ai/personal-statement
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "prompt": "고등학교 재학 기간 중 학업에 기울인 노력과 학습 경험에 대해...",
  "activities": [
    "물리 동아리 활동",
    "과학 탐구 대회 수상",
    "독서 활동"
  ]
}
```

#### AI 면접 예상 질문
```http
POST /api/ai/interview-questions
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "university": "서울대학교",
  "major": "컴퓨터공학부",
  "activities": ["코딩 동아리", "앱 개발"]
}
```

#### AI 학습 계획 추천
```http
POST /api/ai/study-plan
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "grade": "고2",
  "targetUniversity": "연세대학교",
  "targetMajor": "경영학과",
  "currentGrades": []
}
```

#### 합격 가능성 분석
```http
POST /api/ai/admission-chance
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "targetUniversity": "고려대학교",
  "targetMajor": "전기전자공학부",
  "admissionType": "학생부종합",
  "studentProfile": {}
}
```

---

### 3. 성적 관리 (Grades) 🔒

#### 성적 목록 조회
```http
GET /api/grades
GET /api/grades?semester=고1-1
Authorization: Bearer TOKEN
```

#### 성적 추가
```http
POST /api/grades
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "semester": "고1-1",
  "subject": "수학",
  "midterm": 95,
  "final": 92,
  "writtenRatio": 70,
  "performance": 88,
  "performanceRatio": 30,
  "finalGrade": 1,
  "rawScore": 93,
  "memo": "등급컷 85점"
}
```

#### 평균 등급 조회
```http
GET /api/grades/average
GET /api/grades/average?semester=고1-1
Authorization: Bearer TOKEN
```

#### 성적 수정
```http
PUT /api/grades/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "finalGrade": 2
}
```

#### 성적 삭제
```http
DELETE /api/grades/:id
Authorization: Bearer TOKEN
```

---

### 4. 모의고사 (Mock Exams) 🔒

#### 모의고사 목록
```http
GET /api/mock-exams
Authorization: Bearer TOKEN
```

#### 모의고사 추가
```http
POST /api/mock-exams
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "date": "2026-03-01",
  "type": "3월 학평",
  "koreanScore": 88,
  "koreanGrade": 2,
  "mathScore": 92,
  "mathGrade": 1,
  "englishScore": 85,
  "englishGrade": 2
}
```

#### 성적 추이
```http
GET /api/mock-exams/trend
Authorization: Bearer TOKEN
```

---

### 5. 생기부 (Records) 🔒

#### 생기부 목록
```http
GET /api/records
GET /api/records?category=세특
Authorization: Bearer TOKEN
```

#### 생기부 추가
```http
POST /api/records
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "semester": "고2-1",
  "category": "세특",
  "title": "물리학 탐구",
  "content": "뉴턴의 운동 법칙을 심화 탐구하여..."
}
```

#### 카테고리별 통계
```http
GET /api/records/stats
Authorization: Bearer TOKEN
```

---

### 6. 목표 대학 (Goals) 🔒

#### 목표 목록
```http
GET /api/goals
Authorization: Bearer TOKEN
```

#### 목표 추가
```http
POST /api/goals
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "rank": 1,
  "university": "서울대학교",
  "major": "컴퓨터공학부",
  "admissionType": "학생부종합"
}
```

#### 입시 로드맵 생성
```http
GET /api/goals/:id/roadmap
Authorization: Bearer TOKEN
```

---

### 7. 일정 관리 (Schedules) 🔒

#### 일정 목록
```http
GET /api/schedules
GET /api/schedules?type=지필평가
GET /api/schedules?year=2026&month=3
Authorization: Bearer TOKEN
```

#### 일정 추가
```http
POST /api/schedules
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "type": "지필평가",
  "subject": "수학",
  "name": "중간고사",
  "date": "2026-05-15",
  "memo": "범위: 1~3단원"
}
```

#### 다가오는 일정 (D-Day)
```http
GET /api/schedules/upcoming
GET /api/schedules/upcoming?days=30
Authorization: Bearer TOKEN
```

---

### 8. 동아리 (Clubs) 🔒

#### 내 동아리 목록
```http
GET /api/clubs
Authorization: Bearer TOKEN
```

#### 동아리 추가
```http
POST /api/clubs
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "코더스",
  "category": "과학",
  "grade": "2,3",
  "activity": "코딩 및 앱 개발",
  "role": "부장",
  "period": "2025.03 ~ 2026.02"
}
```

#### 학교 동아리 목록 (인증 불필요)
```http
GET /api/clubs/school/감일고등학교
```

#### 동아리 활동 추가
```http
POST /api/clubs/activities
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "clubId": "club_id",
  "date": "2026-03-10",
  "content": "Python 기초 학습 및 실습"
}
```

---

### 9. 기초 데이터 (Data)

#### 학교 목록
```http
GET /api/data/schools
```

#### 학교 정보
```http
GET /api/data/schools/감일고등학교
```

#### 대학 목록
```http
GET /api/data/universities
```

#### 대학 정보
```http
GET /api/data/universities/서울대학교
```

#### 대학 학과 목록
```http
GET /api/data/universities/서울대학교/majors
```

---

## 🎯 응답 형식

### 성공
```json
{
  "id": "uuid",
  "data": "..."
}
```

### 오류
```json
{
  "error": "오류 메시지"
}
```

---

## 🔒 인증 필요 표시

- 🔒 = JWT 토큰 필요
- 표시 없음 = 인증 불필요
