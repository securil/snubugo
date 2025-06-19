# 서울사대부고 동창회보 디지털 아카이브 - 프로젝트 문서

## 📋 프로젝트 개요

### 🎯 프로젝트 목적
서울대학교 사범대학 부설고등학교 동창회에서 발행하는 동창회보를 디지털 형태로 아카이브하고, 웹에서 편리하게 열람할 수 있는 전용 뷰어 시스템 개발

### 📅 발간 정보
- **발간 주기**: 분기별 (3월, 6월, 9월, 12월)
- **계절 구분**: 봄호(3월), 여름호(6월), 가을호(9월), 겨울호(12월)
- **아카이브 범위**: 2020년 ~ 현재
- **예상 연간 발간 수**: 4회
- **총 예상 호수**: 약 24호 (2020~2025년 기준)

### 🛠️ 기술 스택
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **PDF 처리**: React-PDF + PDF.js
- **상태관리**: Zustand
- **라우팅**: React Router DOM
- **아이콘**: Lucide React
- **배포**: GitHub Pages (예정)

---

## 📁 프로젝트 구조

```
pdf-ebook-viewer-new/
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml              # GitHub Actions 배포 설정
├── 📁 public/
│   ├── 📁 covers/                  # 표지 이미지 저장소
│   │   ├── react-guide.svg         # 샘플 표지들
│   │   ├── typescript-master.svg
│   │   └── web-design.svg
│   ├── 📁 pdfs/                    # PDF 파일 저장소
│   │   ├── 2025년 131호-서울사대부고 여름호.pdf  # 실제 동창회보
│   │   ├── react-guide.pdf         # 샘플 PDF들
│   │   ├── typescript-master.pdf
│   │   └── web-design.pdf
│   ├── magazines.json              # 동창회보 메타데이터 (메인)
│   └── metadata.json               # 기타 도서 메타데이터 (하위호환)
├── 📁 src/
│   ├── 📁 components/              # React 컴포넌트들
│   │   ├── AutoThumbnail.tsx       # 자동 썸네일 생성 컴포넌트
│   │   ├── BookList.tsx            # 기타 도서 목록 (하위호환)
│   │   ├── Header.tsx              # 헤더 네비게이션
│   │   ├── MagazineList.tsx        # 동창회보 전용 목록 (메인)
│   │   ├── MagazineViewer.tsx      # 동창회보 뷰어 (2페이지 지원)
│   │   ├── PDFViewer.tsx           # 기본 PDF 뷰어 (하위호환)
│   │   └── ViewerControls.tsx      # 뷰어 컨트롤 (모드 전환 등)
│   ├── 📁 hooks/                   # 커스텀 훅들
│   │   └── usePdfThumbnail.ts      # PDF 썸네일 생성 훅
│   ├── 📁 store/                   # 상태 관리
│   │   └── bookStore.ts            # Zustand 글로벌 스토어
│   ├── 📁 types/                   # TypeScript 타입 정의
│   │   └── index.ts                # 전체 타입 정의
│   ├── 📁 utils/                   # 유틸리티 함수들
│   │   └── pdfUtils.ts             # PDF 처리 유틸리티
│   ├── App.tsx                     # 메인 앱 컴포넌트
│   ├── index.css                   # 전역 CSS 스타일
│   └── main.tsx                    # 앱 진입점
├── index.html                      # HTML 엔트리 포인트
├── package.json                    # 패키지 의존성
├── tailwind.config.js              # Tailwind 설정
├── tsconfig.json                   # TypeScript 설정
├── vite.config.ts                  # Vite 빌드 설정
├── README.md                       # 사용자 가이드
└── PROJECT_DOCUMENTATION.md       # 개발자 문서 (이 파일)
```

---

## 🚀 주요 기능

### 🎓 동창회보 특화 기능
- ✅ **계절별 분류**: 봄/여름/가을/겨울호 색상 구분 표시
- ✅ **연도별 필터링**: 2020년~현재까지 연도별 검색
- ✅ **최신호 하이라이트**: 가장 최근 발간호 메인 표시
- ✅ **추천호 섹션**: 특별 추천 호수 별도 표시
- ✅ **호수 체계**: 연속 호수 번호 관리 (예: 131호)
- ✅ **발간 통계**: 총 발간 호수 및 현황 표시

### 📖 PDF 뷰어 기능
- ✅ **자동 표지 생성**: PDF 첫 페이지를 썸네일로 자동 생성
- ✅ **2페이지 보기 모드**: 1920px 이상에서 자동 활성화
- ✅ **사용자 선택 모드**: 단일/2페이지 모드 수동 전환 가능
- ✅ **반응형 뷰어**: 모든 해상도에 최적화된 표시
- ✅ **키보드 단축키**: 네비게이션 및 모드 전환 지원
- ✅ **확대/축소**: 스케일 조정 및 전체화면 모드
- ✅ **페이지 네비게이션**: 직접 페이지 이동 및 썸네일

