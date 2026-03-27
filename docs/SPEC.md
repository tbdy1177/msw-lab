# SPEC — 말싸움 연구소 (MSW Lab) 기능 명세

## 페이지 구조

```
/ (홈 = 상황 설정)
/chat (말싸움 채팅)
/result (결과 리포트)
```

---

## 페이지 1: 상황 설정 (`/`)

### 화면 구성
- 서비스 로고 (`public/logo.png`, 표시 크기 `w-52 sm:w-64`)
- 입력 폼 (카드 형태, border 없음):
  - [대상] 텍스트 입력 (placeholder: "예: 직장 상사, 남자친구, 친구")
  - [상황] 텍스트에어리어 (placeholder: "어떤 상황인지 설명해주세요. 예: 친구가 약속을 또 어겼는데 자기 잘못이 아니라고 우김")
- [말싸움 시작하기] 버튼

### 동작
1. 사용자가 대상 + 상황 입력 후 버튼 클릭
2. 입력값 유효성 검사 (둘 다 비어있으면 버튼 비활성화)
3. 입력값을 Zustand store에 저장
4. `/chat` 페이지로 이동

---

## 페이지 2: 말싸움 채팅 (`/chat`)

### 화면 구성
- **헤더** (BG full width, 콘텐츠 max-w-lg):
  - 뒤로가기 버튼
  - 대상명 + 상황 토글 버튼
  - [여기서 끝내기] 버튼
- **채팅 영역** (max-w-lg):
  - AI 메시지: 왼쪽 말풍선 (흰색, shadow-sm, border 없음)
  - 사용자 메시지: 오른쪽 말풍선 (amber-400)
  - AI 프로필 아이콘: 캐릭터 이미지 (성별 유추 → 랜덤 선택, 상세는 DESIGN.md 참고)
  - AI 타이핑 중: 점 3개 바운스 애니메이션
- **입력바** (BG full width, 콘텐츠 max-w-lg):
  - textarea 입력 필드 (1줄~5줄, 상세는 DESIGN.md 참고)
  - [전송] 버튼

### 동작
1. 페이지 진입 시 AI가 먼저 선제 발언
2. 캐릭터 이미지 1회 선택 후 store에 고정
3. 사용자 입력 → API 호출 → AI 응답 스트리밍
4. AI가 종료 제안("결과를 볼까요?" 포함) 시 확인 모달 자동 노출
5. [여기서 끝내기] 클릭 → 확인 모달 → `/result` 이동
6. Enter: 전송 / Shift+Enter: 개행

### 데이터 관리
- 대화 내역: `messages[]` (Zustand)
- 캐릭터 이미지: `characterImage` (Zustand, 세션 동안 고정)
- 형태: `{ role: 'user' | 'assistant', content: string, timestamp: Date }`

---

## 페이지 3: 결과 리포트 (`/result`)

### 로딩 상태
- 스켈레톤 UI (`animate-pulse`) + 롤링 텍스트
- 롤링 메시지 5개, 3초 간격, shimmer 텍스트 애니메이션 적용
- 상세는 POLICY.md 참고

### 화면 구성 (분석 완료 후)

#### 섹션 A: 종합 점수
- 원형 게이지 + 점수 숫자 (0~100)
- 등급 라벨: 점수 기반 고정 적용 (POLICY.md 등급 체계 참고)

#### 섹션 B: 항목별 분석
분석 항목 4가지 (각 항목: 점수 + 바 + 2~3줄 설명, border 없음):
1. **논리력** — 주장의 일관성과 근거
2. **감정 조절** — 침착하게 대응했는지
3. **표현력** — 하고 싶은 말을 명확하게 전달했는지
4. **설득력** — 상대방 입장을 변화시킬 수 있었는지

#### 섹션 C: 피드백
- **잘한 점** (최소 2개)
- **개선할 점 + 다음에 이렇게 해보세요** (최소 2개)

#### 섹션 D: 공유 이미지
- 공유 카드 미리보기 토글
- [이미지 저장하기] → html2canvas로 PNG 다운로드
- [다시 하기] → `/`로 이동

### AI 분석 프롬프트
```
아래 말싸움 대화를 분석해주세요.

대상: {대상}
상황: {상황}
대화내역: {messages}

다음 JSON 형식으로만 응답하세요:
{
  "totalScore": 75,
  "grade": "참고용 (프론트에서 덮어씀)",
  "categories": [
    { "name": "논리력", "score": 80, "description": "..." },
    { "name": "감정 조절", "score": 70, "description": "..." },
    { "name": "표현력", "score": 75, "description": "..." },
    { "name": "설득력", "score": 65, "description": "..." }
  ],
  "strengths": ["...", "..."],
  "improvements": [
    { "point": "...", "tip": "다음에는 이렇게 해보세요: ..." },
    { "point": "...", "tip": "다음에는 이렇게 해보세요: ..." }
  ],
  "oneLineSummary": "감정은 잘 잡았지만 논리로 밀어붙이는 힘이 아쉬웠어요"
}
```

### 공유 이미지 스펙
- 크기: 1080x1080px (정사각형, 인스타그램 최적화)
- 내용: 로고 + 점수 + 등급 + 한줄 요약 + "msw-lab.com"

---

## API 연동

### 사용 API
- **Anthropic Claude API** (claude-sonnet-4-6 모델)
- Next.js API Route로 키 보호 (`/api/chat`, `/api/analyze`)

### `/api/chat`
```
POST /api/chat
Body: { messages: Message[], situation: string, target: string }
Response: 스트리밍 텍스트
```

### `/api/analyze`
```
POST /api/analyze
Body: { messages: Message[], situation: string, target: string }
Response: JSON (분석 결과)
```

---

## 에러 처리

| 상황 | 처리 |
|------|------|
| API 응답 실패 | "잠시 문제가 생겼어요. 다시 시도해주세요" 토스트 |
| 입력값 없음 | 버튼 비활성화 + 인라인 안내 문구 |
| 분석 중 로딩 | 스켈레톤 UI + 롤링 메시지 5종 |
| 이미지 저장 실패 | "이미지 저장에 실패했어요. 스크린샷을 이용해주세요" |
