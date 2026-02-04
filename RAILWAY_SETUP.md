# 🚂 Railway 배포 설정 가이드

## ⚠️ 중요: Railway 도메인 생성하기

Railway에서 `http://localhost:10000`이 보이는 것은 **내부 포트**입니다.  
외부에서 접근하려면 **공개 도메인(Public Domain)**을 생성해야 합니다!

---

## 🔧 Railway 도메인 생성 방법

### 1단계: Railway Dashboard 접속
1. [Railway Dashboard](https://railway.app)에 로그인
2. 프로젝트 선택 (`admission-toolkit-fullstack` 또는 백엔드 서비스)

### 2단계: 서비스 선택
- 배포된 백엔드 서비스를 클릭합니다
- 서비스 이름을 클릭하여 상세 페이지로 이동

### 3단계: 공개 도메인 생성
1. 상단 메뉴에서 **Settings** 탭 클릭
2. **Networking** 섹션으로 스크롤
3. **Generate Domain** 버튼 클릭
4. 또는 **Public Networking** 섹션에서 **Generate Domain** 클릭

### 4단계: 도메인 확인
생성된 도메인 예시:
```
https://admission-toolkit-backend-production.up.railway.app
```

**⚠️ 중요:**
- 도메인은 `https://`로 시작합니다
- `http://localhost:10000`이 아닌 **생성된 도메인**을 사용해야 합니다
- 도메인은 자동으로 HTTPS가 적용됩니다

---

## 📝 Railway 환경 변수 설정

### 필수 환경 변수

**Settings** → **Variables** 탭에서 다음 변수들을 설정하세요:

```env
# 서버 설정
NODE_ENV=production
PORT=10000

# 데이터베이스
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT 인증
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS 설정 (프론트엔드 URL)
CORS_ORIGIN=https://your-frontend.vercel.app

# AI API
GEMINI_API_KEY=your-gemini-api-key

# 공공데이터 API (선택)
DATA_GO_KR_SERVICE_KEY=your-public-data-service-key
```

### CORS_ORIGIN 설정 방법

1. Vercel에 프론트엔드를 배포한 후 URL 확인
   - 예: `https://admission-toolkit.vercel.app`
2. Railway 환경 변수에 추가:
   ```
   CORS_ORIGIN=https://admission-toolkit.vercel.app
   ```
3. 여러 도메인 허용하려면 (개발용):
   ```
   CORS_ORIGIN=https://admission-toolkit.vercel.app,http://localhost:3000
   ```

---

## 🔍 Railway 도메인 확인 방법

### 방법 1: Dashboard에서 확인
1. Railway Dashboard → 프로젝트 → 서비스
2. **Settings** → **Networking**
3. **Public Domain** 섹션에서 확인

### 방법 2: 배포 로그에서 확인
1. **Deployments** 탭 클릭
2. 최신 배포 클릭
3. 로그에서 도메인 확인

### 방법 3: 서비스 상세 페이지에서 확인
- 서비스 카드에 도메인이 표시될 수 있습니다

---

## 🐛 문제 해결

### 문제 1: 도메인이 보이지 않음
**해결 방법:**
1. **Settings** → **Networking** 확인
2. **Generate Domain** 버튼이 있는지 확인
3. 서비스가 정상적으로 배포되었는지 확인
4. Railway 플랜이 무료 플랜인지 확인 (무료 플랜도 도메인 제공)

### 문제 2: 도메인 생성 후 접속 안 됨
**해결 방법:**
1. 서비스가 실행 중인지 확인 (**Deployments** 탭)
2. 포트가 올바르게 설정되었는지 확인 (`PORT=10000`)
3. 서버 로그 확인 (**View Logs**)

### 문제 3: CORS 에러 발생
**해결 방법:**
1. Railway 환경 변수 `CORS_ORIGIN` 확인
2. 프론트엔드 URL이 정확히 입력되었는지 확인
3. `http://` vs `https://` 확인
4. 환경 변수 변경 후 **Redeploy** 필요

### 문제 4: 데이터베이스 연결 실패
**해결 방법:**
1. `DATABASE_URL` 환경 변수 확인
2. Supabase Connection Pooling URL 사용 권장
3. Railway에서 PostgreSQL 서비스를 추가한 경우 자동 연결됨

---

## 🔄 Railway 재배포

환경 변수를 변경한 후에는 재배포가 필요할 수 있습니다:

### 자동 재배포
- GitHub에 push하면 자동으로 재배포됩니다

### 수동 재배포
1. **Deployments** 탭
2. **Redeploy** 버튼 클릭
3. 또는 **Settings** → **Redeploy** 클릭

---

## 📊 Railway 모니터링

### 로그 확인
1. **Deployments** → 최신 배포 클릭
2. **View Logs** 클릭
3. 실시간 로그 확인 가능

### 메트릭 확인
- **Metrics** 탭에서 CPU, 메모리 사용량 확인
- 무료 플랜: $5 크레딧/월

---

## 🔐 보안 설정

### 환경 변수 보안
- 민감한 정보는 절대 코드에 하드코딩하지 마세요
- Railway의 **Variables** 탭에서만 관리하세요
- `.env` 파일은 Git에 커밋하지 마세요

### HTTPS
- Railway는 자동으로 HTTPS를 제공합니다
- 별도 SSL 인증서 설정 불필요

---

## 📝 체크리스트

Railway 배포 전:
- [ ] GitHub에 코드 푸시 완료
- [ ] Railway 프로젝트 생성 완료
- [ ] 서비스 배포 완료

도메인 설정:
- [ ] **Generate Domain** 클릭 완료
- [ ] 생성된 도메인 확인 완료
- [ ] 도메인이 `https://`로 시작하는지 확인

환경 변수 설정:
- [ ] `DATABASE_URL` 설정 완료
- [ ] `JWT_SECRET` 설정 완료
- [ ] `CORS_ORIGIN` 설정 완료 (프론트엔드 URL)
- [ ] `GEMINI_API_KEY` 설정 완료

배포 확인:
- [ ] 서비스가 실행 중인지 확인
- [ ] 도메인으로 접속 테스트 완료
- [ ] `/api/health` 엔드포인트 테스트 완료
- [ ] 프론트엔드에서 API 호출 테스트 완료

---

## 🎯 다음 단계

Railway 도메인을 생성한 후:

1. **Vercel 환경 변수 업데이트**
   - Vercel Dashboard → **Settings** → **Environment Variables**
   - `NEXT_PUBLIC_API_URL`을 Railway 도메인으로 업데이트
   - 예: `NEXT_PUBLIC_API_URL=https://admission-toolkit-backend-production.up.railway.app`

2. **Vercel 재배포**
   - 환경 변수 변경 후 자동 재배포 또는 수동 재배포

3. **테스트**
   - 프론트엔드에서 로그인/회원가입 테스트
   - API 호출이 정상 작동하는지 확인

---

## 📚 참고 자료

- [Railway 공식 문서](https://docs.railway.app)
- [Railway 도메인 설정](https://docs.railway.app/networking/domains)
- [Railway 환경 변수](https://docs.railway.app/develop/variables)

---

배포 완료! 🎉
