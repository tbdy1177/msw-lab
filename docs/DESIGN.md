# DESIGN — 말싸움 연구소 디자인 정책

## 컬러 시스템

| 용도 | 값 |
|------|----|
| 배경 | `amber-50` |
| 카드/바 배경 | `white` |
| 포인트 컬러 | `amber-400` (hover: `amber-500`) |
| 보조 텍스트 | `gray-400` ~ `gray-500` |
| 위험/종료 | `red-400` |

---

## 라인 최소화 원칙

- **카드, 입력창, 말풍선, 모달, 헤더/푸터 바 모두 border 없음**
- 구분은 배경색 차이와 `shadow-sm`만으로 처리
- 예외: 버튼 중 outlined 스타일(취소 버튼 등)은 `border-2 border-amber-200` 유지

---

## 입력 필드 스타일

- 기본: `bg-amber-50`, border 없음 (시각적으로 배경만)
- 포커스: `border-2 border-amber-400`
- 비포커스: `border-2 border-amber-100`
- 플레이스홀더: `#000000` 30% 불투명도 (`text-black/30`)
- 텍스트: `text-sm font-medium`

> 포커스 전후 레이아웃 점프 방지를 위해 비포커스 시에도 `border-2`를 유지하고 색상만 전환한다.

---

## 레이아웃 구조

### 전체 페이지
- 모바일 우선, 콘텐츠 max-width: `max-w-lg` (중앙 정렬)

### 채팅 화면 헤더/푸터
- **배경(BG)은 full width**로 확장
- 내부 콘텐츠는 `max-w-lg mx-auto`로 제한

---

## 채팅 입력창

- `<textarea>` 사용 (멀티라인 지원)
- 초기 높이: `42px` (1줄, `py-2.5` + `text-sm` 기준)
- 최대 높이: `130px` (약 5줄)
- 초과 시 `overflow-y: auto` (스크롤)
- Enter: 전송 / Shift+Enter: 개행

---

## 로고

- 원본: `img/` 폴더 보관
- 배포용: `public/logo.png` (70% 리사이즈 적용본)
- 화면 표시 크기: `w-52 sm:w-64`

---

## 캐릭터 프로필 이미지

- AI 말풍선 옆 아바타로 사용
- 이미지: `public/charactor_female_0[1-3].jpg`, `public/charactor_male_0[1-3].jpg`
- 성별 유추: `target` + `situation` 텍스트에서 키워드 매칭
  - 여성 키워드: 엄마, 어머니, 여자친구, 여친, 언니, 누나, 이모, 고모, 할머니, 아줌마, 아내, 와이프, 딸, 여동생 등
  - 남성 키워드: 아빠, 아버지, 남자친구, 남친, 오빠, 형, 삼촌, 할아버지, 남편, 아들, 남동생 등
  - 유추 불가 시: 6개 중 랜덤
- 선택된 이미지는 `chatStore.characterImage`에 저장하여 세션 동안 고정

---

## 로딩 텍스트 애니메이션

- 회색 → amber → 회색 그라디언트가 좌→우로 흐르는 shimmer 효과
- CSS 클래스: `.shimmer-text` (`globals.css` 정의)
- 결과 분석 로딩 화면에 적용
