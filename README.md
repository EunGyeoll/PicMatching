# moodi

원하는 스타일의 사진을 남기고 싶은 사용자와, 자신의 스타일로 활동하는 촬영자를 연결하는 사진 촬영 예약 플랫폼입니다.

개인 간 거래로는 확인하기 어려운 포트폴리오·후기·응답 상태 같은 신뢰 정보를 플랫폼 안에서 보여주고, 예약까지 한 흐름으로 이어지는 걸 목표로 합니다.

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
