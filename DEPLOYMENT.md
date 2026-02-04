# 🚀 배포 가이드

외부에서 접근 가능하도록 프로젝트를 배포하는 방법입니다.

## 📋 배포 전 준비사항

### ⚠️ 중요: 먼저 GitHub에 소스를 올려야 합니다!

**1단계: GitHub 저장소 설정**
- `GIT_SETUP.md` 파일을 참고하여 GitHub에 소스를 먼저 올리세요.
- 저장소 이름 추천: `admission-helper`

**2단계: 환경 변수 확인**
- 백엔드 `.env` 파일의 모든 값이 설정되어 있는지 확인
- 프론트엔드 `.env.local` 파일 확인

---

## 🔧 백엔드 배포 옵션

> **💡 추천: Railway** - 가장 빠르고 무료 플랜이 좋습니다!

### 옵션 1: Railway (추천 ⚡ 빠름, 무료 플랜)

#### 1. Railway 가입 및 프로젝트 생성
1. [Railway](https://railway.app) 가입 (GitHub 연동)
2. **New Project** → **Deploy from GitHub repo** 선택
3. 저장소 선택

#### 2. Railway 설정
- **Root Directory**: `backend` 설정
- **Build Command**: 자동 감지 (또는 수동 설정)
- **Start Command**: `npm start`

#### 3. 환경 변수 설정 (Railway Dashboard)
**Variables** 탭에서 다음 변수 추가:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres.ezsigwasajrhbsuvxxbx:[비밀번호]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=[본인이_설정한_비밀키]
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=[Gemini_API_키]
DATA_GO_KR_SERVICE_KEY=[공공데이터_서비스키]
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### 4. 데이터베이스 마이그레이션
Railway 배포 후, **Deployments** → **View Logs** → **Shell**에서:
```bash
npx prisma migrate deploy
npx prisma db seed
```

#### 5. 백엔드 URL 확인
배포 완료 후 **Settings** → **Generate Domain** 클릭
(예: `https://admission-toolkit-backend-production.up.railway.app`)

**Railway 장점:**
- ⚡ 빠른 응답 속도 (슬립 모드 없음)
- 💰 무료 플랜 제공 ($5 크레딧/월)
- 🚀 자동 배포 (GitHub push 시)

---

### 옵션 2: Fly.io (빠름, 무료 플랜)

#### 1. Fly.io 가입 및 설치
```bash
# Fly.io CLI 설치
curl -L https://fly.io/install.sh | sh

# 로그인
fly auth login
```

#### 2. Fly.io 프로젝트 초기화
```bash
cd backend
fly launch
```

#### 3. `fly.toml` 생성 후 설정
```toml
app = "admission-toolkit-backend"
primary_region = "icn"  # 서울 리전

[build]

[env]
  NODE_ENV = "production"
  PORT = "8080"

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
```

#### 4. 환경 변수 설정
```bash
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set JWT_SECRET="..."
fly secrets set GEMINI_API_KEY="..."
fly secrets set DATA_GO_KR_SERVICE_KEY="..."
fly secrets set CORS_ORIGIN="https://your-frontend.vercel.app"
```

#### 5. 배포
```bash
fly deploy
```

---

### 옵션 3: Render (느림, 무료 플랜)

#### 1. Render 가입 및 프로젝트 생성
1. [Render](https://render.com) 가입
2. **New** → **Web Service** 선택
3. GitHub 저장소 연결

#### 2. Render 설정
- **Name**: `admission-toolkit-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build && npx prisma generate`
- **Start Command**: `npm start`

#### 3. 환경 변수 설정
**Environment Variables** 섹션에 변수 추가 (Railway와 동일)

#### 4. 데이터베이스 마이그레이션
**Shell** 탭에서:
```bash
npx prisma migrate deploy
npx prisma db seed
```

**Render 단점:**
- 🐌 느린 응답 (15분 비활성 시 슬립 모드)
- 첫 요청 시 30초~1분 대기

---

## 🎨 프론트엔드 배포 (Vercel)

### 1. Vercel 가입 및 프로젝트 생성
1. [Vercel](https://vercel.com) 가입
2. **Add New Project** → GitHub 저장소 선택
3. 프로젝트 설정

### 2. Vercel 설정
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (자동 감지)
- **Output Directory**: `.next` (자동 감지)

### 3. 환경 변수 설정 (Vercel Dashboard)
**Environment Variables** 섹션에 추가:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### 4. 배포
- **Deploy** 클릭
- 배포 완료 후 URL 확인 (예: `https://admission-toolkit.vercel.app`)

---

## 🔄 배포 후 확인사항

### 1. 백엔드 확인
```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# 응답 예시:
# {"status":"OK","message":"서버가 정상 작동 중입니다."}
```

### 2. 프론트엔드 확인
- 브라우저에서 프론트엔드 URL 접속
- 로그인/회원가입 테스트
- API 호출이 정상 작동하는지 확인

### 3. CORS 설정 확인
- 백엔드 `CORS_ORIGIN`이 프론트엔드 URL과 일치하는지 확인
- 브라우저 콘솔에서 CORS 에러가 없는지 확인

---

## 📝 추가 설정

### 배포 옵션 비교

| 플랫폼 | 속도 | 무료 플랜 | 슬립 모드 | 추천도 |
|--------|------|-----------|-----------|--------|
| **Railway** | ⚡⚡⚡ 매우 빠름 | $5 크레딧/월 | 없음 | ⭐⭐⭐⭐⭐ |
| **Fly.io** | ⚡⚡⚡ 빠름 | 3개 앱 무료 | 없음 | ⭐⭐⭐⭐ |
| **Render** | 🐌 느림 | 무료 | 15분 후 슬립 | ⭐⭐ |

**Railway 추천 이유:**
- ⚡ 슬립 모드 없어 항상 빠른 응답
- 💰 무료 크레딧으로 시작 가능
- 🚀 GitHub 연동 자동 배포
- 📊 실시간 로그 확인 가능

### 데이터베이스 (Supabase)
- 이미 Supabase를 사용 중이므로 추가 설정 불필요
- `DATABASE_URL`만 Render 환경 변수에 설정하면 됨

### 도메인 연결 (선택)
- Render: **Settings** → **Custom Domain**
- Vercel: **Settings** → **Domains**

---

## 🐛 문제 해결

### 백엔드 배포 실패
- **Build Command 오류**: `npm run build` 대신 `npm install && npx prisma generate` 시도
- **TypeScript 오류**: `tsconfig.json`의 `noImplicitReturns: false` 확인
- **Prisma 오류**: `npx prisma generate`가 Build Command에 포함되어 있는지 확인

### 프론트엔드 배포 실패
- **API URL 오류**: `.env.local`의 `NEXT_PUBLIC_API_URL` 확인
- **빌드 오류**: `npm run build` 로컬에서 먼저 테스트

### CORS 에러
- 백엔드 `CORS_ORIGIN`에 프론트엔드 URL이 정확히 입력되어 있는지 확인
- `http://` vs `https://` 확인

### 데이터베이스 연결 실패
- Supabase **Connection Pooling** 사용 중인지 확인
- `DATABASE_URL`에 `?pgbouncer=true` 추가 (필요 시)

---

## 📚 참고 자료

- [Render 공식 문서](https://render.com/docs)
- [Vercel 공식 문서](https://vercel.com/docs)
- [Supabase 연결 가이드](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

## ✅ 체크리스트

배포 전 확인:
- [ ] GitHub 저장소에 코드 푸시 완료
- [ ] 백엔드 `.env` 모든 값 설정 완료
- [ ] 프론트엔드 `.env.local` 설정 완료
- [ ] Render에 백엔드 배포 완료
- [ ] Vercel에 프론트엔드 배포 완료
- [ ] 환경 변수 모두 설정 완료
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 로그인/회원가입 테스트 완료
- [ ] API 호출 테스트 완료

배포 완료! 🎉
