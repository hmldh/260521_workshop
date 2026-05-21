# 멀티 에이전트 오케스트레이션 대시보드 구현 계획

## TL;DR

> **목표**: `agent-team.md` 기반의 9개 에이전트를 시각화하는 단일 페이지 대시보드를 순수 HTML+CSS+JS로 구현한다.
>
> **산출물**:
> - `dashboard/index.html` — 레이아웃 + 마크업 + 인라인 없음
> - `dashboard/style.css` — 디자인 토큰 + 모든 컴포넌트 스타일
> - `dashboard/app.js` — 데이터 + 렌더링 + 이벤트 + 시뮬레이터
>
> **예상 총 소요**: **20~30분** (Task 3개, 각 7~10분)
> **병렬 실행**: NO — Task 1 → Task 2 → Task 3 순서 고정

---

## Context

### 원본 요청
멀티 에이전트 오케스트레이션 관리 대시보드 (HTML+CSS+JS)
- 에이전트 카드 (에이전트 정보, 상태)
- 작업 상태 목록 (작업 요약, 상태, 배정된 에이전트)
- 로그·메모 패널 (실행 로그, 메모)
- 모델 사용 전략 체크리스트 (위원회형, 리더형, ...)

### 참조 문서
- `agent-team.md` — 9개 에이전트 역할 정의 (오케스트레이터, PM, UI/UX, 프론트엔드, 백엔드, TDD, 코드리뷰어, QA, 운영)
- `role-card.md` — 역할 카드 원형
- `exercise-02.md` — 이번 작업 요구사항 원문

### 현재 상태
- `dashboard/` 디렉터리 없음 — 전체 신규 생성
- 기존 `tests/programmer-calculator.spec.mjs` 는 별개 프로젝트 테스트이므로 건드리지 않음

### Research Findings (실제 OSS 레퍼런스)

