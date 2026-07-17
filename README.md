# moodi

원하는 스타일의 사진을 남기고 싶은 사용자와 촬영자를 연결하는 사진 촬영 예약 플랫폼입니다.
자세한 제품/기술 명세는 [`docs/MVP_IMPLEMENTATION_SPEC.md`](docs/MVP_IMPLEMENTATION_SPEC.md)를 참고하세요.

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

## 기술 스택

- Next.js (App Router) / TypeScript
- Tailwind CSS
- Supabase (PostgreSQL / Auth / Storage)
