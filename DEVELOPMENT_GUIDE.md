# 개발 환경 설정 가이드

## 🚀 빠른 시작

### 1. 서버 실행
```bash
# 개발 서버 시작
npm run dev

# 접속 URL
http://localhost:5173/pdf-ebook-viewer/
```

### 2. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# GitHub Pages 배포 (자동)
git push origin main
```

---

## 🛠️ 상세 설정 가이드

### 시스템 요구사항
- **Node.js**: v18.0.0 이상 ([다운로드](https://nodejs.org/))
- **npm**: v8.0.0 이상 (Node.js와 함께 설치됨)
- **Git**: v2.0.0 이상 ([다운로드](https://git-scm.com/))
- **메모리**: 최소 4GB RAM 권장
- **저장공간**: 1GB 이상 여유 공간

### 개발 도구 권장 사항
- **에디터**: Visual Studio Code
- **브라우저**: Chrome 또는 Firefox (PDF.js 호환성)
- **터미널**: PowerShell, Git Bash, 또는 VS Code 내장 터미널

---

## 📦 의존성 설치

### 초기 설치
```bash
# 프로젝트 폴더로 이동
cd "D:\Project\pdf-ebook-viewer-new"

# 모든 의존성 설치
npm install
```

### 개별 패키지 정보
```json
{
  "main-dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0", 
    "react-pdf": "^7.7.1",
    "react-router-dom": "^6.20.1",
    "zustand": "^4.4.7",
    "lucide-react": "^0.294.0"
  },
  "dev-dependencies": {
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "tailwindcss": "^3.3.5",
    "@vitejs/plugin-react": "^4.1.1",
    "eslint": "^8.53.0"
  }
}
```

---

## 🔧 개발 명령어

### 기본 명령어
```bash
# 개발 서버 실행 (Hot Reload 포함)
npm run dev

# TypeScript 타입 체크
npm run build

# 코드 린팅
npm run lint

# 미리보기 서버 (빌드된 파일)
npm run preview
```

### 고급 명령어
```bash
# 특정 포트로 실행
npm run dev -- --port 3000

# 네트워크에 노출 (다른 기기에서 접속 가능)
npm run dev -- --host

# 빌드 결과 분석
npm run build -- --analyze

# 캐시 클리어
npm cache clean --force
```

---

## 🌐 브라우저 접속

### 로컬 개발 환경
- **메인 페이지**: `http://localhost:5173/pdf-ebook-viewer/`
- **동창회보 목록**: `http://localhost:5173/pdf-ebook-viewer/`  
- **기타 도서**: `http://localhost:5173/pdf-ebook-viewer/books`
- **특정 뷰어**: `http://localhost:5173/pdf-ebook-viewer/viewer/[ID]`

### 네트워크 접속 (모바일 테스트용)
```bash
# 호스트 모드로 실행
npm run dev -- --host

# 표시된 네트워크 IP로 접속
# 예: http://192.168.1.100:5173/pdf-ebook-viewer/
```

---

## 📁 파일 구조 및 역할

### 핵심 설정 파일
```
📄 package.json          # 의존성 및 스크립트
📄 vite.config.ts        # 빌드 도구 설정
📄 tailwind.config.js    # CSS 프레임워크 설정
📄 tsconfig.json         # TypeScript 컴파일러 설정
📄 .gitignore           # Git 제외 파일 목록
```

### 소스 코드 구조
```
📁 src/
├── 📄 main.tsx          # 앱 진입점
├── 📄 App.tsx           # 라우팅 및 데이터 로딩
├── 📄 index.css         # 전역 스타일
├── 📁 components/       # UI 컴포넌트들
├── 📁 hooks/           # 커스텀 React 훅
├── 📁 store/           # 상태 관리 (Zustand)
├── 📁 types/           # TypeScript 타입 정의
└── 📁 utils/           # 유틸리티 함수들
```

### 정적 파일 구조
```
📁 public/
├── 📁 pdfs/            # PDF 파일 저장소
├── 📁 covers/          # 표지 이미지 저장소
├── 📄 magazines.json   # 동창회보 메타데이터
└── 📄 metadata.json    # 기타 도서 메타데이터
```

---

## 🔍 개발 도구 설정

### VS Code 확장 프로그램 (권장)
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code 설정 (.vscode/settings.json)
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

---

