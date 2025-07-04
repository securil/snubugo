# 동창회보 관리 가이드

## 📋 관리자를 위한 가이드

이 문서는 서울사대부고 동창회보 디지털 아카이브에 새로운 동창회보를 추가하고 관리하는 방법을 설명합니다.

---

## 🗓️ 발간 일정 관리

### 정기 발간 일정
- **봄호**: 매년 3월 발간
- **여름호**: 매년 6월 발간  
- **가을호**: 매년 9월 발간
- **겨울호**: 매년 12월 발간

### 호수 체계
- 연속 번호 사용 (예: 130호, 131호, 132호...)
- 2025년 여름호 = 131호 (현재 최신)
- 다음 발간 예정: 2025년 가을호 = 132호

---

## 📁 새 동창회보 추가하기

### 1단계: PDF 파일 준비

#### 파일 명명 규칙
```
YYYY년 호수호-서울사대부고 계절호.pdf

예시:
✅ 2025년 132호-서울사대부고 가을호.pdf  
✅ 2025년 133호-서울사대부고 겨울호.pdf
❌ 가을호.pdf (불충분)
❌ 2025_fall.pdf (형식 틀림)
```

#### 파일 품질 기준
- **해상도**: 최소 300DPI 권장
- **파일 크기**: 20MB 이하 권장 (웹 로딩 속도 고려)
- **페이지 방향**: 세로 방향 (A4 기준)
- **색상**: 컬러 또는 흑백 모두 지원
- **보안**: 암호 보호 없음 (웹에서 읽기 불가)

### 2단계: 파일 업로드

1. **PDF 파일 저장**
   ```
   📁 D:\Project\pdf-ebook-viewer-new\public\pdfs\
   └── 📄 2025년 132호-서울사대부고 가을호.pdf
   ```

2. **표지 이미지 (선택사항)**
   - 자동 생성되므로 별도 업로드 불필요
   - 필요시 `public/covers/` 폴더에 JPG/PNG 파일 추가

### 3단계: 메타데이터 등록

`magazines.json` 파일을 편집하여 새 동창회보 정보를 추가합니다.

#### 파일 위치
```
📄 D:\Project\pdf-ebook-viewer-new\public\magazines.json
```

#### 새 항목 추가 예시
```json
{
  "magazines": [
    {
      "id": "2025-fall-132",
      "year": 2025,
      "season": "가을",
      "issue": 132,
      "month": 9,
      "title": "2025년 132호 서울사대부고 동창회보 가을호",
      "description": "2025년 가을호 동창회 소식지입니다. 추석 특집과 동문 근황을 담고 있습니다.",
      "coverImage": "auto-generated",
      "pdfPath": "/pdfs/2025년 132호-서울사대부고 가을호.pdf",
      "pageCount": 0,
      "publishDate": "2025-09-01",
      "fileSize": "알 수 없음",
      "isLatest": true,        // ⭐ 새로 추가하는 호수를 최신호로 설정
      "featured": false,       // 일반적으로 false, 특별한 경우만 true
      "tags": ["동창회보", "2025", "가을호", "서울사대부고", "추석특집"],
      "category": "동창회보"
    },
    {
      "id": "2025-summer-131",
      "isLatest": false,       // ⭐ 기존 최신호는 false로 변경
      // ... 기존 데이터
    }
  ]
}
```

#### 필수 필드 설명
| 필드 | 설명 | 예시 |
|------|------|------|
| `id` | 고유 식별자 | "2025-fall-132" |
| `year` | 발간 연도 | 2025 |
| `season` | 계절 | "봄", "여름", "가을", "겨울" |
| `issue` | 호수 | 132 |
| `month` | 발간 월 | 3, 6, 9, 12 |
| `title` | 제목 | "2025년 132호..." |
| `pdfPath` | PDF 경로 | "/pdfs/파일명.pdf" |
| `publishDate` | 발간일 | "2025-09-01" |
| `isLatest` | 최신호 여부 | true/false |

---

## ⚙️ 시스템 업데이트

### 새 동창회보 추가 후 확인사항

1. **파일 확인**
   - PDF 파일이 올바른 위치에 있는지 확인
   - 파일명이 정확한지 확인

2. **메타데이터 확인**
   - JSON 문법 오류가 없는지 확인
   - 호수 순서가 맞는지 확인
   - 최신호 설정이 올바른지 확인

3. **테스트**
   - 개발 서버에서 정상 표시 확인
   - 썸네일 자동 생성 확인
   - 페이지 수 자동 추출 확인

### 서버 재시작
```bash
# 개발 서버 재시작
npm run dev

# 접속하여 확인
http://localhost:5173/pdf-ebook-viewer/
```

---

## 🔧 고급 관리 기능

### 최신호/추천호 관리

#### 최신호 변경
```json
{
  "id": "새로운-최신호",
  "isLatest": true,     // 새 최신호
  "featured": true      // 메인에서 강조 표시
}
```

#### 기존 최신호 처리
```json
{
  "id": "기존-최신호", 
  "isLatest": false,    // 최신호 해제
  "featured": false     // 일반호로 변경
}
```

### 특별호 관리

#### 창간기념호, 특집호 등
```json
{
  "id": "2025-special-133",
  "year": 2025,
  "season": "특별호",
  "issue": 133,
  "title": "창간 50주년 기념호",
  "description": "서울사대부고 동창회보 창간 50주년을 기념하는 특별호입니다.",
  "featured": true,     // 특별호는 추천 섹션에 표시
  "tags": ["특별호", "창간기념", "50주년"],
  // ... 기타 필드
}
```

### 백넘버 일괄 추가

2020년부터의 백넘버를 추가할 때는 다음 규칙을 따르세요:

