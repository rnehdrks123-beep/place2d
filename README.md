# 📝 Dy Month 플레이스 진단시스템 (Dy Month Place Diagnosis System)

실시간 네이버 플레이스 가중치 계산, 리뷰 평판 최적화 도구 및 12가지 마케팅 솔루션 적용 시 3개월 후 예상 매출 성장률을 도출하는 정밀 진단 풀스택 애플리케이션입니다.

본 프로젝트는 **React x Vite (프론트엔드)**와 **Express (백엔드)**가 결합된 풀스택 구조이며, **Google Gemini AI 2.0/3.5** 모델을 활용해 매장 데이터에 기반한 정밀 분석 및 마케팅 추천 답글을 실시간으로 산출합니다.

---

## ✨ 주요 기능 및 특징

1. **상권 및 매장 기본 정보 입력**: 매장명, 업종/대표 메뉴, 현재 방문자 리뷰 수, 현재 블로그 리뷰 수를 바탕으로 데이터 세부 비교
2. **실시간 AI 평판 정밀 진단**:
   - 네이버 플레이스 상위 노출 결정적 4대 지표(리뷰 활성도, 키워드 적합도, 최신성 지수, 체류 시간) 매칭
   - 방문자 리뷰 수와 블로그 리뷰 수에 대해 AI 분석가가 맞춤형 문제점 진단 및 기대효과 단락 자동 서술
   - 실제 매장에서 즉시 활용할 수 있는 감동적인 맞춤 답글 예시 2종 자동 생성
3. **12가지 Dy Month 시그니처 마케팅 솔루션 제안**:
   - Google Business Profile 신규 등록 및 리뷰작성 월 10건, 홍보용 영상 제작 등 맞춤형 12대 정밀 액션 패키지 제안
4. **예상 높은 매출 상승률 도출**:
   - 마케팅 솔루션 적용 조건 하에서 3개월 후의 구체적인 매출 상승 퍼센트(%) 범위 예측 및 결과 출력
5. **리포트 이미지 저장 기능**:
   - 생성된 진단 리포트(1/2) 및 솔루션 제안서(2/2)를 원클릭으로 깔끔한 PNG 이미지 파일로 렌더링 후 다운로드 지원 (`html2canvas` 연동)
6. **네이버 플레이스 스타일링 테마 적용**:
   - 어둡지 않고 가독성 높은 네이버 플레이스 고유의 편안하고 신뢰감 주는 에메랄드(Emerald) / 그린 톤의 세련된 UI/UX 디자인 탑재

---

## 🛠 사용된 스택 및 기술

- **Frontend**: React (v18+), Vite, Tailwind CSS (v4), Motion (for React)
- **Backend**: Express, Node.js (TypeScript - Running via `tsx` / Built with `esbuild`)
- **AI Engine**: `@google/genai` (Google Gemini 3.5 Flash Model)
- **Utility**: `html2canvas` (웹 엘리먼트를 PNG 이미지로 캡처/다운로드)

---

## 🚀 로컬 환경 실행 가이드 (Local Installation & Running)

로컬 컴퓨터에서 코드를 다운받아 직접 제어하고 서비스하는 방법은 다음과 같습니다.

### 1. Prerequisites (사전 준비)
Node.js 설치가 필요합니다. (v18 이상 권장)

### 2. 의존성 패키지 설치
프로젝트 루트 디렉토리에서 터미널을 열고 다음 명령어를 실행합니다:
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 아래와 같이 발급받은 **Gemini API Key**를 입력합니다. (Gemini API 키는 Google AI Studio에서 쉽게 무료/유료 키를 설정할 수 있습니다.)

```env
# .env 파일 생성 후 기입
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 4. 개발 서버 실행 (Development Mode)
Express 백엔드 서버와 Vite 프론트엔드가 동시에 켜집니다:
```bash
npm run dev
```
- 브라우저를 열고 `http://localhost:3000`에 접속하여 원활한 시뮬레이션을 즐길 수 있습니다. (기본 설정 포트: `3000`)

### 5. 프로덕션 빌드 및 프로덕션 실행 (Production)
```bash
# 1. 프론트엔드 정적 파일 빌드 및 백엔드 typescript 최적화 컴파일(esbuild)
npm run build

# 2. 빌드가 완료되면 번들링된 단일 CJS 파일 기반으로 고속 가동
npm run start
```

---

## 📂 프로젝트 구조 (Project Directory Structure)

```text
├── src/
│   ├── components/
│   │   └── ReviewReport.tsx    # 상세 평판 진단서 & PDF/PNG 다운로드 및 솔루션 제안 UI
│   ├── App.tsx                 # 매장 정보 입력 폼, 메인 상태 관리 및 실시간 REST API 요청 처리
│   ├── main.tsx                # React 렌더링 최초 진입점
│   ├── index.css               # Pretendard 폰트 및 Tailwind CSS 로드 및 전역 테마 지정
│   └── lib/
│       ├── gemini.ts           # 클라이언트와 백엔드 간 연계용 타입 선언 및 API 호출 인터페이스
│       └── utils.ts            # 클래스 머지 결합 헬퍼 함수 (cn)
├── server.ts                   # Express 풀스택 백엔드 및 실시간 Gemini API 프록시 라우트 설계
├── package.json                # 프로젝트 메타데이터 및 build/dev/start 스크립트 명세
├── vite.config.ts              # Vite 설정
└── tsconfig.json               # TypeScript 컴파일 환경 설정
```

---

## 🖥 깃허브(GitHub) 저장소 업로드 방법 2가지

이 프로젝트를 자신의 GitHub 저장소에 업로드하고 영구 관리하는 방법입니다.

### 방법 1. AI Studio의 편리한 내장 기능 사용하기 [추천]
Google AI Studio 환경에서는 코드를 직접 수동 업로드하지 않고 연동을 지원합니다.
1. 우측 상단의 **설정 아이콘** 또는 **메뉴 아이콘**을 클릭합니다.
2. **Export to GitHub** (GitHub로 내보내기) 또는 **Download ZIP** (압축 파일 다운로드) 메뉴를 선택합니다.
3. GitHub 계정을 연동한 뒤, 원하는 Repository로 한 번에 내보내기(\*Export)를 실행하여 커밋할 수 있습니다.

### 방법 2. 로컬 컴퓨터를 통한 수동 Git CLI 등록
압축파일(ZIP)을 내려받았거나 직접 원격 업로드를 원할 경우:
1. GitHub 홈페이지에서 신규 레포지토리(Repository)를 만듭니다. (예: `dy-month-review-diagnosis`)
2. 로컬 터미널에서 다음 명령어를 순서대로 실행합니다:

```bash
# git 초기화 및 전체 소스코드 준비
git init

# 모든 파일 추가 (.gitignore에 기재된 node_modules, build 폴더 등은 자동 제외)
git add .

# 첫 정식 커밋 생성
git commit -m "feat: Dy Month 플레이스 진단기 에메랄드 테마 및 12대 마케팅 솔루션 최종 구현"

# 메인 브랜치 설정
git branch -M main

# 원격 저장소 주소 바인딩 (자신의 깃허브 아이디 및 레포지토리명 대입)
git remote add origin https://github.com/사용자아이디/레포지토리명.git

# 원격 레포지토리로 push 완료!
git push -u origin main
```

---

*본 프로그램의 플레이스 분석 결과물은 최적화 알고리즘 마케팅 가중에 기초한 시뮬레이션 진단 예측서입니다.*