## 🐛 문제 해결

### 자주 발생하는 오류들

#### 1. 포트 사용 중 오류
```bash
Error: Port 5173 is already in use
```
**해결 방법:**
```bash
# 다른 포트 사용
npm run dev -- --port 3000

# 또는 프로세스 종료 후 재시작
```

#### 2. 의존성 설치 오류
```bash
npm ERR! peer dep missing
```
**해결 방법:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install

# 또는 강제 설치
npm install --force
```

#### 3. TypeScript 오류
```bash
TS2307: Cannot find module
```
**해결 방법:**
```bash
# TypeScript 캐시 클리어
npx tsc --build --clean

# VS Code 재시작
Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### 4. PDF 로딩 오류
```bash
PDF.js worker not found
```
**해결 방법:**
```typescript
// main.tsx에서 worker 경로 확인
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();
```

### 성능 문제 해결

#### 느린 빌드 속도
```bash
# Vite 캐시 클리어
rm -rf node_modules/.vite

# npm 캐시 클리어  
npm cache clean --force
```

#### 메모리 부족
```bash
# Node.js 메모리 할당 증가
set NODE_OPTIONS=--max-old-space-size=4096
npm run dev
```

---

## 🧪 테스트 가이드

### 수동 테스트 체크리스트

#### 기본 기능
- [ ] 홈페이지 로딩
- [ ] 동창회보 목록 표시
- [ ] PDF 뷰어 열기
- [ ] 페이지 네비게이션
- [ ] 확대/축소 기능

#### 반응형 테스트  
- [ ] 모바일 (360px~768px)
- [ ] 태블릿 (768px~1024px) 
- [ ] 데스크톱 (1024px~1920px)
- [ ] 대형 모니터 (1920px+)

#### 브라우저 호환성
- [ ] Chrome (권장)
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### 키보드 접근성
- [ ] Tab 네비게이션
- [ ] 화살표 키 페이지 이동
- [ ] Ctrl+1/2 모드 전환
- [ ] Esc 홈 이동

### 자동 테스트 (향후 계획)
```bash
# 단위 테스트 (Jest + React Testing Library)
npm run test

# E2E 테스트 (Playwright)
npm run test:e2e

# 타입 체크
npm run type-check
```

---

## 📈 성능 모니터링

### 개발 도구 활용
```bash
# 번들 크기 분석
npm run build -- --analyze

# 메모리 사용량 확인 (Chrome DevTools)
F12 → Performance → Memory
```

### 성능 지표 목표
- **초기 로딩**: < 3초
- **PDF 썸네일 생성**: < 2초
- **페이지 전환**: < 500ms
- **메모리 사용량**: < 200MB (50개 PDF 로딩 시)

---

## 🔐 보안 고려사항

### 개발 환경
- PDF 파일은 `public/` 폴더에만 저장
- 민감한 정보는 환경 변수 사용
- HTTPS 환경에서 테스트 (배포 시)

### 배포 환경
- GitHub Pages는 public 저장소만 지원
- PDF 파일 접근 권한 관리 필요 시 별도 인증 시스템 구축

---

## 🚢 배포 가이드

### GitHub Pages 자동 배포
1. **코드 푸시**
   ```bash
   git add .
   git commit -m "변경사항 설명"
   git push origin main
   ```

2. **배포 확인**
   - GitHub Actions 탭에서 배포 상태 확인
   - 성공 시 `https://[username].github.io/pdf-ebook-viewer/` 접속

### 수동 배포
```bash
# 빌드 생성
npm run build

# 빌드 파일을 웹 서버에 업로드
# dist/ 폴더 내용을 서버 루트에 복사
```

---

## 📚 추가 학습 자료

### 핵심 기술 문서
- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Vite 가이드](https://vitejs.dev/guide/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

### PDF 처리 관련
- [PDF.js 사용법](https://mozilla.github.io/pdf.js/)
- [React-PDF 가이드](https://react-pdf.org/)
- [Canvas API 문서](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### 상태 관리
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [React 상태 관리 패턴](https://patterns.dev/posts/state-pattern)

---

이 가이드를 따라하시면 개발 환경을 성공적으로 설정하고 프로젝트를 실행할 수 있습니다. 
문제가 발생하면 이 문서의 문제 해결 섹션을 참고하거나 GitHub Issues에 등록해주세요.
