# 🧊 Fridge Manager Service (Frontend)

스마트한 유통기한 관리로 식재료 폐기는 줄이고 소비 효율을 높여주는 냉장고 관리 서비스의 프론트엔드(React Native/Expo) 프로젝트입니다.

---

## 🛠 Tech Stack

*   **Core:** React Native (v0.81.5), Expo (v54.0.35), Expo Router (v6)
*   **Language:** TypeScript
*   **Styling:** NativeWind (Tailwind CSS for React Native)
*   **State Management:** Zustand (`useAuthStore`, `useThemeStore`, `useLayoutStore`, `useHomeStore`)
*   **Form & Validation:** React Hook Form, Zod
*   **Network:** Axios (Custom Interceptors 처리)
*   **Local Storage:** AsyncStorage (웹 환경은 localStorage 대응)
*   **UI Components:** `@gorhom/bottom-sheet`, Phosphor Icons, Expo Vector Icons

---

## ✨ Key Features

1.  **스마트 냉장고 및 식재료 관리 (Home)**
   *   보관 방식(전체/냉장/냉동/실온)별 탭 필터링 및 텍스트 검색 기능.
   *   유통기한 임박순(`EXPIRE`) 및 카테고리 이름순(`CATEGORY`) 정렬 지원.
   *   모달(BottomSheet) 기반의 직관적인 식재료 등록 및 수정 인터페이스.

2.  **장보기 캘린더 및 체크리스트 (Shopping List)**
   *   월간 달력(Calendar) 그리드를 통한 날짜별 장보기 일정 한눈에 보기.
   *   일간 장보기 리스트 조회, 항목 추가/수정/삭제 및 완료 상태 토글(Todo) 기능.

3.  **월간 소비 및 폐기 통계 (Dashboard)**
   *   이번 달 소비/폐기 금액 현황 및 비율(Rate) 데이터 제공.
   *   유통기한 임박 및 만료 상품 모아보기 (모달 연동 상세 내역 확인).
   *   가장 많이 소비한 상품 TOP 3 랭킹 제공.

4.  **권한 분리 및 관리자 시스템 (Admin & Auth)**
   *   Zustand와 AsyncStorage를 결합한 토큰 기반(Stateless) 세션 유지 및 401 예외 처리.
   *   **사용자(USER):** 프로필 관리, 비밀번호 변경, 1:1 문의 작성, 공지사항 조회.
   *   **관리자(ADMIN):** 전용 반응형 대시보드(데스크탑/모바일 사이드바), 전체 회원 권한 제어 및 삭제, 공지사항 등록, 1:1 문의 답변 기능.
   *   기기 시스템 환경에 맞춘 다크/라이트 테마 자동 감지 및 수동 토글 지원.

---

## 📂 Project Structure

```text
├── api/             # Axios 인스턴스 및 도메인/권한별 API (user, admin)
├── app/             # Expo Router 기반 파일 라우팅 폴더 (auth, admin, shopping, stats 등)
├── assets/          # 폰트, 로고, 스플래시 이미지 및 아이콘 자산
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── common/      # 버튼, 인풋, 카드, 모달, 뱃지, 페이지네이션 등 공통 요소
│   ├── domain/      # 홈(Home), 통계(Stats), 쇼핑(Shopping) 등 도메인별 컴포넌트
│   └── layout/      # 반응형 헤더/푸터 및 관리자 사이드바 레이아웃
├── constants/       # 상수 및 프로필 이미지 매핑 데이터
├── hooks/           # 레이아웃 셋업 등 커스텀 훅
├── schemas/         # Zod를 활용한 폼 유효성 검사 스키마 (Auth, Product, Notice 등)
├── stores/          # Zustand 전역 상태 관리 (Auth, Theme, Layout, Home)
└── types/           # TypeScript 인터페이스 및 타입 정의
```

---

## 🚀 Getting Started

### 1. Prerequisite
- Node.js (v18 이상 권장)
- npm, yarn 또는 pnpm
- Expo Go 앱 (모바일 테스트용)

### 2. Installation
프로젝트 디렉토리로 이동하여 의존성 패키지를 설치합니다.

```bash
npm install
```

### 3. Environment Variables
프로젝트 루트에 `.env` 파일을 생성하고 백엔드 API 주소를 설정합니다.

```dotenv
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 4. Run Development Server
엑스포 로컬 개발 서버를 실행합니다.

```bash
# 기본 실행 (Expo Go QR 코드 제공)
npm start

# 플랫폼별 개별 실행
npm run android
npm run ios
npm run web
```