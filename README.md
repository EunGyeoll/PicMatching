# moodi

원하는 스타일의 사진을 남기고 싶은 사용자와, 자신의 스타일로 활동하는 촬영자를 연결하는 사진 촬영 예약 플랫폼입니다.

개인 간 거래로는 확인하기 어려운 포트폴리오·후기·응답 상태 같은 신뢰 정보를 플랫폼 안에서 보여주고, 예약까지 한 흐름으로 이어지는 걸 목표로 합니다.

## 배포

[pic-matching-beta.vercel.app](https://pic-matching-beta.vercel.app)

## 주요 기능

- 이메일 / 카카오 소셜 로그인·회원가입
- 촬영자 등록(활동명·소개·활동 지역·포트폴리오)과 프로필 사진 관리
- 촬영 서비스 등록·수정·삭제·공개 전환 — 가격·촬영 시간·포함 사항을 촬영자가 자유롭게 구성(고정 등급 없음)
- 목적·무드·지역 필터로 사진/촬영자 탐색
- 촬영자 상세 페이지(포트폴리오, 서비스 목록, 후기 수)
- 서비스 선택 → 날짜·시간 선택 → 장소 선택 → 확인으로 이어지는 예약 플로우
- 상태별(요청중/예정/완료/취소) 예약 내역 조회
- 로그인하지 않아도 홈·탐색·촬영자 상세 화면은 둘러볼 수 있음

## 기술적으로 신경 쓴 부분

- Row Level Security로 촬영자/사용자 데이터 접근을 분리하고, 공개되어야 할 정보의 노출 범위를 실제 계정으로 직접 검증
- Supabase Auth의 이메일·카카오 소셜 로그인 연동 — 계정 식별자(UUID) 기준 자동 계정 연결(identity linking) 동작까지 고려한 설계
- DB 스키마·함수 변경을 `supabase/migrations/`에 파일로 남겨 히스토리 추적
- 기능마다 실제 시드 계정으로 엔드투엔드 동작(가입 → 등록 → 탐색 → 예약)을 직접 확인

## 문서

- 제품/기술 명세: [`docs/MVP_IMPLEMENTATION_SPEC.md`](docs/MVP_IMPLEMENTATION_SPEC.md)
- 진행하며 내린 결정과 그 이유: [`docs/decision-log.md`](docs/decision-log.md)

## 시작하기

패키지 매니저는 npm을 사용합니다.

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 환경변수

`.env.example`을 복사해 `.env.local`을 만들고 Supabase 프로젝트 값을 채워주세요.

```bash
cp .env.example .env.local
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 전용 키입니다. 절대 클라이언트 코드나 커밋에 노출하지 마세요.

## 기술 스택

- Next.js (App Router) / TypeScript
- Tailwind CSS
- Supabase (PostgreSQL / Auth / Storage)
