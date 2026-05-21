# 네스프레소 캡슐 추천 대시보드 구현 계획

## TL;DR

> **목표**: 네스프레소 캡슐 12종을 카드로 시각화하고, 취향 필터 기반 추천 패널을 제공하는 단일 페이지 대시보드를 순수 HTML+CSS+JS로 구현한다.
>
> **산출물**:
> - `nespresso/index.html` — 레이아웃 + 4구역 마크업
> - `nespresso/style.css` — 커피 테마 디자인 토큰 + 모든 컴포넌트 스타일
> - `nespresso/app.js` — 캡슐 데이터 + 렌더링 + 필터 + 추천 로직
>
> **예상 총 소요**: **50~70분** (Task 5개, 각 10~15분)
> **병렬 실행**: NO — Task 1 → 2 → 3 → 4 → 5 순서 고정

---

## Context

### 원본 요청
네스프레소 캡슐 커피 추천 대시보드 (HTML+CSS+JS)
- 네스프레소 캡슐 카드 (맛, 가격, 강도, ...)
- 추천 목록 (추천 이유 요약 포함)

### 제품 데이터 기준
**네스프레소 오리지널 라인** (Original Line) — 에스프레소 머신용
- 캡슐 가격: 약 850~1,100원/캡슐 (10개입 기준)
- 강도 스케일: 1~13

**네스프레소 버츄오 라인** (Vertuo Line) — 버츄오 머신용
- 캡슐 가격: 약 1,000~1,300원/캡슐
- 강도 스케일: 1~11

### 현재 상태
- `nespresso/` 디렉터리 없음 — 전체 신규 생성
- 기존 `dashboard/` 와 완전히 독립적인 프로젝트

---

## 파일 구조

```
nespresso/
├── index.html   ← Task 1: 레이아웃 + 마크업
├── style.css    ← Task 1: 커피 테마 디자인 + 모든 스타일
└── app.js       ← Task 2~5: 데이터 · 렌더 · 필터 · 추천 · 검색
```

---

## 화면 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│  #header: ☕ NESPRESSO GUIDE + 검색바                     │
├────────────┬─────────────────────────────────────────────┤
│  #sidebar  │  #capsule-grid                              │
│  필터 패널  │  캡슐 카드 그리드 (2~3열)                    │
│  (220px)   │  각 카드: 이름, 강도바, 향 태그, 가격, 컵    │
└────────────┴─────────────────────────────────────────────┘
│  #recommend: 추천 패널 (하단 전폭, 3~4개 추천 카드)         │
└──────────────────────────────────────────────────────────┘
```

---

## 캡슐 카드 구조

```
┌─────────────────────────┐
│  [라인 뱃지] Original   │
│  Ristretto              │
│  ████████████░ 12/13    │  ← 강도 바
│  🌰 초콜릿  🌿 우디       │  ← 향 태그
│  ☕ Espresso             │
│  ₩900 / 캡슐            │
└─────────────────────────┘
```

---

## 추천 로직

```
사용자 필터 상태 → 매칭 점수 계산
  강도 범위 일치: +3점
  라인 일치: +2점
  컵 사이즈 일치: +2점
  → 상위 3개 캡슐을 추천 패널에 표시
  → 각 추천 이유 자동 생성 ("강도 XX로 진한 맛을 선호하신다면...")
```

---

## Must Have
- 캡슐 12종 카드 렌더링 (Original 8종 + Vertuo 4종)
- 강도 시각화 바 (filled segments)
- 향 태그 chips (`.flavor-tag`)
- 필터: 라인(Original/Vertuo), 강도 범위(슬라이더), 컵 사이즈
- 추천 패널: 상위 3개 + 추천 이유 텍스트
- 이름 검색

## Must NOT Have
- 외부 CSS 프레임워크 금지
- 외부 JS 라이브러리 금지
- 백엔드 · 장바구니 · 구매 기능 없음

---

## 색상 테마 (커피 테마)

```css
--bg:        #1c0f07;   /* 다크 에스프레소 */
--surface:   #2d1a0e;   /* 로스팅 브라운 */
--surface-2: #3d2512;   /* 미디엄 브라운 */
--border:    #5c3720;   /* 테두리 */
--text:      #f5f0e8;   /* 크림 화이트 */
--muted:     #b8956a;   /* 카라멜 */
--accent:    #c8a26a;   /* 골드 */
--accent-h:  #e2c090;   /* 밝은 골드 */
--original:  #8b4513;   /* Original 라인 - 시나몬 */
--vertuo:    #1a3a5c;   /* Vertuo 라인 - 딥 블루 */
```

---

## Execution Strategy

```
Task 1 (~12분): nespresso/ 생성 + index.html + style.css 완성
  └── 산출물: 커피 테마 다크 레이아웃 정적 페이지

