# STACK — 말싸움 연구소 (MSW Lab) 기술 스택

## 확정 스택

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| 프레임워크 | **Next.js 14 (App Router)** | 페이지 라우팅 + API Route 한번에 해결 |
| 스타일링 | **Tailwind CSS** | 빠른 UI 개발, Claude Code가 잘 다룸 |
| 상태관리 | **Zustand** | 가볍고 설정 적음, 채팅 state 관리용 |
| AI API | **Anthropic Claude API** (claude-sonnet-4-6) | 서비스 핵심 |
| 이미지 생성 | **html2canvas** | 결과 카드 PNG 다운로드 |
| 배포 | **Vercel** | Next.js 최적화, GitHub 연동 자동 배포 |
| 버전관리 | **GitHub** | 어디서든 이어서 작업 |

## 향후 추가 예정 (Phase 2)

| 영역 | 기술 | 용도 |
|------|------|------|
| DB + Auth | **Supabase** | 로그인, 대화 기록 저장 |
| ORM | **Prisma** | DB 스키마 관리 |

---

## 환경 변수

`.env.local` 파일에 아래 값 설정 필요:

```
ANTHROPIC_API_KEY=sk-ant-...
```

`.env.local`은 절대 GitHub에 올리지 않는다. `.gitignore`에 포함 확인 필수.

---

## 프로젝트 구조

```
msw-lab/
├── app/
│   ├── page.tsx              # 페이지1: 상황 설정
│   ├── chat/
│   │   └── page.tsx          # 페이지2: 말싸움 채팅
│   ├── result/
│   │   └── page.tsx          # 페이지3: 결과 리포트
│   └── api/
│       ├── chat/
│       │   └── route.ts      # 채팅 API (스트리밍)
│       └── analyze/
│           └── route.ts      # 분석 API
├── components/
│   ├── ChatBubble.tsx        # 말풍선 컴포넌트
│   ├── ScoreGauge.tsx        # 점수 게이지
│   ├── ResultCard.tsx        # 공유 이미지용 카드
│   └── CategoryScore.tsx     # 항목별 점수 카드
├── store/
│   └── chatStore.ts          # Zustand 상태 관리
├── lib/
│   └── anthropic.ts          # Anthropic 클라이언트 설정
├── .env.local                # 환경 변수 (Git 제외)
├── .gitignore
└── CLAUDE.md                 # Claude Code 작업 지침
```

---

## CLAUDE.md 내용 (Claude Code용 지침)

> 프로젝트 루트에 `CLAUDE.md` 파일을 만들어 Claude Code가 항상 참고하게 한다.

```markdown
# MSW Lab — Claude Code 작업 지침

## 프로젝트 개요
말싸움 연습 AI 서비스. PRD.md와 SPEC.md를 항상 참고할 것.

## 핵심 원칙
- 모바일 우선 반응형 디자인
- 로그인 없이 동작하는 MVP
- Phase 2 확장을 고려한 컴포넌트 설계 (로그인, DB 추가 용이하게)
- 환경변수는 반드시 서버사이드(API Route)에서만 사용

## 코딩 규칙
- TypeScript 사용
- 컴포넌트는 components/ 폴더에 분리
- 상태는 Zustand로 관리
- API 호출은 반드시 /api/ Route를 통해 (클라이언트에서 직접 Anthropic API 호출 금지)

## 작업 시 참고 파일
- PRD.md: 서비스 기획
- SPEC.md: 상세 기능 명세 (AI 프롬프트 포함)
- STACK.md: 기술 스택 및 폴더 구조
- TASK.md: 현재 작업 목록
```
