# 📝 GitHub 저장소 설정 가이드

단계별로 GitHub에 소스를 올리는 방법입니다.

---

## 1단계: GitHub 저장소 생성

### 1. GitHub 웹사이트에서
1. [GitHub](https://github.com) 로그인
2. 우측 상단 **+** 버튼 → **New repository** 클릭
3. 저장소 정보 입력:
   - **Repository name**: `admission-helper` (또는 원하는 이름)
   - **Description**: `고등학생 입시 종합 관리 시스템`
   - **Public** 또는 **Private** 선택
   - **⚠️ 중요**: "Initialize this repository with a README" 체크 해제
   - "Add .gitignore" 선택 안 함
   - "Choose a license" 선택 안 함
4. **Create repository** 클릭

### 2. 생성된 저장소 URL 확인
예: `https://github.com/your-username/admission-helper`

---

## 2단계: 로컬에서 Git 초기화

### 1. 프로젝트 폴더로 이동
```bash
cd C:\Users\haha2\admission-toolkit-fullstack
```

### 2. Git 초기화 (아직 안 했다면)
```bash
git init
```

### 3. .gitignore 파일 확인/생성
`.gitignore` 파일이 있는지 확인하고, 없다면 생성:

```bash
# .gitignore 파일 생성
```

---

## 3단계: .gitignore 파일 생성

프로젝트 루트에 `.gitignore` 파일 생성:

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment variables
.env
.env.local
.env.*.local
backend/.env
frontend/.env.local

# Build output
dist/
build/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Prisma
prisma/migrations/*_initial/

# Misc
*.pem
*.key
.cache/
```

---

## 4단계: 파일 추가 및 커밋

### 1. 모든 파일 추가
```bash
git add .
```

### 2. 첫 커밋
```bash
git commit -m "Initial commit: 고등 입시 도우미 풀스택 프로젝트"
```

---

## 5단계: GitHub에 푸시

### 1. 원격 저장소 연결
```bash
git remote add origin https://github.com/your-username/admission-helper.git
```
⚠️ `your-username`과 `admission-helper`를 본인의 GitHub 사용자명과 저장소 이름으로 바꾸세요!

### 2. 기본 브랜치를 main으로 설정 (필요 시)
```bash
git branch -M main
```

### 3. GitHub에 푸시
```bash
git push -u origin main
```

### 4. GitHub 인증
- 브라우저에서 GitHub 로그인 창이 뜨면 로그인
- 또는 Personal Access Token 입력

---

## 6단계: 확인

GitHub 웹사이트에서 저장소 페이지를 새로고침하면 파일들이 올라간 것을 확인할 수 있습니다.

---

## 다음 단계

GitHub에 소스가 올라갔으면, `DEPLOYMENT.md` 파일을 참고하여:
1. Railway에 백엔드 배포
2. Vercel에 프론트엔드 배포

를 진행하세요!
