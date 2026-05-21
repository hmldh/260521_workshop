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
  { id: 1,  name: 'Kazaar',     line: 'original', intensity: 12, intensityMax: 13, flavors: ['후추향', '우디', '쓴맛'],        cup: 'espresso',   price: 950,  origin: '과테말라·인도네시아' },
  { id: 2,  name: 'Dharkan',    line: 'original', intensity: 11, intensityMax: 13, flavors: ['우디', '다크초콜릿', '씁쓸함'],  cup: 'espresso',   price: 950,  origin: '라오스·콜롬비아' },
  { id: 3,  name: 'Ristretto',  line: 'original', intensity: 10, intensityMax: 13, flavors: ['과일향', '초콜릿', '진함'],       cup: 'espresso',   price: 900,  origin: '브라질·인도네시아' },
  { id: 4,  name: 'Indriya',    line: 'original', intensity: 10, intensityMax: 13, flavors: ['스파이시', '우디', '강렬함'],     cup: 'espresso',   price: 950,  origin: '인도' },
  { id: 5,  name: 'Roma',       line: 'original', intensity: 8,  intensityMax: 13, flavors: ['우디', '시리얼', '씁쓸함'],      cup: 'espresso',   price: 850,  origin: '케냐·인도' },
  { id: 6,  name: 'Livanto',    line: 'original', intensity: 6,  intensityMax: 13, flavors: ['카라멜', '부드러움', '균형'],     cup: 'espresso',   price: 850,  origin: '콜롬비아·케냐' },
  { id: 7,  name: 'Volluto',    line: 'original', intensity: 4,  intensityMax: 13, flavors: ['비스킷', '달콤함', '가벼움'],     cup: 'lungo',      price: 850,  origin: '콜롬비아·에티오피아' },
  { id: 8,  name: 'Cosi',       line: 'original', intensity: 3,  intensityMax: 13, flavors: ['시트러스', '꽃향', '산뜻함'],     cup: 'lungo',      price: 850,  origin: '에티오피아·콜롬비아' },
  { id: 9,  name: 'Intenso',    line: 'vertuo',   intensity: 9,  intensityMax: 11, flavors: ['다크초콜릿', '씁쓸함', '진함'],  cup: 'gran lungo', price: 1100, origin: '브라질·멕시코' },
  { id: 10, name: 'Odacio',     line: 'vertuo',   intensity: 7,  intensityMax: 11, flavors: ['시리얼', '과일향', '균형'],       cup: 'mug',        price: 1100, origin: '멕시코·케냐' },
  { id: 11, name: 'Elvazio',    line: 'vertuo',   intensity: 4,  intensityMax: 11, flavors: ['달콤함', '카라멜', '부드러움'],   cup: 'mug',        price: 1100, origin: '에티오피아·멕시코' },
  { id: 12, name: 'Alto Dolce', line: 'vertuo',   intensity: 2,  intensityMax: 11, flavors: ['꽃향', '산뜻함', '연함'],         cup: 'alto',       price: 1200, origin: '에티오피아·콜롬비아' },
];

// ── 강도 바 생성 ──────────────────────────────────────
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
  const countEl = document.getElementById('capsule-count');
  const grid = document.getElementById('capsule-grid');
  if (countEl) countEl.textContent = `${list.length}개 캡슐`;
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
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.flavors.some(f => f.includes(q))
    );
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
  return filtered
    .map(c => {
      let score = 0;
      const reasons = [];
      const ratio = c.intensity / c.intensityMax;
      if (ratio >= 0.8) {
        score += 3;
        reasons.push(`강도 ${c.intensity}의 진하고 강렬한 맛`);
      } else if (ratio >= 0.5) {
        score += 2;
        reasons.push(`강도 ${c.intensity}의 균형 잡힌 맛`);
      } else {
        score += 1;
        reasons.push(`강도 ${c.intensity}의 가벼운 맛`);
      }
      if (c.flavors.length >= 3) {
        score += 1;
        reasons.push(c.flavors.slice(0, 2).join(' · ') + ' 향');
      }
      if (c.line === 'vertuo' && c.cup !== 'espresso') {
        score += 1;
        reasons.push('다양한 컵 사이즈 지원');
      }
      return { ...c, score, reason: reasons.slice(0, 2).join(', ') + ' 캡슐입니다.' };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function renderRecommendations() {
  const recs = getRecommendations();
  const list = document.getElementById('recommend-list');
  if (!recs.length) {
    list.innerHTML = '<p style="color:var(--muted);font-size:.82rem">필터 조건을 조정하면 추천이 표시됩니다.</p>';
    return;
  }
  list.innerHTML = recs.map((c, i) => `
    <div class="rec-card">
      <div class="rec-rank">${['🥇 1위 추천', '🥈 2위 추천', '🥉 3위 추천'][i]}</div>
      <div class="rec-name">${c.name} <span class="line-badge line-badge--${c.line}" style="font-size:.6rem">${c.line}</span></div>
      <div class="rec-reason">${c.reason}</div>
    </div>`).join('');
}

// ── 통합 업데이트 ──────────────────────────────────────
function update() {
  renderCapsuleCards(getFilteredList());
  renderRecommendations();
}

// ── 초기 렌더 ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  update();

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
});
