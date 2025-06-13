# PDF 이북 뷰어

React + TypeScript로 만든 PDF 이북 뷰어입니다.

## 🚀 기능

- 📚 PDF 파일 이북 형태로 보기
- 🔍 확대/축소 기능
- ⌨️ 키보드 단축키 지원
- 📱 반응형 디자인
- 🌙 다크 모드 뷰어
- 🔖 페이지 네비게이션

## 🛠️ 기술 스택

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React-PDF
- Zustand (상태관리)
- React Router

## 📋 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 파일 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트들
│   ├── Header.tsx      # 헤더 컴포넌트
│   ├── BookList.tsx    # 책 목록 컴포넌트
│   ├── PDFViewer.tsx   # PDF 뷰어 컴포넌트
│   └── ViewerControls.tsx # 뷰어 컨트롤
├── store/              # Zustand 스토어
│   └── bookStore.ts    # 책 관련 상태 관리
├── types/              # TypeScript 타입 정의
│   └── index.ts        # 타입 정의들
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx           # 앱 진입점

public/
├── pdfs/              # PDF 파일들
├── covers/            # 책 표지 이미지들
└── metadata.json      # 책 메타데이터
```

## 📖 PDF 파일 추가하기

1. PDF 파일을 `public/pdfs/` 폴더에 추가
2. 표지 이미지를 `public/covers/` 폴더에 추가 (선택사항)
3. `public/metadata.json` 파일에 책 정보 추가

## ⌨️ 키보드 단축키

- `←` `→` : 이전/다음 페이지
- `Space` : 다음 페이지
- `Home` : 첫 페이지로
- `End` : 마지막 페이지로
- `Esc` : 홈으로 돌아가기

## 🚀 배포

GitHub Pages로 배포:

```bash
npm run deploy
```

## 📝 라이선스

MIT License