### 🤖 자동화 기능
- ✅ **PDF 메타데이터 추출**: 제목, 페이지 수, 생성일 자동 추출
- ✅ **파일 크기 자동 감지**: 실제 파일 크기 계산
- ✅ **예상 읽기 시간**: 페이지 수 기반 자동 계산
- ✅ **썸네일 캐싱**: 생성된 썸네일 메모리 캐싱
- ✅ **실시간 PDF 분석**: 앱 시작 시 모든 PDF 자동 분석

### 🎨 사용자 경험
- ✅ **계절별 테마 색상**: 직관적인 계절 구분
- ✅ **로딩 상태 표시**: PDF 분석 진행 상황 시각화
- ✅ **오류 처리**: PDF 로드 실패 시 대체 방안 제공
- ✅ **접근성**: 키보드 네비게이션 완전 지원
- ✅ **모바일 최적화**: 터치 제스처 및 반응형 디자인

---

## ✅ 완료된 작업

### 1단계: 기본 PDF 뷰어 구축 (완료)
- [x] React + TypeScript + Vite 프로젝트 설정
- [x] PDF.js 및 React-PDF 통합
- [x] 기본 PDF 표시 및 페이지 네비게이션
- [x] Tailwind CSS 스타일링 시스템
- [x] Zustand 상태 관리 구축

### 2단계: 자동 썸네일 생성 (완료)
- [x] PDF 첫 페이지 캡처 시스템 구현
- [x] Canvas 기반 썸네일 생성
- [x] 자동 메타데이터 추출 (제목, 페이지 수, 파일 크기)
- [x] 썸네일 캐싱 및 오류 처리
- [x] 로딩 상태 UI 구현

### 3단계: 동창회보 특화 시스템 (완료)
- [x] 동창회보 전용 데이터 구조 설계
- [x] 계절별/연도별 분류 시스템
- [x] magazines.json 메타데이터 구조 생성
- [x] 계절별 색상 테마 적용
- [x] 최신호/추천호 표시 시스템

### 4단계: 2페이지 뷰어 모드 (완료)
- [x] 단일/2페이지 모드 전환 시스템
- [x] 1920px 이상 해상도에서 자동 2페이지 모드
- [x] 사용자 수동 모드 전환 (Ctrl+1/2)
- [x] 2페이지 모드 페이지 네비게이션 로직
- [x] 반응형 페이지 스케일링

### 5단계: UI/UX 개선 (완료)
- [x] 동창회보 브랜딩 헤더 구현
- [x] 필터링 및 검색 시스템
- [x] 예상 읽기 시간 계산
- [x] 키보드 단축키 확장
- [x] 에러 핸들링 및 로딩 상태

### 6단계: 배포 준비 (완료)
- [x] GitHub Actions 자동 배포 설정
- [x] 빌드 최적화 및 테스트
- [x] 프로젝트 문서화
- [x] Git 버전 관리 설정

---

## 🔄 진행 중인 작업

### 테스트 및 검증
- 🔄 실제 동창회보 PDF 테스트
- 🔄 다양한 해상도에서 뷰어 테스트
- 🔄 모바일 환경 호환성 테스트
- 🔄 PDF 메타데이터 추출 정확도 검증

---

## 📝 향후 계획 (우선순위별)

### 높은 우선순위
- [ ] **실제 동창회보 PDF 업로드**: 2020년~2024년 백넘버 추가
- [ ] **검색 기능**: 제목, 내용, 날짜별 통합 검색
- [ ] **북마크 시스템**: 사용자별 즐겨찾기 기능
- [ ] **목차 자동 추출**: PDF 북마크를 이용한 목차 네비게이션

### 중간 우선순위  
- [ ] **메모 및 하이라이트**: 사용자 주석 기능
- [ ] **다크 테마**: 야간 독서를 위한 다크 모드
- [ ] **독서 진행률**: 읽은 페이지 추적 및 통계
- [ ] **소셜 공유**: 특정 페이지나 호수 공유 기능
- [ ] **PDF 다운로드**: 오프라인 읽기를 위한 다운로드

### 낮은 우선순위
- [ ] **댓글 시스템**: 호수별 독자 의견 교환
- [ ] **알림 시스템**: 신규 호수 발간 알림
- [ ] **통계 대시보드**: 관리자용 독서 통계
- [ ] **다국어 지원**: 영어 버전 인터페이스
- [ ] **PDF 텍스트 추출**: 전문 검색을 위한 OCR

---

## 🛠️ 개발 환경 설정