#### 호수 계산
- 2025년 여름호가 131호라면
- 연간 4회 발간 × 5년 = 20호
- 2020년 봄호 = 131 - (5×4) + 1 = 112호

#### 일괄 추가 템플릿
```json
{
  "id": "2020-spring-112",
  "year": 2020,
  "season": "봄", 
  "issue": 112,
  "month": 3,
  "title": "2020년 112호 서울사대부고 동창회보 봄호",
  "description": "2020년 봄호 동창회 소식지입니다.",
  "coverImage": "auto-generated",
  "pdfPath": "/pdfs/2020년 112호-서울사대부고 봄호.pdf",
  "pageCount": 0,
  "publishDate": "2020-03-01",
  "fileSize": "알 수 없음",
  "isLatest": false,
  "featured": false,
  "tags": ["동창회보", "2020", "봄호", "서울사대부고"],
  "category": "동창회보"
}
```

---

## 📊 통계 및 모니터링

### 현재 현황 (2025.06 기준)
- **총 호수**: 1개 (131호)
- **보관 기간**: 2025년~현재
- **총 PDF 크기**: 약 10MB
- **평균 페이지 수**: 미정 (데이터 축적 필요)

### 목표 현황 (2025.12 기준)
- **총 호수**: 4개 (131~134호)
- **보관 기간**: 2025년 전체
- **예상 총 크기**: 약 50MB

### 장기 목표 (2026.06 기준)
- **총 호수**: 24개 (112~135호)
- **보관 기간**: 2020~2025년
- **예상 총 크기**: 약 300MB

---

## 🚨 문제 해결

### 자주 발생하는 문제들

#### 1. PDF가 표시되지 않음
**원인**: 파일 경로 오류
**해결**: 
- 파일명과 `pdfPath` 일치 확인
- 특수문자, 공백 확인
- 대소문자 정확히 입력

#### 2. 썸네일이 생성되지 않음  
**원인**: PDF 파일 손상 또는 보안 설정
**해결**:
- PDF 파일을 다른 뷰어에서 열어보기
- 암호 보호 제거
- PDF 재생성 (인쇄→PDF로 저장)

#### 3. 메타데이터 오류
**원인**: JSON 문법 오류
**해결**:
- JSON 유효성 검사 도구 사용
- 콤마, 중괄호 누락 확인
- 따옴표 정확히 입력

#### 4. 최신호가 변경되지 않음
**원인**: 기존 최신호 `isLatest` 값 변경 누락
**해결**:
- 모든 호수에서 `isLatest: false` 설정
- 새 호수만 `isLatest: true` 설정

---

## 📋 체크리스트

### 새 동창회보 추가 시 확인사항

#### 파일 준비
- [ ] PDF 파일명이 규칙에 맞음
- [ ] 파일 크기가 20MB 이하
- [ ] PDF가 정상적으로 열림
- [ ] 암호 보호가 없음

#### 업로드
- [ ] PDF 파일이 `public/pdfs/` 폴더에 저장됨
- [ ] 파일 경로가 정확함

#### 메타데이터
- [ ] `magazines.json`에 새 항목 추가
- [ ] 모든 필수 필드 입력 완료
- [ ] JSON 문법 오류 없음
- [ ] 호수 순서가 올바름
- [ ] 최신호 설정이 정확함

#### 테스트
- [ ] 개발 서버에서 새 호수 표시됨
- [ ] 썸네일이 자동 생성됨
- [ ] PDF 뷰어가 정상 작동
- [ ] 페이지 네비게이션 정상
- [ ] 모바일에서도 정상 표시

#### 배포
- [ ] Git에 변경사항 커밋
- [ ] GitHub에 푸시 완료
- [ ] 자동 배포 성공 확인
- [ ] 실제 사이트에서 확인

---

## 🔮 향후 개선 계획

### 관리자 기능 개선
- [ ] **웹 기반 관리 도구**: 브라우저에서 직접 동창회보 추가
- [ ] **드래그 앤 드롭 업로드**: 파일 업로드 간소화
- [ ] **자동 메타데이터 생성**: PDF에서 제목, 날짜 자동 추출
- [ ] **미리보기 기능**: 업로드 전 PDF 내용 확인

### 사용자 경험 개선
- [ ] **검색 기능**: 제목, 내용, 날짜별 검색
- [ ] **북마크 시스템**: 즐겨찾는 호수 관리
- [ ] **다운로드 통계**: 인기 호수 분석
- [ ] **댓글 시스템**: 독자 의견 수집

### 시스템 개선
- [ ] **자동 백업**: 정기적인 데이터 백업
- [ ] **버전 관리**: 동창회보 수정 이력 관리
- [ ] **접근 통계**: Google Analytics 연동
- [ ] **성능 최적화**: 대용량 PDF 최적화

---

## 💡 팁과 권장사항

### PDF 제작 시 권장사항
1. **일관된 레이아웃 사용**
2. **고화질 이미지 사용** (300DPI 이상)
3. **텍스트 선택 가능하도록 제작** (이미지 텍스트 지양)
4. **목차 북마크 포함** (향후 자동 목차 기능 활용)
5. **파일 크기 최적화** (이미지 압축 등)

### 효율적인 관리 방법
1. **정기적인 백업**: 매월 전체 프로젝트 백업
2. **버전 관리**: Git을 통한 변경 이력 관리  
3. **테스트 환경 활용**: 배포 전 충분한 테스트
4. **문서화**: 특별한 변경사항은 별도 기록
5. **사용자 피드백 수집**: 정기적인 만족도 조사

---

이 가이드를 따라하시면 동창회보를 체계적이고 효율적으로 관리할 수 있습니다.
궁금한 점이나 문제가 발생하면 개발팀에 문의해주세요.
