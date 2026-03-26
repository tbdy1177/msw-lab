# TASK — 말싸움 연구소 (MSW Lab) 작업 목록

> Claude Code에 붙여넣어 작업을 지시할 때 사용한다.
> 완료된 항목은 [x]로 체크한다.

---

## Phase 1: 프로젝트 초기 세팅

- [ ] T01. Next.js 14 프로젝트 생성 (App Router, TypeScript, Tailwind CSS)
- [ ] T02. 필요한 패키지 설치 (zustand, html2canvas, @anthropic-ai/sdk)
- [ ] T03. .env.local 템플릿 생성 및 .gitignore 설정
- [ ] T04. GitHub 저장소 생성 및 초기 커밋
- [ ] T05. lib/anthropic.ts — Anthropic 클라이언트 설정
- [ ] T06. store/chatStore.ts — Zustand 스토어 초기 구조 작성
- [ ] T07. CLAUDE.md 프로젝트 루트에 생성

---

## Phase 2: API Route 구현

- [ ] T08. /api/chat/route.ts — 채팅 스트리밍 API 구현
  - 시스템 프롬프트: SPEC.md 참고
  - 스트리밍 응답 처리
- [ ] T09. /api/analyze/route.ts — 분석 API 구현
  - JSON 형식 응답 파싱
  - SPEC.md의 분석 프롬프트 사용

---

## Phase 3: 페이지 구현

- [ ] T10. 페이지1 (/) — 상황 설정 페이지
  - 대상 입력 필드
  - 상황 텍스트에어리어
  - 유효성 검사 + 버튼 활성화 로직
  - 시작하기 버튼 → /chat 이동

- [ ] T11. 페이지2 (/chat) — 말싸움 채팅 페이지
  - 상황 요약 토글
  - 채팅 말풍선 UI (ChatBubble 컴포넌트)
  - AI 타이핑 인디케이터
  - 스트리밍 응답 처리
  - AI 종료 제안 감지 + 모달
  - [여기서 끝내기] 버튼 + 모달
  - /result 이동

- [ ] T12. 페이지3 (/result) — 결과 리포트 페이지
  - 종합 점수 + 등급 표시 (ScoreGauge 컴포넌트)
  - 항목별 점수 카드 (CategoryScore 컴포넌트)
  - 잘한 점 / 개선할 점 섹션
  - 분석 로딩 스켈레톤 UI

---

## Phase 4: 공유 이미지 기능

- [ ] T13. ResultCard 컴포넌트 — 공유용 카드 UI (1080x1080 기준)
  - 로고 + 점수 + 등급 + 한줄 요약
  - 브랜드 컬러 그라데이션 배경
- [ ] T14. html2canvas 연동 — PNG 다운로드 기능
- [ ] T15. [다시 하기] 버튼 → state 초기화 후 / 이동

---

## Phase 5: UI 마무리 & 배포

- [ ] T16. 전체 모바일 반응형 점검
- [ ] T17. 에러 처리 — 토스트 메시지 구현
- [ ] T18. 로딩 상태 전반 점검 (스켈레톤, 스피너)
- [ ] T19. Vercel 배포 설정 + 환경변수 등록
- [ ] T20. 최종 테스트 (전체 플로우 1회 완주)

---

## Claude Code 지시 예시

### 프로젝트 시작할 때
```
CLAUDE.md, PRD.md, SPEC.md, STACK.md, TASK.md를 모두 읽고 파악한 뒤,
T01부터 T07까지 순서대로 진행해줘.
완료된 항목은 TASK.md에서 [x]로 체크해줘.
```

### 이어서 작업할 때
```
TASK.md를 확인하고, 완료되지 않은 다음 항목부터 이어서 진행해줘.
```

### 특정 기능만 만들 때
```
SPEC.md의 페이지2 채팅 명세를 참고해서 T11을 구현해줘.
```
