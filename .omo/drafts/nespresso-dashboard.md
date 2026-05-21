# Draft: Nespresso 캡슐 추천 대시보드

## Requirements (confirmed)
- 캡슐 카드: 이름, 강도, 맛/향, 가격, 컵 사이즈
- 추천 목록: 추천 이유 요약 포함
- 스택: 순수 HTML + CSS + JS (프레임워크 없음)

## Technical Decisions
- 파일 구조: `nespresso/index.html`, `nespresso/style.css`, `nespresso/app.js`
- 기존 `dashboard/` 와 완전히 별개 프로젝트
- 색상 테마: 커피 브라운 계열 (#3d1f0a, #c8a26a, #f5f0e8 등)

## Layout Plan
```
┌────────────────────────────────────────────────────┐
│  #header: 로고 + 검색바                              │
├──────────────┬─────────────────────────────────────┤
│  #filter     │  #capsule-grid                      │
│  필터 패널   │  캡슐 카드 그리드                     │
│  (좌 220px)  │  (중 1fr, 2~3열)                    │
└──────────────┴─────────────────────────────────────┘
│  #recommendation-panel: 추천 패널 (하단 전폭)        │
└────────────────────────────────────────────────────┘
```

## Capsule Data Fields
- id, name, line (Original/Vertuo)
- intensity (1-13), intensityMax (10 or 13)
- flavorNotes: string[] (e.g. ['과일향', '꽃향'])
- cupSize: 'espresso' | 'lungo' | 'gran lungo' | 'mug' | 'alto'
- price (원/캡슐), origin (국가)
- roast: 'light' | 'medium' | 'dark'
- recommended: boolean, recommendReason: string

## Open Questions
- 추천 로직: 정적(하드코딩) vs 동적(사용자 취향 퀴즈)?
- 캡슐 수: 10개 고정? 필터로 줄어드는 형태?
- 한국 가격 기준? (네스프레소 코리아 기준으로 할 예정)

## Scope Boundaries
- INCLUDE: 카드 그리드, 필터(강도/라인/컵사이즈), 추천 패널, 강도 시각화 바
- EXCLUDE: 백엔드, 장바구니, 실제 구매 기능, 로그인, 외부 API