### 필수 요구사항
```bash
Node.js: v18.0.0 이상
npm: v8.0.0 이상
Git: v2.0.0 이상
```

### 초기 설정
```bash
# 저장소 클론
git clone [repository-url]
cd pdf-ebook-viewer-new

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 변수 (필요시)
```env
# .env.local (선택사항)
VITE_APP_TITLE="서울사대부고 동창회보"
VITE_API_BASE_URL="/pdf-ebook-viewer"
```

---

## 📊 데이터 구조

### magazines.json 구조
```json
{
  "magazines": [
    {
      "id": "2025-summer-131",           // 고유 ID
      "year": 2025,                     // 발간 연도
      "season": "여름",                  // 계절
      "issue": 131,                     // 호수
      "month": 6,                       // 발간 월
      "title": "제목",                   // 동창회보 제목
      "description": "설명",             // 간단한 설명
      "coverImage": "auto-generated",   // 표지 이미지 (자동생성)
      "pdfPath": "/pdfs/파일명.pdf",     // PDF 파일 경로
      "pageCount": 0,                   // 페이지 수 (자동추출)
      "publishDate": "2025-06-01",      // 발간일
      "fileSize": "알 수 없음",          // 파일 크기 (자동계산)
      "isLatest": true,                 // 최신호 여부
      "featured": true,                 // 추천호 여부
      "tags": ["동창회보", "2025", "여름호"], // 태그
      "category": "동창회보"             // 카테고리
    }
  ],
  "settings": {
    "title": "서울사대부고 동창회보",
    "subtitle": "Seoul National University High School Alumni Magazine",
    "description": "서울대학교 사범대학 부설고등학교 동창회 공식 소식지",
    "startYear": 2020,
    "publishMonths": [3, 6, 9, 12],
    "seasons": {
      "3": "봄", "6": "여름", "9": "가을", "12": "겨울"
    },
    "colors": {
      "primary": "#1e40af",
      "secondary": "#3b82f6", 
      "accent": "#f59e0b",
      "neutral": "#6b7280"
    }
  }
}
```

---

## 🎯 키보드 단축키

### 뷰어 내부
- `←` `→` : 이전/다음 페이지
- `Space` : 다음 페이지
- `Home` : 첫 페이지로
- `End` : 마지막 페이지로
- `Esc` : 홈으로 돌아가기
- `Ctrl + 1` : 단일 페이지 모드
- `Ctrl + 2` : 2페이지 보기 모드
- `+` / `=` : 확대
- `-` : 축소
- `0` : 원본 크기

### 전역
- `F11` : 전체화면 토글

---

## 🚨 알려진 이슈

### 해결된 이슈
- ✅ PDF.js worker 경로 설정 문제
- ✅ TypeScript 타입 오류
- ✅ 2페이지 모드 페이지 번호 동기화
- ✅ 썸네일 생성 메모리 누수

### 현재 이슈
- ⚠️ 대용량 PDF (50MB+) 로딩 속도
- ⚠️ 모바일에서 2페이지 모드 최적화 필요

### 모니터링 필요
- 📊 썸네일 생성 성능 (100+ PDF 시)
- 📊 메모리 사용량 (장시간 사용 시)

---

## 🤝 기여 가이드

### 코드 스타일
- TypeScript 엄격 모드 사용
- ESLint + Prettier 규칙 준수
- 컴포넌트명: PascalCase
- 파일명: camelCase
- CSS 클래스: kebab-case (Tailwind)

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 또는 보조 도구 변경
```

### 브랜치 전략
- `main`: 배포 가능한 안정 버전
- `develop`: 개발 중인 기능들
- `feature/기능명`: 새로운 기능 개발
- `hotfix/수정명`: 긴급 버그 수정

---

## 📞 연락처 및 지원

### 프로젝트 관리
- **개발 기간**: 2024.12 ~ 2025.06
- **최종 업데이트**: 2025.06.19
- **버전**: v1.0.0

### 기술 지원
- React 관련: [React 공식 문서](https://react.dev/)
- PDF.js: [PDF.js 문서](https://mozilla.github.io/pdf.js/)
- Tailwind CSS: [Tailwind 문서](https://tailwindcss.com/)

---

## 📈 성능 최적화

### 현재 적용된 최적화
- React.memo를 이용한 컴포넌트 렌더링 최적화
- PDF 썸네일 메모리 캐싱
- Vite의 코드 스플리팅 활용
- 이미지 lazy loading

### 추가 최적화 계획
- Service Worker를 통한 PDF 캐싱
- 가상화된 긴 리스트 (react-window)
- PDF 청크 로딩 (대용량 파일용)
- CDN 도입 (배포 시)

---

이 문서는 프로젝트의 현재 상태와 향후 계획을 담고 있습니다. 개발 진행에 따라 지속적으로 업데이트해주세요.
