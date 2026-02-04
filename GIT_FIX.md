# 🔧 Git 원격 저장소 수정 방법

## 상황
원격 저장소가 이미 설정되어 있지만, URL이 예시(`your-username`)로 되어 있습니다.

## 해결 방법

### 방법 1: 기존 원격 저장소 URL 변경 (추천)

```bash
# 현재 원격 저장소 URL 확인
git remote -v

# 원격 저장소 URL 변경 (본인의 GitHub 사용자명과 저장소 이름으로 바꾸세요!)
git remote set-url origin https://github.com/실제사용자명/실제저장소이름.git

# 변경 확인
git remote -v
```

### 방법 2: 기존 원격 저장소 제거 후 다시 추가

```bash
# 기존 원격 저장소 제거
git remote remove origin

# 새로운 원격 저장소 추가 (본인의 GitHub 사용자명과 저장소 이름으로 바꾸세요!)
git remote add origin https://github.com/실제사용자명/실제저장소이름.git

# 확인
git remote -v
```

## 예시

만약 GitHub 사용자명이 `haha2`이고 저장소 이름이 `admission-helper`라면:

```bash
git remote set-url origin https://github.com/haha2/admission-helper.git
```

## 다음 단계

원격 저장소 URL을 올바르게 설정한 후:

```bash
# 파일 추가 (변경사항이 있다면)
git add .

# 커밋
git commit -m "Initial commit: 고등 입시 도우미"

# GitHub에 푸시
git push -u origin main
```