Task 2 (~12분): app.js — capsulesData 배열 + renderCapsuleCards()
  └── 산출물: 12개 캡슐 카드 JS 렌더링 (강도 바 + 향 태그 포함)

Task 3 (~12분): app.js — 필터 기능 (라인 / 강도 / 컵사이즈)
  └── 산출물: 필터 선택 시 카드 그리드 실시간 업데이트

Task 4 (~12분): app.js — 추천 로직 + renderRecommendations()
  └── 산출물: 필터 상태 기반 상위 3개 추천 + 이유 텍스트

Task 5 (~10분): app.js — 검색 + 정렬 + 필터 초기화
  └── 산출물: 이름 검색, 강도순/가격순 정렬, 전체 초기화 버튼
```

---

## TODOs

---

- [ ] 1. `nespresso/` 폴더 생성 + `index.html` + `style.css` 완성

  **What to do**:

  1. `nespresso/` 디렉터리 생성, `index.html` · `style.css` · `app.js`(빈 파일) 생성

  2. `nespresso/index.html` 전체 작성:
  ```html
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>☕ Nespresso Guide</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header id="header">
      <div class="header-inner">
        <h1>☕ Nespresso Guide</h1>
        <input type="search" id="search-input" placeholder="캡슐 이름 검색...">
        <select id="sort-select">
          <option value="default">기본 순서</option>
          <option value="intensity-asc">강도 낮은 순</option>
          <option value="intensity-desc">강도 높은 순</option>
          <option value="price-asc">가격 낮은 순</option>
          <option value="price-desc">가격 높은 순</option>
        </select>
      </div>
    </header>

    <div id="main-layout">
      <aside id="sidebar">
        <h2>필터</h2>

        <div class="filter-group">
          <label class="filter-label">라인</label>
          <div class="filter-chips" id="filter-line">
            <button class="chip active" data-value="all">전체</button>
            <button class="chip" data-value="original">Original</button>
            <button class="chip" data-value="vertuo">Vertuo</button>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">강도</label>
          <div class="range-wrapper">
            <input type="range" id="filter-intensity" min="1" max="13" value="13">
            <span id="intensity-display">1 ~ 13</span>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">컵 사이즈</label>
          <div class="filter-chips" id="filter-cup">
            <button class="chip active" data-value="all">전체</button>
            <button class="chip" data-value="espresso">Espresso</button>
            <button class="chip" data-value="lungo">Lungo</button>
            <button class="chip" data-value="gran lungo">Gran Lungo</button>
            <button class="chip" data-value="mug">Mug</button>
          </div>
        </div>

        <button id="reset-btn">필터 초기화</button>
      </aside>

      <main id="capsule-grid"></main>
    </div>

    <section id="recommend">
      <h2>✨ 추천 캡슐</h2>
      <div id="recommend-list"></div>
    </section>

    <script src="app.js" defer></script>
  </body>
  </html>
  ```

  3. `nespresso/style.css` 전체 작성:
  ```css
  /* ── 디자인 토큰 ── */
  :root {
    --bg:        #1c0f07;
    --surface:   #2d1a0e;
    --surface-2: #3d2512;
    --border:    #5c3720;
    --text:      #f5f0e8;
    --muted:     #b8956a;
    --accent:    #c8a26a;
    --accent-h:  #e2c090;
    --original:  #8b4513;
    --vertuo:    #1a4a7a;
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 14px;
  }

  /* ── 기본 ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Segoe UI', system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; }

  /* ── 헤더 ── */
  #header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 14px 24px; flex-shrink: 0; }
  .header-inner { display: flex; align-items: center; gap: 16px; }
  #header h1 { font-size: 1.1rem; font-weight: 700; color: var(--accent); white-space: nowrap; }
  #search-input { flex: 1; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: var(--radius-sm); padding: 7px 12px; font-size: 0.85rem; }
  #search-input:focus { outline: none; border-color: var(--accent); }
  #sort-select { background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: var(--radius-sm); padding: 7px 10px; font-size: 0.82rem; cursor: pointer; }

  /* ── 메인 레이아웃 ── */
  #main-layout { display: flex; flex: 1; }

  /* ── 사이드바 ── */
  #sidebar { width: 220px; flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border); padding: 16px; display: flex; flex-direction: column; gap: 20px; }
  #sidebar h2 { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
  .filter-group { display: flex; flex-direction: column; gap: 8px; }
  .filter-label { font-size: 0.78rem; font-weight: 600; color: var(--muted); }
  .filter-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { background: var(--surface-2); border: 1px solid var(--border); color: var(--muted); border-radius: 99px; padding: 4px 10px; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .chip:hover { border-color: var(--accent); color: var(--accent); }
  .chip.active { background: var(--accent); border-color: var(--accent); color: var(--bg); font-weight: 700; }
  .range-wrapper { display: flex; flex-direction: column; gap: 4px; }
  input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; background: var(--border); border-radius: 2px; cursor: pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--accent); border-radius: 50%; }
  #intensity-display { font-size: 0.75rem; color: var(--muted); }
  #reset-btn { margin-top: auto; background: transparent; border: 1px solid var(--border); color: var(--muted); border-radius: var(--radius-sm); padding: 8px; font-size: 0.78rem; cursor: pointer; transition: all 0.2s; }
  #reset-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* ── 캡슐 그리드 ── */
  #capsule-grid { flex: 1; padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; align-content: start; overflow-y: auto; }
  .empty-state { grid-column: 1/-1; text-align: center; color: var(--muted); padding: 48px 0; font-size: 0.9rem; }

  /* ── 캡슐 카드 ── */
  .capsule-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; display: flex; flex-direction: column; gap: 10px; transition: border-color 0.2s, transform 0.2s; cursor: default; }
  .capsule-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .card-top { display: flex; align-items: center; justify-content: space-between; }
  .line-badge { font-size: 0.62rem; padding: 2px 7px; border-radius: 99px; font-weight: 700; text-transform: uppercase; }
  .line-badge--original { background: var(--original); color: #fff; }
  .line-badge--vertuo   { background: var(--vertuo);   color: #fff; }
  .capsule-name { font-size: 1rem; font-weight: 700; color: var(--text); line-height: 1.2; }
  /* 강도 바 */
  .intensity-wrap { display: flex; flex-direction: column; gap: 4px; }
  .intensity-label { font-size: 0.7rem; color: var(--muted); display: flex; justify-content: space-between; }
  .intensity-bar { display: flex; gap: 2px; }
  .intensity-seg { height: 6px; flex: 1; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .intensity-seg.filled { background: var(--accent); }
  /* 향 태그 */
  .flavor-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .flavor-tag { font-size: 0.68rem; padding: 2px 7px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 99px; color: var(--muted); }
  /* 컵 + 가격 */
  .card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 2px; }
  .cup-size { font-size: 0.75rem; color: var(--muted); }
  .price { font-size: 0.85rem; font-weight: 700; color: var(--accent); }

  /* ── 추천 패널 ── */
  #recommend { border-top: 1px solid var(--border); padding: 20px 24px; background: var(--surface); flex-shrink: 0; }
  #recommend h2 { font-size: 0.85rem; font-weight: 700; color: var(--accent); margin-bottom: 14px; }
  #recommend-list { display: flex; gap: 14px; flex-wrap: wrap; }
  .rec-card { background: var(--surface-2); border: 1px solid var(--accent); border-radius: var(--radius-md); padding: 12px 16px; flex: 1; min-width: 200px; max-width: 300px; }
  .rec-rank { font-size: 0.68rem; color: var(--accent); font-weight: 700; margin-bottom: 4px; }
  .rec-name { font-size: 0.9rem; font-weight: 700; margin-bottom: 6px; }
  .rec-reason { font-size: 0.75rem; color: var(--muted); line-height: 1.5; }

  /* ── 애니메이션 ── */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .capsule-card { animation: fadeIn 0.25s ease both; }

  /* ── 반응형 ── */
  @media (max-width: 768px) {
    #main-layout { flex-direction: column; }
    #sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); flex-direction: row; flex-wrap: wrap; gap: 12px; }
    .header-inner { flex-wrap: wrap; }
    #recommend-list { flex-direction: column; }
  }
  ```

  **Must NOT do**:
  - `app.js`에 내용 추가 없음 — 빈 파일 유지
  - 인라인 `style=""` 또는 `<style>` 태그 금지

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Acceptance Criteria**:
  - [ ] `nespresso/index.html` 브라우저에서 열면 커피 다크 테마 레이아웃 보임
  - [ ] 좌측 필터 사이드바, 중앙 빈 그리드 영역, 하단 추천 패널 영역 구분됨
  - [ ] Console 에러 0개

---

- [ ] 2. `app.js` — capsulesData 배열 + renderCapsuleCards()

  **What to do**:

  `nespresso/app.js`를 아래 코드로 작성:

  ```js
  // ── 상태 ──────────────────────────────────────────────
  const state = {
    filterLine: 'all',
    filterIntensityMax: 13,
    filterCup: 'all',
    searchQuery: '',
    sortBy: 'default',
  };

  // ── 캡슐 데이터 ───────────────────────────────────────
  const capsulesData = [
    // Original Line
    { id: 1,  name: 'Kazaar',          line: 'original', intensity: 12, intensityMax: 13, flavors: ['후추향', '우디', '쓴맛'],        cup: 'espresso',  price: 950,  origin: '과테말라·인도네시아' },
    { id: 2,  name: 'Dharkan',         line: 'original', intensity: 11, intensityMax: 13, flavors: ['우디', '다크초콜릿', '씁쓸함'],   cup: 'espresso',  price: 950,  origin: '라오스·콜롬비아' },
    { id: 3,  name: 'Ristretto',       line: 'original', intensity: 10, intensityMax: 13, flavors: ['과일향', '초콜릿', '진함'],        cup: 'espresso',  price: 900,  origin: '브라질·인도네시아' },
    { id: 4,  name: 'Indriya',         line: 'original', intensity: 10, intensityMax: 13, flavors: ['스파이시', '우디', '강렬함'],      cup: 'espresso',  price: 950,  origin: '인도' },
    { id: 5,  name: 'Roma',            line: 'original', intensity: 8,  intensityMax: 13, flavors: ['우디', '시리얼', '씁쓸함'],       cup: 'espresso',  price: 850,  origin: '케냐·인도' },
    { id: 6,  name: 'Livanto',         line: 'original', intensity: 6,  intensityMax: 13, flavors: ['카라멜', '부드러움', '균형'],      cup: 'espresso',  price: 850,  origin: '콜롬비아·케냐' },
    { id: 7,  name: 'Volluto',         line: 'original', intensity: 4,  intensityMax: 13, flavors: ['비스킷', '달콤함', '가벼움'],      cup: 'lungo',     price: 850,  origin: '콜롬비아·에티오피아' },
    { id: 8,  name: 'Cosi',            line: 'original', intensity: 3,  intensityMax: 13, flavors: ['시트러스', '꽃향', '산뜻함'],      cup: 'lungo',     price: 850,  origin: '에티오피아·콜롬비아' },
    // Vertuo Line
    { id: 9,  name: 'Intenso',         line: 'vertuo',   intensity: 9,  intensityMax: 11, flavors: ['다크초콜릿', '씁쓸함', '진함'],   cup: 'gran lungo', price: 1100, origin: '브라질·멕시코' },
    { id: 10, name: 'Odacio',          line: 'vertuo',   intensity: 7,  intensityMax: 11, flavors: ['시리얼', '과일향', '균형'],        cup: 'mug',       price: 1100, origin: '멕시코·케냐' },
    { id: 11, name: 'Elvazio',         line: 'vertuo',   intensity: 4,  intensityMax: 11, flavors: ['달콤함', '카라멜', '부드러움'],    cup: 'mug',       price: 1100, origin: '에티오피아·멕시코' },
    { id: 12, name: 'Alto Dolce',      line: 'vertuo',   intensity: 2,  intensityMax: 11, flavors: ['꽃향', '산뜻함', '연함'],          cup: 'alto',      price: 1200, origin: '에티오피아·콜롬비아' },
  ];

  // ── 강도 바 HTML 생성 ──────────────────────────────────
  function buildIntensityBar(intensity, max) {
    const segs = Array.from({ length: max }, (_, i) =>
      `<div class="intensity-seg ${i < intensity ? 'filled' : ''}"></div>`
    ).join('');
    return `
      <div class="intensity-wrap">
        <div class="intensity-label"><span>강도</span><span>${intensity}/${max}</span></div>
        <div class="intensity-bar">${segs}</div>
      </div>`;
  }

  // ── 카드 렌더 ──────────────────────────────────────────
  function renderCapsuleCards(list) {
    const grid = document.getElementById('capsule-grid');
    if (!list.length) {
      grid.innerHTML = '<p class="empty-state">조건에 맞는 캡슐이 없습니다 ☕</p>';
      return;
    }
    grid.innerHTML = list.map(c => `
      <div class="capsule-card" data-id="${c.id}">
        <div class="card-top">
          <span class="line-badge line-badge--${c.line}">${c.line === 'original' ? 'Original' : 'Vertuo'}</span>
        </div>
        <div class="capsule-name">${c.name}</div>
        ${buildIntensityBar(c.intensity, c.intensityMax)}
        <div class="flavor-tags">${c.flavors.map(f => `<span class="flavor-tag">${f}</span>`).join('')}</div>
        <div class="card-meta">
          <span class="cup-size">☕ ${c.cup}</span>
          <span class="price">₩${c.price.toLocaleString()}</span>
        </div>
      </div>`).join('');
  }

  // ── 필터·정렬 적용 ────────────────────────────────────
  function getFilteredList() {
    let list = [...capsulesData];
    if (state.filterLine !== 'all') list = list.filter(c => c.line === state.filterLine);
    if (state.filterCup  !== 'all') list = list.filter(c => c.cup  === state.filterCup);
    list = list.filter(c => c.intensity <= state.filterIntensityMax);
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.flavors.some(f => f.includes(q)));
    }
    if (state.sortBy === 'intensity-asc')  list.sort((a, b) => a.intensity - b.intensity);
    if (state.sortBy === 'intensity-desc') list.sort((a, b) => b.intensity - a.intensity);
    if (state.sortBy === 'price-asc')      list.sort((a, b) => a.price - b.price);
    if (state.sortBy === 'price-desc')     list.sort((a, b) => b.price - a.price);
    return list;
  }

  // ── 추천 로직 ─────────────────────────────────────────
  function getRecommendations() {
    const filtered = getFilteredList();
    if (!filtered.length) return [];
    // 필터 상태 기반 점수 계산
    return filtered
      .map(c => {
        let score = 0;
        let reasons = [];
        // 강도 밀착도: 최대값 근처일수록 가점
        const ratio = c.intensity / c.intensityMax;
        if (ratio >= 0.8) { score += 3; reasons.push(`강도 ${c.intensity}의 진하고 강렬한 맛`); }
        else if (ratio >= 0.5) { score += 2; reasons.push(`강도 ${c.intensity}의 균형 잡힌 맛`); }
        else { score += 1; reasons.push(`강도 ${c.intensity}의 가벼운 맛`); }
        // 향 다양성
        if (c.flavors.length >= 3) { score += 1; reasons.push(c.flavors.slice(0, 2).join(' · ') + ' 향'); }
        // Vertuo 가점 (다양한 컵 사이즈)
        if (c.line === 'vertuo' && c.cup !== 'espresso') { score += 1; reasons.push('다양한 컵 사이즈'); }
        return { ...c, score, reason: reasons.slice(0, 2).join(', ') + ' 캡슐입니다.' };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  function renderRecommendations() {
    const recs = getRecommendations();
    const list = document.getElementById('recommend-list');
    if (!recs.length) { list.innerHTML = '<p style="color:var(--muted);font-size:.82rem">필터 조건을 조정하면 추천이 표시됩니다.</p>'; return; }
    list.innerHTML = recs.map((c, i) => `
      <div class="rec-card">
        <div class="rec-rank">${['🥇 1위 추천', '🥈 2위 추천', '🥉 3위 추천'][i]}</div>
        <div class="rec-name">${c.name} <span class="line-badge line-badge--${c.line}" style="font-size:.6rem">${c.line}</span></div>
        <div class="rec-reason">${c.reason}</div>
      </div>`).join('');
  }

  // ── 초기 렌더 ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderCapsuleCards(getFilteredList());
    renderRecommendations();
  });
  ```

  **Must NOT do**:
  - 이벤트 핸들러 추가 없음 (Task 3에서)
  - `index.html` / `style.css` 수정 없음

  **Recommended Agent Profile**:
  - **Category**: `frontend-dev`

  **Acceptance Criteria**:
  - [ ] 12개 캡슐 카드가 그리드에 렌더링됨
  - [ ] 각 카드에 강도 바 세그먼트 표시 (채워진 것 vs 빈 것)
  - [ ] 향 태그 chips 표시
  - [ ] 하단 추천 패널에 3개 추천 카드 표시
  - [ ] Console 에러 0개

---

- [ ] 3. `app.js` — 필터 이벤트 핸들러 (라인 / 강도 / 컵사이즈 / 초기화)

  **What to do**:

  `app.js`의 `DOMContentLoaded` 콜백 안, `renderRecommendations();` 바로 아래에 추가:

  ```js

    // ── 라인 필터 ──
    document.getElementById('filter-line').addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      document.querySelectorAll('#filter-line .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filterLine = chip.dataset.value;
      update();
    });

    // ── 컵 사이즈 필터 ──
    document.getElementById('filter-cup').addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      document.querySelectorAll('#filter-cup .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filterCup = chip.dataset.value;
      update();
    });

    // ── 강도 슬라이더 ──
    const intensitySlider = document.getElementById('filter-intensity');
    const intensityDisplay = document.getElementById('intensity-display');
    intensitySlider.addEventListener('input', () => {
      state.filterIntensityMax = Number(intensitySlider.value);
      intensityDisplay.textContent = `1 ~ ${intensitySlider.value}`;
      update();
    });

    // ── 필터 초기화 ──
    document.getElementById('reset-btn').addEventListener('click', () => {
      state.filterLine = 'all';
      state.filterCup  = 'all';
      state.filterIntensityMax = 13;
      state.searchQuery = '';
      state.sortBy = 'default';
      intensitySlider.value = 13;
      intensityDisplay.textContent = '1 ~ 13';
      document.getElementById('search-input').value = '';
      document.getElementById('sort-select').value = 'default';
      document.querySelectorAll('#filter-line .chip, #filter-cup .chip').forEach(c => {
        c.classList.toggle('active', c.dataset.value === 'all');
      });
      update();
    });
  ```

  `DOMContentLoaded` 콜백 **바깥**, 파일 끝에 `update()` 함수 추가:

  ```js

  // ── 통합 업데이트 ──────────────────────────────────────
  function update() {
    renderCapsuleCards(getFilteredList());
    renderRecommendations();
  }
  ```

  **Must NOT do**:
  - 기존 `renderCapsuleCards` / `renderRecommendations` 함수 수정 없음
  - `index.html` / `style.css` 수정 없음

  **Recommended Agent Profile**:
  - **Category**: `frontend-dev`

  **Acceptance Criteria**:
  - [ ] Original/Vertuo 칩 클릭 시 해당 라인 카드만 표시
  - [ ] 강도 슬라이더 조정 시 해당 강도 이하 카드만 표시
  - [ ] 컵 사이즈 칩 클릭 시 해당 사이즈 카드만 표시
  - [ ] 필터 초기화 버튼으로 전체 복원
  - [ ] 필터 변경 시 추천 패널도 함께 갱신

---

- [ ] 4. `app.js` — 검색 + 정렬 이벤트

  **What to do**:

  `app.js`의 `DOMContentLoaded` 콜백 안, 필터 초기화 이벤트 바로 아래에 추가:

  ```js

    // ── 검색 ──
    document.getElementById('search-input').addEventListener('input', e => {
      state.searchQuery = e.target.value.trim();
      update();
    });

    // ── 정렬 ──
    document.getElementById('sort-select').addEventListener('change', e => {
      state.sortBy = e.target.value;
      update();
    });
  ```

  **Must NOT do**:
  - 기존 코드 수정 없음 — 이벤트 핸들러만 추가

  **Recommended Agent Profile**:
  - **Category**: `frontend-dev`

  **Acceptance Criteria**:
  - [ ] 검색창에 "Ristretto" 입력 시 해당 카드만 표시
  - [ ] 향 키워드("초콜릿") 검색 시 해당 향을 가진 카드 표시
  - [ ] 강도 낮은 순 정렬 시 카드 순서 변경
  - [ ] 가격 낮은 순 정렬 동작

---

- [ ] 5. 최종 정리 — 빈 상태 · 카드 수 표시 · Console 에러 0개

  **What to do**:

  1. `nespresso/style.css` 파일 끝에 추가:
  ```css

  /* ── 카드 수 표시 ── */
  #capsule-count { font-size: 0.75rem; color: var(--muted); padding: 8px 20px 0; }
  ```

  2. `nespresso/index.html`에서 `<main id="capsule-grid">` 위에 추가:
  ```html
  <p id="capsule-count"></p>
  ```

  3. `nespresso/app.js`의 `renderCapsuleCards(list)` 함수 안, `if (!list.length)` 블록 바로 위에 추가:
  ```js
    document.getElementById('capsule-count').textContent = `${list.length}개 캡슐`;
  ```

  4. 브라우저 개발자 도구 Console 탭에서 에러 없음 최종 확인

  **Must NOT do**:
  - 새 기능 추가 없음 — 정리·마무리만

  **Recommended Agent Profile**:
  - **Category**: `quick`

  **Acceptance Criteria**:
  - [ ] 그리드 상단에 "12개 캡슐" 등 카드 수 표시
  - [ ] 필터 후 빈 결과 시 "조건에 맞는 캡슐이 없습니다 ☕" 메시지
  - [ ] Console 에러 0개
  - [ ] 전체 기능 통합 동작 확인

---

## Final Verification

- [ ] F1. `nespresso/index.html` 브라우저에서 열기
  - 12개 캡슐 카드 강도 바 포함 렌더링 확인
  - Original 필터 → 8개 카드 확인
  - 강도 슬라이더 5로 조정 → 5 이하 카드만 확인
  - "초콜릿" 검색 → 해당 향 카드만 확인
  - 추천 패널 3개 추천 표시 확인
  - 필터 초기화 → 전체 복원 확인
  - Console 에러 0개 확인

---

## Commit Strategy

```
feat(nespresso): Task 1 - HTML 레이아웃 + 커피 테마 CSS
feat(nespresso): Task 2 - 캡슐 데이터 + 렌더 함수 + 추천 로직
feat(nespresso): Task 3 - 필터 이벤트 핸들러
feat(nespresso): Task 4 - 검색 + 정렬 이벤트
feat(nespresso): Task 5 - 카드 수 표시 + 최종 정리
```

---

## Success Criteria

```bash
# Windows
start nespresso/index.html

# macOS  
open nespresso/index.html
```

- [ ] 12개 캡슐 카드 렌더링 (Original 8 + Vertuo 4)
- [ ] 강도 바 시각화 (세그먼트 채우기)
- [ ] 향 태그 chips 표시
- [ ] 라인 / 강도 / 컵사이즈 필터 동작
- [ ] 이름·향 검색 동작
- [ ] 강도·가격 정렬 동작
- [ ] 추천 패널 3개 + 이유 텍스트
- [ ] 필터 초기화 동작
- [ ] 카드 수 실시간 표시
- [ ] Console 에러 0개
- [ ] 외부 라이브러리 미사용