| 참조 프로젝트 | 적용 패널 | 링크 |
|---|---|---|
| **OpenClaw Agent Dashboard** | 에이전트 카드 + 세션 로그 | [HTML](https://github.com/karem505/openclaw-agent-dashboard/blob/ccce6cdc88c31f68bdae4b959c540933ed8309c5/agent-dashboard.html#L699-L912) |
| **ProKanban (kanban-board-js)** | 작업 카드 + 뱃지 + 활동 로그 | [task card](https://github.com/CodeWithSindhu/kanban-board-js/blob/82325355d168a9f4dba9f683899a0a6991034111/src/modules/ui.js#L313-L453) · [log viewer](https://github.com/CodeWithSindhu/kanban-board-js/blob/82325355d168a9f4dba9f683899a0a6991034111/src/modules/ui.js#L1235-L1388) |
| **Donezo Task Manager** | 대시보드 3컬럼 레이아웃 + stat 카드 | [layout](https://github.com/tasneem38/Donezo---Task-manager/blob/ea98d9402cc159834a52585896d37189d51d2858/client/dashboard.html#L17-L104) · [CSS cards](https://github.com/tasneem38/Donezo---Task-manager/blob/ea98d9402cc159834a52585896d37189d51d2858/client/style.css#L455-L739) |
| **Enterprise Checklist Dashboard** | 체크리스트 그리드 + 진행 바 + localStorage | [card grid](https://github.com/dbsectrainer/enterprise-grade-checklists/blob/e0ac19fb894184492528e80e1d733c593cf4fdeb/index.html#L30-L89) · [checkbox rows](https://github.com/dbsectrainer/enterprise-grade-checklists/blob/e0ac19fb894184492528e80e1d733c593cf4fdeb/enterprise-frontend-checklist/index.html#L37-L105) · [persistence JS](https://github.com/dbsectrainer/enterprise-grade-checklists/blob/e0ac19fb894184492528e80e1d733c593cf4fdeb/enterprise-frontend-checklist/script.js#L79-L145) |

**핵심 패턴 요약**:
- **레이아웃**: 상단 헤더 → 3컬럼 메인 영역 → 하단 전략 패널 (3-zone 구조)
- **카드**: 둥근 모서리, 좌측 색상 테두리 또는 뱃지로 상태 표현
- **뱃지**: 작은 pill 형태, 우선순위·상태에 색상 코딩
- **로그 뷰어**: 고정 높이 + `overflow-y: auto`, 타임스탬프 왼쪽 정렬
- **체크리스트**: 진행 바 + 체크박스 행 + localStorage로 상태 지속

---

## 파일 구조

```
dashboard/
├── index.html      ← Task 1: 전체 레이아웃 + 4패널 마크업
├── style.css       ← Task 1: 디자인 토큰 + 모든 컴포넌트 스타일
└── app.js          ← Task 2 + 3: 데이터·렌더링 → 이벤트·시뮬레이터
```

---

## 패널 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│  #header: 대시보드 제목                                     │
├──────────────────┬──────────────────┬────────────────────┤
│  #panel-agents   │  #panel-tasks    │  #panel-logs       │
│  에이전트 카드    │  작업 상태 목록   │  로그·메모 패널     │
│  (좌 260px)      │  (중 1fr)        │  (우 320px)        │
└──────────────────┴──────────────────┴────────────────────┘
│  #panel-strategy: 모델 전략 체크리스트 (하단 전폭)           │
└──────────────────────────────────────────────────────────┘
```

---

## Must Have
- 에이전트 9개 카드 (agent-team.md 기반, JS 렌더링)
- 4가지 상태 뱃지: `idle` / `running` / `done` / `error`
- 작업 목록 6개 행: 클릭 시 상태 순환
- 로그 패널: 자동 스크롤 + 메모 저장
- 전략 체크리스트 5개: localStorage 저장
- 4초 자동 시뮬레이터

## Must NOT Have
- 외부 CSS 프레임워크 (Bootstrap, Tailwind 등) 금지
- 외부 JS 라이브러리 (React, Vue, jQuery 등) 금지
- 백엔드 서버 없음 — 정적 파일만
- `tests/` 폴더 수정 금지

---

## Execution Strategy

```
Task 1 (~10분): dashboard/ 생성 + index.html + style.css 완성
  └── 산출물: 브라우저에서 열리는 정적 대시보드 (데이터 없음)

Task 2 (~10분): app.js — 데이터 배열 + 렌더 함수 전부
  └── 산출물: 9개 카드·6개 작업·4개 로그가 JS로 렌더링됨

Task 3 (~10분): app.js — 이벤트 핸들러 + 전략 저장 + 시뮬레이터
  └── 산출물: 클릭·메모·자동변경 모두 동작하는 완성 대시보드
```

---

## TODOs

---

- [ ] 1. `dashboard/` 폴더 생성 + `index.html` + `style.css` 완성

  **What to do**:

  1. `dashboard/` 디렉터리를 만들고 `index.html`, `style.css`, `app.js`(빈 파일) 생성

  2. `dashboard/index.html` 전체 작성:
  ```html
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>에이전트 오케스트레이션 대시보드</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header id="header">
      <h1>🤖 에이전트 오케스트레이션 대시보드</h1>
    </header>

    <main id="main-grid">
      <section id="panel-agents">
        <h2>에이전트</h2>
        <div class="panel-body" id="agent-list"></div>
      </section>

      <section id="panel-tasks">
        <h2>작업 목록</h2>
        <div class="panel-body">
          <table class="task-table">
            <thead>
              <tr><th>작업</th><th>상태</th><th>담당</th><th>우선순위</th></tr>
            </thead>
            <tbody id="task-list-body"></tbody>
          </table>
        </div>
      </section>

      <section id="panel-logs">
        <h2>로그·메모</h2>
        <div class="panel-body">
          <div id="log-list" class="log-list"></div>
          <div class="memo-area">
            <textarea id="memo-input" placeholder="메모 입력 후 저장 (Ctrl+Enter)..." rows="3"></textarea>
            <button id="memo-save-btn">저장</button>
          </div>
        </div>
      </section>
    </main>

    <footer id="panel-strategy">
      <h2>모델 전략</h2>
      <div class="strategy-grid">
        <label class="strategy-item"><input type="radio" name="strategy" value="committee">
          <div class="strategy-item__content"><span>🏛️</span><div><strong>위원회형</strong><p>모든 에이전트가 의견 제출 후 합의</p></div></div></label>
        <label class="strategy-item"><input type="radio" name="strategy" value="leader" checked>
          <div class="strategy-item__content"><span>👑</span><div><strong>리더형</strong><p>오케스트레이터가 최종 결정</p></div></div></label>
        <label class="strategy-item"><input type="radio" name="strategy" value="hybrid">
          <div class="strategy-item__content"><span>🔀</span><div><strong>하이브리드</strong><p>역할별 전문가가 담당 영역만 결정</p></div></div></label>
        <label class="strategy-item"><input type="radio" name="strategy" value="routing">
          <div class="strategy-item__content"><span>🗺️</span><div><strong>전문가 라우팅</strong><p>모델 강점에 따라 자동 배분</p></div></div></label>
        <label class="strategy-item"><input type="radio" name="strategy" value="cost">
          <div class="strategy-item__content"><span>💰</span><div><strong>비용 절감</strong><p>소형 모델 우선, 필요 시 대형 호출</p></div></div></label>
      </div>
    </footer>

    <script src="app.js" defer></script>
  </body>
  </html>
  ```

  3. `dashboard/style.css` 전체 작성:
  ```css
  /* ── 디자인 토큰 ── */
  :root {
    --bg: #0f1117;
    --surface: #1a1d27;
    --surface-2: #242736;
    --border: #2e3147;
    --text: #e2e8f0;
    --muted: #94a3b8;
    --accent: #6366f1;
    --accent-h: #818cf8;
    --idle: #64748b;
    --running: #22c55e;
    --done: #6366f1;
    --error: #ef4444;
    --warn: #f59e0b;
  }

  /* ── 기본 ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }

  /* ── 헤더 ── */
  #header { padding: 12px 20px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  #header h1 { font-size: 1rem; font-weight: 600; }

  /* ── 메인 그리드 ── */
  #main-grid { display: grid; grid-template-columns: 260px 1fr 320px; flex: 1; min-height: 0; }
  #main-grid section { border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  #main-grid section h2 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); padding: 10px 14px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .panel-body { flex: 1; overflow-y: auto; padding: 10px 14px; }

  /* ── 에이전트 카드 ── */
  .agent-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; cursor: pointer; transition: border-color 0.2s; }
  .agent-card:hover, .agent-card.selected { border-color: var(--accent); background: var(--surface-2); }
  .agent-card__header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .agent-card__name { font-weight: 600; font-size: 0.85rem; flex: 1; }
  .agent-card__role { font-size: 0.73rem; color: var(--muted); }
  .agent-card__model { font-size: 0.68rem; color: var(--muted); margin-top: 3px; font-family: monospace; }

  /* ── 뱃지 ── */
  .badge { font-size: 0.62rem; padding: 2px 7px; border-radius: 99px; font-weight: 700; text-transform: uppercase; transition: background 0.3s; }
  .badge--idle    { background: var(--idle);    color: #fff; }
  .badge--running { background: var(--running); color: #000; }
  .badge--done    { background: var(--done);    color: #fff; }
  .badge--error   { background: var(--error);   color: #fff; }
  .badge--pending { background: var(--surface-2); color: var(--muted); border: 1px solid var(--border); }

  /* ── 작업 테이블 ── */
  .task-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  .task-table th { text-align: left; padding: 6px 8px; color: var(--muted); border-bottom: 1px solid var(--border); font-weight: 500; font-size: 0.75rem; }
  .task-row { cursor: pointer; transition: background 0.15s; }
  .task-row:hover { background: var(--surface); }
  .task-row td { padding: 7px 8px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .priority { font-size: 0.62rem; padding: 2px 5px; border-radius: 4px; font-weight: 600; }
  .priority--high   { background: #7f1d1d; color: #fca5a5; }
  .priority--medium { background: #78350f; color: #fcd34d; }
  .priority--low    { background: #1e3a5f; color: #93c5fd; }

  /* ── 로그 패널 ── */
  .log-list { height: 260px; overflow-y: auto; font-size: 0.76rem; font-family: monospace; display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
  .log-entry { display: flex; gap: 8px; padding: 3px 4px; border-radius: 4px; animation: fadeIn 0.2s ease; }
  .log-entry--info  { color: var(--muted); }
  .log-entry--warn  { color: var(--warn); }
  .log-entry--error { color: var(--error); background: rgba(239,68,68,0.08); }
  .log-entry--memo  { color: #a78bfa; border-left: 2px solid #a78bfa; padding-left: 8px; }
  .log-time  { color: var(--muted); min-width: 48px; flex-shrink: 0; }
  .log-agent { font-weight: 700; min-width: 72px; flex-shrink: 0; }
  .memo-area { display: flex; flex-direction: column; gap: 6px; }
  .memo-area textarea { background: var(--surface); border: 1px solid var(--border); color: var(--text); border-radius: 6px; padding: 8px; resize: none; font-family: system-ui, sans-serif; font-size: 0.82rem; width: 100%; }
  .memo-area textarea:focus { outline: none; border-color: var(--accent); }
  .memo-area button { background: var(--accent); color: #fff; border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer; font-size: 0.82rem; align-self: flex-end; transition: background 0.2s; }
  .memo-area button:hover { background: var(--accent-h); }

  /* ── 전략 패널 ── */
  #panel-strategy { border-top: 1px solid var(--border); padding: 12px 20px; flex-shrink: 0; }
  #panel-strategy h2 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-bottom: 10px; }
  .strategy-grid { display: flex; gap: 8px; flex-wrap: wrap; }
  .strategy-item { cursor: pointer; }
  .strategy-item input[type=radio] { display: none; }
  .strategy-item__content { display: flex; align-items: center; gap: 10px; padding: 8px 14px; background: var(--surface); border: 2px solid var(--border); border-radius: 8px; transition: border-color 0.2s, background 0.2s; }
  .strategy-item__content span { font-size: 1.1rem; }
  .strategy-item__content strong { font-size: 0.82rem; display: block; }
  .strategy-item__content p { font-size: 0.7rem; color: var(--muted); margin-top: 2px; }
  .strategy-item:has(input:checked) .strategy-item__content { border-color: var(--accent); background: var(--surface-2); }

  /* ── 애니메이션 ── */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

  /* ── 반응형 ── */
  @media (max-width: 900px) {
    body { overflow: auto; }
    #main-grid { grid-template-columns: 1fr; }
    #main-grid section { border-right: none; border-bottom: 1px solid var(--border); }
    .log-list { height: 180px; }
    .strategy-grid { flex-direction: column; }
  }
  ```

  **Must NOT do**:
  - `app.js`에 코드 추가 없음 (이 Task에서는 빈 파일 유지)
  - 인라인 `style=""` 또는 `<style>` 태그 사용 금지

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`

  **Parallelization**:
  - **Can Run In Parallel**: NO (첫 번째 Task)
  - **Blocks**: Task 2, 3

  **Acceptance Criteria**:
  - [ ] `dashboard/index.html`을 브라우저에서 열면 4개 패널 영역이 보임
  - [ ] 배경이 어두운 다크 테마로 표시됨
  - [ ] 전략 체크리스트 5개 항목이 하단에 보임
  - [ ] 브라우저 Console 에러 0개

---

- [ ] 2. `app.js` — 데이터 배열 + 렌더 함수 전부

  **What to do**:

  `dashboard/app.js`를 아래 코드로 작성한다 (빈 파일에 처음 작성):

  ```js
  // ── 상태 ──────────────────────────────────────────────
  const state = { selectedAgent: null };

  // ── 데이터 ────────────────────────────────────────────
  const agentsData = [
    { id: 'orchestrator',  name: '오케스트레이터', role: '전체 작업 분해 · 라우팅',  icon: '🎯', status: 'running', model: 'claude-sonnet' },
    { id: 'pm',            name: 'PM',             role: '계획 · 우선순위 · 승인',   icon: '📋', status: 'idle',    model: 'claude-haiku' },
    { id: 'ui-ux',         name: 'UI/UX 디자이너', role: '화면 흐름 · 시각 구조',   icon: '🎨', status: 'done',    model: 'claude-haiku' },
    { id: 'frontend',      name: '프론트엔드',      role: 'UI 구현 · 인터랙션',      icon: '💻', status: 'running', model: 'claude-sonnet' },
    { id: 'backend',       name: '백엔드',          role: 'API · 데이터 · 서버',     icon: '⚙️', status: 'idle',    model: 'claude-haiku' },
    { id: 'tdd',           name: 'TDD',             role: '테스트 코드 작성',         icon: '🧪', status: 'idle',    model: 'claude-haiku' },
    { id: 'code-reviewer', name: '코드 리뷰어',     role: '품질 · 일관성 검토',      icon: '🔍', status: 'idle',    model: 'claude-haiku' },
    { id: 'qa',            name: 'QA',              role: '실제 동작 검증',           icon: '✅', status: 'idle',    model: 'claude-haiku' },
    { id: 'ops',           name: '운영/인프라',      role: '배포 · 실행 안정성',      icon: '🚀', status: 'idle',    model: 'claude-haiku' },
  ];

  const tasksData = [
    { id: 't1', title: '레이아웃 설계',      status: 'done',    agent: 'ui-ux',        priority: 'high'   },
    { id: 't2', title: '에이전트 카드 구현', status: 'running', agent: 'frontend',     priority: 'high'   },
    { id: 't3', title: 'API 명세 작성',      status: 'pending', agent: 'backend',      priority: 'medium' },
    { id: 't4', title: '테스트 케이스 작성', status: 'pending', agent: 'tdd',          priority: 'medium' },
    { id: 't5', title: '코드 리뷰',          status: 'pending', agent: 'code-reviewer',priority: 'low'    },
    { id: 't6', title: 'QA 시나리오 실행',   status: 'pending', agent: 'qa',           priority: 'medium' },
  ];

  const logsData = [
    { time: '00:00', agent: '오케스트레이터', msg: '대시보드 초기화 완료', level: 'info' },
    { time: '00:01', agent: 'PM',             msg: '작업 티켓 6개 생성',  level: 'info' },
    { time: '00:02', agent: 'UI/UX 디자이너', msg: '레이아웃 설계 완료', level: 'info' },
    { time: '00:03', agent: '프론트엔드',      msg: '카드 렌더링 구현 중', level: 'warn' },
  ];

  // ── 렌더 함수 ──────────────────────────────────────────
  function renderAgentCards() {
    document.getElementById('agent-list').innerHTML = agentsData.map(a => `
      <div class="agent-card ${state.selectedAgent === a.id ? 'selected' : ''}" data-agent-id="${a.id}">
        <div class="agent-card__header">
          <span>${a.icon}</span>
          <span class="agent-card__name">${a.name}</span>
          <span class="badge badge--${a.status}">${a.status}</span>
        </div>
        <div class="agent-card__role">${a.role}</div>
        <div class="agent-card__model">${a.model}</div>
      </div>`).join('');
  }

  function renderTaskList() {
    document.getElementById('task-list-body').innerHTML = tasksData.map(t => {
      const a = agentsData.find(a => a.id === t.agent);
      return `<tr class="task-row" data-task-id="${t.id}">
        <td>${t.title}</td>
        <td><span class="badge badge--${t.status}">${t.status}</span></td>
        <td>${a ? a.icon + ' ' + a.name : t.agent}</td>
        <td><span class="priority priority--${t.priority}">${t.priority}</span></td>
      </tr>`;
    }).join('');
  }

  function addLog(agent, msg, level = 'info') {
    const time = new Date().toTimeString().slice(0, 5);
    logsData.push({ time, agent, msg, level });
    renderLogs();
  }

  function renderLogs() {
    const list = document.getElementById('log-list');
    const data = state.selectedAgent
      ? logsData.filter(l => l.agent === agentsData.find(a => a.id === state.selectedAgent)?.name)
      : logsData;
    list.innerHTML = data.map(l => `
      <div class="log-entry log-entry--${l.level}">
        <span class="log-time">${l.time}</span>
        <span class="log-agent">${l.agent}</span>
        <span>${l.msg}</span>
      </div>`).join('');
    list.scrollTop = list.scrollHeight;
  }

  // ── 초기 렌더 ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderAgentCards();
    renderTaskList();
    renderLogs();
  });
  ```

  **Must NOT do**:
  - 이벤트 핸들러 추가 없음 (Task 3에서 추가)
  - `index.html` / `style.css` 수정 없음

  **Recommended Agent Profile**:
  - **Category**: `frontend-dev`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 1

  **Acceptance Criteria**:
  - [ ] 브라우저 새로고침 시 9개 에이전트 카드 렌더링됨
  - [ ] 6개 작업 행이 테이블에 표시됨
  - [ ] 4개 초기 로그가 로그 패널에 표시됨
  - [ ] Console 에러 0개

---

- [ ] 3. `app.js` — 이벤트 핸들러 + 전략 저장 + 시뮬레이터

  **What to do**:

  `dashboard/app.js`의 `// ── 초기 렌더 ──` 블록 안
  (`renderLogs();` 바로 아래, 닫는 `});` 바로 위)에 아래 코드를 **추가**한다:

  ```js
    // ── 에이전트 카드 클릭 → 로그 필터 ──
    document.getElementById('agent-list').addEventListener('click', e => {
      const card = e.target.closest('.agent-card');
      if (!card) return;
      const id = card.dataset.agentId;
      state.selectedAgent = state.selectedAgent === id ? null : id;
      renderAgentCards();
      renderLogs();
    });

    // ── 작업 행 클릭 → 상태 순환 ──
    document.getElementById('task-list-body').addEventListener('click', e => {
      const row = e.target.closest('.task-row');
      if (!row) return;
      const task = tasksData.find(t => t.id === row.dataset.taskId);
      if (!task) return;
      const cycle = ['pending', 'running', 'done', 'error'];
      task.status = cycle[(cycle.indexOf(task.status) + 1) % cycle.length];
      addLog('시스템', `"${task.title}" → ${task.status}`, 'info');
      renderTaskList();
    });

    // ── 메모 저장 ──
    const memoBtn = document.getElementById('memo-save-btn');
    const memoInput = document.getElementById('memo-input');
    memoBtn.addEventListener('click', () => {
      const text = memoInput.value.trim();
      if (!text) return;
      addLog('📝 메모', text, 'memo');
      memoInput.value = '';
    });
    memoInput.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'Enter') memoBtn.click();
    });

    // ── 전략 선택 저장/복원 ──
    const saved = localStorage.getItem('strategy') || 'leader';
    const savedRadio = document.querySelector(`input[name=strategy][value="${saved}"]`);
    if (savedRadio) savedRadio.checked = true;
    document.querySelectorAll('input[name=strategy]').forEach(r =>
      r.addEventListener('change', () => {
        localStorage.setItem('strategy', r.value);
        addLog('시스템', `전략 변경 → ${r.value}`, 'info');
      })
    );

    // ── 상태 시뮬레이터 (4초마다) ──
    const SIM = {
      orchestrator: ['작업 라우팅 중...', '에이전트 배정 완료', '병렬 실행 시작'],
      frontend:     ['컴포넌트 렌더링', 'CSS 수정 중', 'JS 이벤트 연결'],
      qa:           ['시나리오 실행 중', 'UI 검증 완료', '결함 없음'],
      pm:           ['마일스톤 업데이트', '우선순위 재정렬', '티켓 생성'],
    };
    setInterval(() => {
      const ids = Object.keys(SIM);
      const id = ids[Math.floor(Math.random() * ids.length)];
      const agent = agentsData.find(a => a.id === id);
      const msgs = SIM[id];
      if (Math.random() < 0.35) {
        agent.status = ['idle', 'running', 'done'][Math.floor(Math.random() * 3)];
        renderAgentCards();
      }
      addLog(agent.name, msgs[Math.floor(Math.random() * msgs.length)], 'info');
    }, 4000);
  ```

  **주의**: 위 코드는 기존 `DOMContentLoaded` 콜백 **안**에 추가하는 것임. 새 블록을 별도로 만들지 않는다.

  **Must NOT do**:
  - `index.html` / `style.css` 수정 없음
  - 기존 렌더 함수 덮어쓰기 금지 — 추가만

  **Recommended Agent Profile**:
  - **Category**: `frontend-dev`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: Task 2

  **Acceptance Criteria**:
  - [ ] 에이전트 카드 클릭 시 로그 패널이 해당 에이전트 로그만 표시
  - [ ] 같은 카드 재클릭 시 전체 로그로 복원
  - [ ] 작업 행 클릭 시 상태 뱃지가 순환 (pending → running → done → error → pending)
  - [ ] 저장 버튼 및 Ctrl+Enter로 메모가 로그에 추가됨
  - [ ] 전략 선택 후 새로고침 시 선택 유지 (localStorage)
  - [ ] 4초마다 로그 자동 추가 및 에이전트 상태 변경
  - [ ] Console 에러 0개

---

## Final Verification

- [ ] F1. 브라우저에서 `dashboard/index.html` 직접 열기
  - 9개 에이전트 카드 렌더링 확인
  - 카드 클릭 → 로그 필터 동작 확인
  - 행 클릭 → 상태 순환 확인
  - 메모 저장 확인
  - 전략 선택 → 새로고침 후 복원 확인
  - 4초 자동 시뮬레이터 확인
  - Console 에러 0개 확인

---

## Commit Strategy

```
feat(dashboard): Task 1 - HTML 레이아웃 + CSS 스타일 완성
feat(dashboard): Task 2 - 데이터 배열 + 렌더 함수
feat(dashboard): Task 3 - 이벤트 + 전략 저장 + 시뮬레이터
```

---

## Success Criteria

```bash
# Windows
start dashboard/index.html

# macOS
open dashboard/index.html
```

- [ ] 9개 에이전트 카드 렌더링
- [ ] 4가지 상태 뱃지 색상 구분
- [ ] 작업 행 클릭 → 상태 순환
- [ ] 로그 자동 스크롤 + 메모 저장
- [ ] 전략 선택 localStorage 저장
- [ ] 4초 자동 시뮬레이터
- [ ] Console 에러 0개
- [ ] 외부 라이브러리 미사용
