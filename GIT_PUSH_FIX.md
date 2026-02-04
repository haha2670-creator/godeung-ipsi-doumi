# 🔧 Git Push 오류 해결 방법

## 상황
원격 저장소에 이미 파일이 있어서 푸시가 실패했습니다.

## 해결 방법

### 방법 1: 원격 저장소 내용 가져와서 병합 (추천)

```bash
# 원격 저장소 내용 가져오기
git pull origin master --allow-unrelated-histories

# 충돌이 있다면 해결 후
git add .
git commit -m "Merge remote and local"

# 다시 푸시
git push -u origin master
```

### 방법 2: Force Push (원격 저장소 내용 무시하고 덮어쓰기)

⚠️ **주의**: 원격 저장소에 중요한 파일이 있다면 이 방법은 사용하지 마세요!

```bash
# 원격 저장소를 로컬 내용으로 강제 덮어쓰기
git push -u origin master --force
```

### 방법 3: 브랜치 이름 확인 및 변경

로컬이 `master`인데 원격이 `main`일 수도 있습니다:

```bash
# 브랜치 이름을 main으로 변경
git branch -M main

# main 브랜치로 푸시
git push -u origin main
```

## 추천 순서

1. 먼저 **방법 1** 시도 (안전함)
2. 원격 저장소가 비어있거나 덮어써도 된다면 **방법 2** 사용
3. 브랜치 이름이 다르면 **방법 3** 사용
