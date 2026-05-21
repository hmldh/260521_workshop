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
});