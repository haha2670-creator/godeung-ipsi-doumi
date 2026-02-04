# 🚀 Vercel 배포 설정 가이드

## 📋 Vercel 배포 전 체크리스트

### 1. GitHub 저장소 준비
- [ ] 프로젝트가 GitHub에 푸시되어 있는지 확인
- [ ] 저장소가 Public 또는 Vercel 계정에 연결되어 있는지 확인

### 2. 환경 변수 준비
- [ ] 백엔드 API URL 확인 (예: `https://your-backend.railway.app`)
- [ ] 필요한 환경 변수 목록 확인

---

## 🔧 Vercel 배포 단계

### 1단계: Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. **Add New Project** 클릭
3. GitHub 저장소 선택 (`admission-toolkit-fullstack`)
4. 프로젝트 설정:

   ```
   Framework Preset: Next.js (자동 감지)
   Root Directory: frontend
   Build Command: npm run build (자동 감지)
   Output Directory: .next (자동 감지)
   Install Command: npm install (자동 감지)
   ```

### 2단계: 환경 변수 설정

**Settings** → **Environment Variables**에서 다음 변수 추가:

#### Production 환경 변수
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

#### Preview 환경 변수 (선택)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

#### Development 환경 변수 (선택)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**⚠️ 중요:**
- `NEXT_PUBLIC_` 접두사가 붙은 변수만 클라이언트에서 접근 가능합니다
- 백엔드 URL은 실제 배포된 백엔드 주소로 변경해야 합니다
- Railway, Render, Fly.io 등 백엔드 호스팅 플랫폼의 URL을 사용하세요

### 3단계: 배포 설정 확인

**Settings** → **General**에서 확인:

- **Root Directory**: `frontend` (또는 비워두고 Vercel이 자동 감지)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4단계: 배포 실행

1. **Deploy** 버튼 클릭
2. 배포 로그 확인
3. 배포 완료 후 URL 확인 (예: `https://admission-toolkit.vercel.app`)

---

## 📝 Vercel 설정 파일 설명

### `vercel.json` (프로젝트 루트)
- 전체 프로젝트에 대한 Vercel 설정
- 프론트엔드 디렉토리 지정 및 빌드 명령어 설정

### `frontend/vercel.json` (프론트엔드 디렉토리)
- 프론트엔드 전용 Vercel 설정
- Next.js 프레임워크 자동 감지
- 보안 헤더 설정 포함

---

## 🔍 배포 후 확인사항

### 1. 빌드 로그 확인
- Vercel Dashboard → **Deployments** → 최신 배포 클릭
- 빌드 로그에서 오류 확인

### 2. 런타임 로그 확인
- **Functions** 탭에서 API 라우트 로그 확인
- 에러가 있으면 로그에서 확인 가능

### 3. 프론트엔드 동작 확인
- 배포된 URL 접속
- 브라우저 콘솔에서 에러 확인
- 네트워크 탭에서 API 호출 확인

### 4. CORS 설정 확인
- 백엔드의 `CORS_ORIGIN`에 Vercel URL이 포함되어 있는지 확인
- 예: `CORS_ORIGIN=https://admission-toolkit.vercel.app`

---

## 🐛 문제 해결

### 빌드 실패
**증상**: Build failed 오류

**해결 방법**:
1. 로컬에서 빌드 테스트:
   ```bash
   cd frontend
   npm run build
   ```
2. `package.json`의 빌드 스크립트 확인
3. TypeScript 오류 확인
4. 의존성 설치 오류 확인

### 환경 변수 오류
**증상**: API 호출 실패, `undefined` 값

**해결 방법**:
1. Vercel Dashboard → **Settings** → **Environment Variables** 확인
2. `NEXT_PUBLIC_` 접두사 확인
3. 변수 이름 대소문자 확인
4. 배포 후 재배포 필요 (환경 변수 변경 시)

### API 연결 실패
**증상**: CORS 에러 또는 404 에러

**해결 방법**:
1. 백엔드 URL이 올바른지 확인
2. 백엔드가 실행 중인지 확인
3. 백엔드 CORS 설정 확인
4. `next.config.js`의 rewrites 설정 확인

### 페이지 404 오류
**증상**: 특정 페이지 접속 시 404

**해결 방법**:
1. Next.js App Router 구조 확인
2. `src/app` 디렉토리 구조 확인
3. 파일명이 `page.tsx`인지 확인
4. 동적 라우트 설정 확인

---

## 🔄 자동 배포 설정

### GitHub 연동
- Vercel은 기본적으로 GitHub push 시 자동 배포됩니다
- `main` 브랜치에 push하면 Production 배포
- 다른 브랜치에 push하면 Preview 배포

### 배포 브랜치 설정
**Settings** → **Git** → **Production Branch**: `main` (기본값)

### Preview 배포
- Pull Request 생성 시 자동으로 Preview URL 생성
- Preview URL에서 테스트 후 Merge

---

## 📊 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- Vercel의 자동 이미지 최적화 활용

### 빌드 최적화
- 불필요한 의존성 제거
- Dynamic Import 사용
- Code Splitting 활용

### 캐싱 설정
- Static 파일은 자동 캐싱
- API 라우트는 적절한 캐싱 헤더 설정

---

## 🔐 보안 설정

### 보안 헤더
`vercel.json`에 이미 포함되어 있습니다:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### 환경 변수 보안
- 민감한 정보는 절대 `NEXT_PUBLIC_` 접두사 사용 금지
- 서버 사이드에서만 사용하는 변수는 접두사 없이 설정

---

## 📚 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ 배포 체크리스트

배포 전:
- [ ] GitHub에 코드 푸시 완료
- [ ] 로컬 빌드 테스트 완료 (`npm run build`)
- [ ] 환경 변수 목록 준비 완료
- [ ] 백엔드 URL 확인 완료

배포 중:
- [ ] Vercel 프로젝트 생성 완료
- [ ] Root Directory 설정 완료 (`frontend`)
- [ ] 환경 변수 설정 완료
- [ ] 배포 실행 완료

배포 후:
- [ ] 빌드 로그 확인 완료
- [ ] 배포된 URL 접속 확인 완료
- [ ] 로그인/회원가입 테스트 완료
- [ ] API 호출 테스트 완료
- [ ] 브라우저 콘솔 에러 확인 완료

배포 완료! 🎉
