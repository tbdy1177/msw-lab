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
- docs/PRD.md: 서비스 기획
- docs/SPEC.md: 상세 기능 명세 (AI 프롬프트 포함)
- docs/DESIGN.md: 디자인 정책 (컬러, 라인 원칙, 레이아웃, 컴포넌트 스타일)
- docs/POLICY.md: 서비스 정책 (등급 체계, 로딩 메시지, AI 프롬프트 정책)
- docs/STACK.md: 기술 스택 및 폴더 구조
- docs/TASK.md: 현재 작업 목록
