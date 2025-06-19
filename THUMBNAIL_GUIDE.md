# 썸네일 생성 가이드

## 🎯 개요

동창회보 PDF 파일들의 썸네일을 사전에 생성하여 웹사이트 성능을 최적화하는 시스템입니다.

---

## 📁 폴더 구조

```
public/
├── pdfs/                          # PDF 파일들
│   ├── 2021년 116호-서울사대부고 봄호.pdf
│   ├── 2021년 117호-서울사대부고 여름호.pdf
│   └── ...
├── thumbnails/                    # 썸네일 이미지들
│   ├── 2021-spring-116.jpg        # 116호 썸네일
│   ├── 2021-summer-117.jpg        # 117호 썸네일
│   └── ...
└── magazines.json                 # 메타데이터 (thumbnails 경로 포함)
```

---

## 🚀 썸네일 생성 프로세스

### 1단계: 필요한 패키지 설치
```bash
npm install
```

### 2단계: 썸네일 일괄 생성
```bash
# 모든 동창회보의 썸네일 생성
npm run thumbnails

# 기존 썸네일 삭제 후 재생성
npm run thumbnails:clean
```

### 3단계: 결과 확인
생성 과정에서 다음과 같은 로그가 출력됩니다:

```
🚀 썸네일 일괄 생성 시작...

[1/16] 처리 중: 2025년 131호 서울사대부고 동창회보 여름호
썸네일 생성 시작: 2025년 131호-서울사대부고 여름호.pdf
✅ 썸네일 생성 완료: 2025-summer-131.jpg

[2/16] 처리 중: 2024년 130호 서울사대부고 동창회보 겨울호
썸네일 생성 시작: 2024년 130호-서울사대부고 겨울호.pdf
✅ 썸네일 생성 완료: 2024-winter-130.jpg

...

==================================================
📊 썸네일 생성 결과 요약
==================================================
✅ 성공: 16개
❌ 실패: 0개
📈 성공률: 100%

✅ 생성된 썸네일들:
  - 2025-summer-131: /thumbnails/2025-summer-131.jpg (225x300)
  - 2024-winter-130: /thumbnails/2024-winter-130.jpg (225x300)
  ...

🎉 썸네일 생성 완료!
```

---

## 📋 새 동창회보 추가 시 작업 순서

### 1. PDF 파일 추가
```bash
# PDF 파일을 public/pdfs/ 폴더에 복사
cp "새동창회보.pdf" "D:\Project\pdf-ebook-viewer-new\public\pdfs\2025년 132호-서울사대부고 가을호.pdf"
```

### 2. magazines.json 업데이트
```json
{
  "id": "2025-fall-132",
  "year": 2025,
  "season": "가을",
  "issue": 132,
  "month": 9,
  "title": "2025년 132호 서울사대부고 동창회보 가을호",
  "description": "2025년 가을호 동창회 소식지입니다.",
  "coverImage": "auto-generated",  // 생성 전에는 이 값
  "pdfPath": "/pdfs/2025년 132호-서울사대부고 가을호.pdf",
  // ... 기타 필드
}
```

### 3. 썸네일 생성
```bash
npm run thumbnails
```

### 4. 결과 확인
- `public/thumbnails/2025-fall-132.jpg` 파일 생성 확인
- `magazines.json`에서 `coverImage` 값이 `/thumbnails/2025-fall-132.jpg`로 자동 업데이트됨

---

## 🔧 썸네일 생성 설정

### 썸네일 크기 조정
`tools/generateThumbnails.js` 파일에서 설정 가능:

```javascript
// 기본값: 300x400 픽셀
const result = await this.generateThumbnail(pdfPath, thumbnailPath, 300, 400);
```

### 이미지 품질 조정
```javascript
// JPG 품질 설정 (0.0 ~ 1.0)
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });
```

---

## 🚨 문제 해결

### 썸네일 생성 실패 시

1. **PDF 파일 확인**
   - 파일 경로가 정확한지 확인
   - PDF 파일이 손상되지 않았는지 확인
   - 파일 권한 문제 확인

2. **Canvas 설치 문제 (Windows)**
   ```bash
   # Visual Studio Build Tools 필요할 수 있음
   npm install --global windows-build-tools
   npm install canvas
   ```

3. **메모리 부족**
   ```bash
   # Node.js 메모리 증가
   set NODE_OPTIONS=--max-old-space-size=4096
   npm run thumbnails
   ```

### 특정 PDF만 재생성하기

`tools/generateThumbnails.js`를 수정하여 특정 ID만 처리:

```javascript
// 특정 동창회보만 처리
const targetIds = ['2025-summer-131', '2024-winter-130'];
const magazines = this.getMagazineList().filter(m => targetIds.includes(m.id));
```

---

## 📈 성능 최적화

### 생성된 썸네일 최적화

1. **이미지 압축**
   ```bash
   # ImageMagick 사용 (선택사항)
   mogrify -quality 80 public/thumbnails/*.jpg
   ```

2. **WebP 변환** (향후 개선)
   ```bash
   # WebP 형식으로 변환 (더 작은 파일 크기)
   for f in public/thumbnails/*.jpg; do
     cwebp "$f" -o "${f%.jpg}.webp"
   done
   ```

### 로딩 성능

- 썸네일 파일 크기: 평균 15-30KB
- 로딩 시간: 일반적으로 100ms 이하
- 네트워크 요청: PDF 파일 대신 썸네일만 요청

---

## 🎯 장점

### 개발자 측면
- ✅ 브라우저에서 PDF 처리 부담 제거
- ✅ PDF.js Worker 충돌 문제 해결
- ✅ 메모리 사용량 대폭 감소
- ✅ 안정적인 썸네일 표시

### 사용자 측면  
- ✅ 빠른 페이지 로딩 (즉시 썸네일 표시)
- ✅ 네트워크 사용량 절약
- ✅ 모바일 환경에서도 원활한 동작
- ✅ 오프라인에서도 썸네일 캐싱 가능

---

## 📝 향후 개선 계획

1. **WebP 지원**: 더 작은 파일 크기를 위한 WebP 형식 지원
2. **자동화**: CI/CD에서 새 PDF 추가 시 자동 썸네일 생성
3. **다중 해상도**: 1x, 2x, 3x 해상도별 썸네일 생성
4. **메타데이터 추출**: PDF에서 제목, 페이지 수 등 자동 추출

---

이 방식을 통해 안정적이고 빠른 동창회보 아카이브 시스템을 구축할 수 있습니다!
