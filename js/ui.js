/**
 * EcoCoder — ui.js
 * Semua logika UI dengan ikon SVG profesional — tanpa emoji
 */

const $ = id => document.getElementById(id);
const screens = {};
['home','levels','game','howto'].forEach(s => { screens[s] = $('screen-' + s); });

// ── Home
const btnPlay      = $('btn-play');
const btnLevels    = $('btn-levels');
const btnHowto     = $('btn-howto');

// ── Levels
const levelGrid    = $('levels-grid');
const progressFill = $('progress-fill');
const progressText = $('progress-text');

// ── Game
const ghLevel      = $('gh-level');
const ghTitle      = $('gh-title');
const ghMisi       = $('gh-misi');
const btnMenu      = $('btn-menu');
const btnMute      = $('btn-mute');
const btnToggleNum = $('btn-toggle-num');
const gameBoard    = $('game-board');
const palettePanel = $('palette-panel');
const programArea  = $('program-area');
const blockCounter = $('block-counter');
const blockCountEl = $('block-count');
const blockMaxEl   = $('block-max');
const btnRun       = $('btn-run');
const btnStep      = $('btn-step');
const btnReset     = $('btn-reset');
const speedSlider  = $('speed-slider');

// ── Modals
const winOverlay   = $('win-overlay');
const failOverlay  = $('fail-overlay');
const tutOverlay   = $('tutorial-overlay');
const confettiCanvas = $('confetti-canvas');
const winStarsEl   = $('win-stars');
const winBlocksEl  = $('win-blocks');
const winOptimalEl = $('win-optimal');
const winFactEl    = $('win-fact');
const btnRetry     = $('btn-retry');
const btnNextLevel = $('btn-next-level');
const failMsgEl    = $('fail-message');
const btnFailRetry = $('btn-fail-retry');
const btnFailMenu  = $('btn-fail-menu');
const tutStepEl    = $('tut-step');
const tutDotsEl    = $('tut-dots');
const btnTutNext   = $('btn-tut-next');

// ══════════════════════════════════════════════════════════════════
// NAVIGASI
// ══════════════════════════════════════════════════════════════════
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ══════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════
function initHome() {
  const prog = loadProgress();
  const completedCount = Object.values(prog.levels).filter(l => l.completed).length;
  const totalStars = Object.values(prog.levels).reduce((s, l) => s + (l.stars || 0), 0);
  if ($('stat-done')) $('stat-done').textContent = completedCount;
  if ($('stat-stars')) $('stat-stars').textContent = totalStars;
  spawnParticles();
}

function spawnParticles() {
  const container = $('home-particles');
  if (!container) return;
  container.innerHTML = '';
  const colors = ['rgba(63,185,80,0.35)','rgba(88,166,255,0.3)','rgba(188,140,255,0.28)','rgba(227,179,65,0.3)'];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 5 + Math.random() * 14;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${7+Math.random()*10}s;animation-delay:${-Math.random()*12}s;`;
    container.appendChild(p);
  }
}

// ══════════════════════════════════════════════════════════════════
// LEVEL SELECT
// ══════════════════════════════════════════════════════════════════

// Ikon SVG per level (profesional, tidak ada emoji)
const LEVEL_ICONS_SVG = [
  // L1 – arrow-right-circle (urutan)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 16 4-4-4-4"/></svg>`,
  // L2 – corner-down-right (belokan)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>`,
  // L3 – repeat (perulangan)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  // L4 – shield (rintangan)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  // L5 – package-2 (multi objek)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>`,
  // L6 – git-branch (klasifikasi)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  // L7 – cpu (perulangan+belokan)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
  // L8 – maze / grid (labirin)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
  // L9 – zap (efisiensi)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  // L10 – award (tantangan akhir)
  `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
];

function buildLevelSelect() {
  const prog = loadProgress();
  const completedCount = Object.values(prog.levels).filter(l => l.completed).length;
  const pct = Math.round((completedCount / LEVELS.length) * 100);
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.textContent = `${completedCount} / ${LEVELS.length} level selesai`;

  levelGrid.innerHTML = '';
  LEVELS.forEach((lv, idx) => {
    const unlocked = isLevelUnlocked(lv.id, prog);
    const stars = getLevelStars(lv.id, prog);
    const completed = stars > 0;

    const card = document.createElement('div');
    card.className = `level-card${!unlocked ? ' locked' : ''}${completed ? ' completed' : ''}`;
    card.innerHTML = `
      ${!unlocked ? `<div class="lc-lock">${icon('lock',16)}</div>` : ''}
      <div class="lc-num">Level ${lv.id}</div>
      <div class="lc-icon">${LEVEL_ICONS_SVG[idx]}</div>
      <div class="lc-title">${lv.judul}</div>
      <div class="lc-konsep">${lv.konsep}</div>
      <div class="lc-stars">${renderStars(stars)}</div>
    `;
    if (unlocked) card.addEventListener('click', () => startLevel(lv.id));
    levelGrid.appendChild(card);
  });
}

function renderStars(n) {
  return [1,2,3].map((i, idx) => {
    const earned = i <= n;
    const c = earned ? '#e3b341' : '#30363d';
    return `<span class="modal-star${earned ? ' earned' : ''}" style="animation-delay:${idx*0.12}s">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${earned?c:'none'}" stroke="${c}" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </span>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════════
// BLOCK DEFINITIONS (ikon SVG, tanpa emoji)
// ══════════════════════════════════════════════════════════════════
const BLOCK_DEFS = {
  maju:        { label: 'Maju 1 Langkah',   cls: 'maju',        iconKey: 'arrowUp',     tooltip: 'Gerak 1 petak ke arah hadap' },
  putar_kanan: { label: 'Putar Kanan 90°',  cls: 'putar_kanan', iconKey: 'rotateCw',    tooltip: 'Putar searah jarum jam' },
  putar_kiri:  { label: 'Putar Kiri 90°',   cls: 'putar_kiri',  iconKey: 'rotateCcw',   tooltip: 'Putar berlawanan jarum jam' },
  ambil:       { label: 'Ambil Sampah',     cls: 'ambil',       iconKey: 'hand',        tooltip: 'Ambil sampah di petak ini' },
  letakkan:    { label: 'Letakkan Sampah',  cls: 'letakkan',    iconKey: 'packageOpen', tooltip: 'Buang sampah ke tempat sampah' },
  ulangi:      { label: 'Ulangi … kali',    cls: 'ulangi',      iconKey: 'repeat',      tooltip: 'Jalankan blok di dalamnya berulang kali' },
};

function buildPalette(levelData) {
  palettePanel.innerHTML = `
    <div class="palette-title">
      ${icon('layers',12)}
      Palet Blok
    </div>`;
  levelData.blokTersedia.forEach(type => {
    const def = BLOCK_DEFS[type];
    if (!def) return;
    const el = document.createElement('div');
    el.className = `block ${def.cls}`;
    el.dataset.type = type;
    el.title = def.tooltip;
    el.draggable = true;
    el.innerHTML = `<span class="block-icon">${icon(def.iconKey, 15)}</span>${def.label}`;
    setupPaletteDrag(el, type);
    palettePanel.appendChild(el);
  });
}

// ══════════════════════════════════════════════════════════════════
// GAME INIT
// ══════════════════════════════════════════════════════════════════
let currentLevelId = 1;
let showNumbers = false;
let isMuted = false;
let activeAnimation = false;
let stopAnimation = false;

function startLevel(levelId) {
  currentLevelId = levelId;
  const levelData = LEVELS.find(l => l.id === levelId);
  if (!levelData) return;

  showScreen('game');
  ghLevel.textContent = `Level ${levelId}`;
  ghTitle.textContent = levelData.judul;
  ghMisi.textContent  = `Misi: ${levelData.misi}`;

  gameState = createGameState(levelData);
  stopAnimation = false;
  activeAnimation = false;

  renderBoard();
  buildPalette(levelData);
  clearProgramArea();
  updateBlockCounter();

  if (levelData.tutorial && levelData.tutorialSteps) showTutorial(levelData.tutorialSteps);
  else hideTutorial();

  setControlsEnabled(true);
}

// ══════════════════════════════════════════════════════════════════
// RENDER BOARD (ikon SVG, tanpa emoji)
// ══════════════════════════════════════════════════════════════════
// Arrow direction markers (SVG, inline)
const DIR_ARROW = {
  kanan: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  atas:  `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>`,
  kiri:  `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`,
  bawah: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
};

// SVG ikon untuk item sampah di papan
const TRASH_SVG = {
  organik:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  anorganik:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e3b341" stroke-width="2"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>`,
};

const BIN_SVG = {
  organik:   `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  anorganik: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e3b341" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
};

const OBSTACLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a5160" stroke-width="1.8"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;

const CHAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`;

function renderBoard() {
  if (!gameState) return;
  gameBoard.innerHTML = '';
  const { charPetak, charArah, charCarrying, sampahMap, binMap, levelData } = gameState;

  for (let row = 4; row >= 0; row--) {
    for (let col = 0; col < 5; col++) {
      const petak = row * 5 + col + 1;
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.petak = petak;

      if (showNumbers) {
        const num = document.createElement('span');
        num.className = 'cell-num';
        num.textContent = petak;
        cell.appendChild(num);
      }

      if (levelData.penghalang.includes(petak)) {
        // Obstacle
        cell.classList.add('obstacle');
        const wrap = document.createElement('div');
        wrap.className = 'cell-content';
        wrap.innerHTML = `<div class="cell-obstacle-icon">${OBSTACLE_SVG}</div>`;
        cell.appendChild(wrap);
      }
      else if (binMap[petak]) {
        // Tempat sampah
        const jenis = binMap[petak];
        cell.classList.add(jenis === 'organik' ? 'trash-bin-organic' : 'trash-bin-anorganic');
        const wrap = document.createElement('div');
        wrap.className = 'cell-content';
        wrap.innerHTML = BIN_SVG[jenis];
        const lbl = document.createElement('div');
        lbl.className = 'cell-label';
        lbl.style.color = jenis === 'organik' ? '#3fb950' : '#e3b341';
        lbl.textContent = jenis === 'organik' ? 'ORG' : 'ANO';
        wrap.appendChild(lbl);
        cell.appendChild(wrap);
      }
      else if (sampahMap[petak] && !sampahMap[petak].sudahDiambil) {
        // Sampah
        const s = sampahMap[petak];
        cell.classList.add(s.jenis === 'organik' ? 'trash-item-organic' : 'trash-item-anorganic');
        const wrap = document.createElement('div');
        wrap.className = 'cell-content';
        wrap.title = `${s.label} (${s.jenis})`;
        wrap.innerHTML = TRASH_SVG[s.jenis] || TRASH_SVG.organik;
        const lbl = document.createElement('div');
        lbl.className = 'cell-label';
        lbl.style.color = s.jenis === 'organik' ? '#3fb950' : '#e3b341';
        lbl.textContent = s.label.length > 8 ? s.label.substring(0, 7) + '…' : s.label;
        wrap.appendChild(lbl);
        cell.appendChild(wrap);
      }

      // Karakter
      if (petak === charPetak) {
        const charEl = document.createElement('div');
        charEl.className = 'character';
        charEl.id = 'char-el';
        charEl.title = `Arah: ${charArah}`;
        charEl.innerHTML = `
          <div class="char-body">${CHAR_SVG}</div>
          <div class="char-dir-arrow ${charArah}">${DIR_ARROW[charArah]}</div>
          ${charCarrying ? `<div class="char-carrying">${TRASH_SVG[charCarrying.jenis]}</div>` : ''}
        `;
        cell.appendChild(charEl);
      }

      gameBoard.appendChild(cell);
    }
  }
}

// ══════════════════════════════════════════════════════════════════
// DRAG & DROP
// ══════════════════════════════════════════════════════════════════
let dragType = null;
let dragFromProgram = false;
let dragSourceEl = null;
let dragGhost = null;

function setupPaletteDrag(el, type) {
  el.addEventListener('dragstart', e => {
    dragType = type; dragFromProgram = false; dragSourceEl = null;
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', type);
    createGhost(el);
  });
  el.addEventListener('dragend', () => removeGhost());
}

function createGhost(src) {
  dragGhost = src.cloneNode(true);
  dragGhost.className = `block ${src.className} drag-ghost`;
  Object.assign(dragGhost.style, { position: 'fixed', top: '-999px', pointerEvents: 'none', zIndex: '9999' });
  document.body.appendChild(dragGhost);
}
function removeGhost() { if (dragGhost) { dragGhost.remove(); dragGhost = null; } }

document.addEventListener('dragover', e => {
  e.preventDefault();
  if (dragGhost) { dragGhost.style.left = (e.clientX + 12) + 'px'; dragGhost.style.top = (e.clientY - 12) + 'px'; }
});

programArea.addEventListener('dragover', e => { e.preventDefault(); programArea.classList.add('drag-over'); });
programArea.addEventListener('dragleave', e => { if (!programArea.contains(e.relatedTarget)) programArea.classList.remove('drag-over'); });
programArea.addEventListener('drop', e => {
  e.preventDefault(); programArea.classList.remove('drag-over');
  if (!dragType || activeAnimation) return;
  const levelData = LEVELS.find(l => l.id === currentLevelId);
  if (countBlocks(programArea) >= levelData.maksBlok) return;
  addBlockToProgram(dragType, programArea);
  dragType = null;
  updateBlockCounter(); updateEmptyState();
});

function setupUlangiBodyDrop(bodyEl) {
  bodyEl.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); bodyEl.classList.add('drag-over'); });
  bodyEl.addEventListener('dragleave', e => { if (!bodyEl.contains(e.relatedTarget)) bodyEl.classList.remove('drag-over'); });
  bodyEl.addEventListener('drop', e => {
    e.preventDefault(); e.stopPropagation(); bodyEl.classList.remove('drag-over');
    if (!dragType || dragType === 'ulangi') {
      if (dragType === 'ulangi') showToast('Blok Ulangi tidak boleh diletakkan di dalam Ulangi.');
      return;
    }
    const levelData = LEVELS.find(l => l.id === currentLevelId);
    if (countBlocks(programArea) >= levelData.maksBlok) return;
    addBlockToProgram(dragType, bodyEl, true);
    dragType = null;
    updateBlockCounter(); updateEmptyState();
  });
}

// ══════════════════════════════════════════════════════════════════
// TAMBAH BLOK
// ══════════════════════════════════════════════════════════════════
function addBlockToProgram(type, container, isInner = false) {
  const def = BLOCK_DEFS[type];
  if (!def) return;

  const el = document.createElement('div');
  el.className = `prog-block ${def.cls}`;
  el.dataset.type = type;

  const delBtn = `<button class="pb-delete" title="Hapus blok" onclick="removeProgBlock(this)">${icon('x', 13)}</button>`;

  if (type === 'ulangi') {
    el.innerHTML = `
      <div class="ulangi-header">
        <span class="block-icon">${icon('repeat', 14)}</span>
        Ulangi
        <input class="ulangi-count" type="number" min="1" max="9" value="2" title="Jumlah perulangan">
        kali
        ${delBtn}
      </div>
      <div class="ulangi-body">
        <div class="ulangi-placeholder">Taruh blok di sini...</div>
      </div>
    `;
    const inp = el.querySelector('.ulangi-count');
    inp.addEventListener('input', () => {
      let v = parseInt(inp.value);
      if (isNaN(v) || v < 1) inp.value = 1;
      if (v > 9) inp.value = 9;
    });
    const body = el.querySelector('.ulangi-body');
    setupUlangiBodyDrop(body);
    el.draggable = true;
    el.addEventListener('dragstart', e => {
      dragType = 'ulangi'; dragFromProgram = true; dragSourceEl = el;
      e.dataTransfer.effectAllowed = 'move'; createGhost(el);
      setTimeout(() => el.classList.add('dragging'), 0);
    });
    el.addEventListener('dragend', () => { el.classList.remove('dragging'); removeGhost(); });
    container.appendChild(el);
  } else {
    el.innerHTML = `
      <span class="block-icon">${icon(def.iconKey, 14)}</span>
      ${def.label}
      ${delBtn}
    `;
    el.draggable = true;
    el.addEventListener('dragstart', e => {
      dragType = type; dragFromProgram = true; dragSourceEl = el;
      e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', type);
      createGhost(el); setTimeout(() => el.classList.add('dragging'), 0);
    });
    el.addEventListener('dragend', () => { el.classList.remove('dragging'); removeGhost(); });
    container.appendChild(el);
    if (isInner) {
      const ph = container.querySelector('.ulangi-placeholder');
      if (ph) ph.style.display = 'none';
    }
  }
}

window.removeProgBlock = function(btnEl) {
  btnEl.closest('.prog-block').remove();
  updateBlockCounter(); updateEmptyState();
};

function clearProgramArea() {
  programArea.innerHTML = `
    <div class="program-area-empty" id="prog-empty">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      </div>
      <span>Tarik blok dari palet ke sini<br>untuk menyusun program</span>
    </div>`;
}

function updateEmptyState() {
  const blocks = programArea.querySelectorAll(':scope > .prog-block');
  const emptyEl = $('prog-empty');
  if (emptyEl) emptyEl.style.display = blocks.length > 0 ? 'none' : 'flex';
}

function updateBlockCounter() {
  const levelData = LEVELS.find(l => l.id === currentLevelId);
  if (!levelData) return;
  const count = countBlocks(programArea);
  blockCountEl.textContent = count;
  blockMaxEl.textContent   = levelData.maksBlok;
  blockCounter.className = 'block-counter';
  if (count >= levelData.maksBlok) blockCounter.classList.add('at-limit');
  else if (count >= levelData.maksBlok - 2) blockCounter.classList.add('near-limit');
}

// ══════════════════════════════════════════════════════════════════
// RUN / STEP / RESET
// ══════════════════════════════════════════════════════════════════
async function handleRun(stepMode = false) {
  if (activeAnimation) return;
  const blocks = programArea.querySelectorAll(':scope > .prog-block');
  if (blocks.length === 0) { showToast('Area program masih kosong. Susun beberapa blok terlebih dahulu.'); return; }

  gameState = createGameState(LEVELS.find(l => l.id === currentLevelId));
  renderBoard();

  const instrs = compileProgram(programArea);
  if (instrs.length === 0) { showToast('Tidak ada instruksi yang dapat dijalankan.'); return; }

  gameState.instructionQueue = instrs;
  gameState.stepMode = stepMode;
  gameState.running = true;
  activeAnimation = true; stopAnimation = false;

  setControlsEnabled(false);
  if (stepMode) btnStep.disabled = false;
  hideTutorial();

  const speed = parseInt(speedSlider.value) || 3;

  await runProgram(gameState, speed, {
    onHighlight(domEl, ulangiEl) {
      programArea.querySelectorAll('.prog-block').forEach(e => e.classList.remove('executing'));
      if (domEl) domEl.classList.add('executing');
      if (ulangiEl) ulangiEl.querySelector('.ulangi-header')?.classList.add('executing');
    },
    onRender(state) { renderBoard(); },
    onFail(reason, failEl) {
      if (failEl) { failEl.classList.remove('executing'); failEl.classList.add('failed'); }
      const cellEl = gameBoard.querySelector(`[data-petak="${gameState.charPetak}"]`);
      if (cellEl) cellEl.classList.add('fail-flash');
      showFail(reason);
      endAnimation();
    },
    onWin() { showWin(); endAnimation(); }
  });
}

function handleStep() {
  if (gameState && gameState.stepResolve) gameState.stepResolve();
}

function endAnimation() {
  activeAnimation = false; gameState.running = false;
  programArea.querySelectorAll('.prog-block').forEach(e => e.classList.remove('executing'));
  setControlsEnabled(true);
}

function setControlsEnabled(enabled) {
  btnRun.disabled  = !enabled;
  btnStep.disabled = !enabled;
  btnReset.disabled = false;
  palettePanel.querySelectorAll('.block').forEach(b => b.classList.toggle('disabled', !enabled));
}

function handleReset() {
  if (gameState) {
    stopAnimation = true;
    if (gameState.stepResolve) gameState.stepResolve();
    gameState.running = false; activeAnimation = false;
    gameState = createGameState(LEVELS.find(l => l.id === currentLevelId));
    renderBoard();
    programArea.querySelectorAll('.prog-block').forEach(e => e.classList.remove('executing','failed'));
    setControlsEnabled(true);
    hideModals();
  }
}

// ══════════════════════════════════════════════════════════════════
// WIN / FAIL
// ══════════════════════════════════════════════════════════════════
function showWin() {
  const levelData = LEVELS.find(l => l.id === currentLevelId);
  const used = countBlocks(programArea);
  const stars = calcStars(used, levelData.optimal);
  saveProgress(currentLevelId, stars);

  winStarsEl.innerHTML = renderStars(stars);
  winBlocksEl.textContent  = used;
  winOptimalEl.textContent = levelData.optimal;

  // Fact dengan ikon leaf
  winFactEl.innerHTML = `${icon('leaf', 14)} ${levelData.faktaSampah}`;

  const hasNext = currentLevelId < LEVELS.length;
  btnNextLevel.style.display = hasNext ? '' : 'none';
  winOverlay.classList.add('visible');
  launchConfetti(confettiCanvas);
}

function showFail(reason) {
  failMsgEl.textContent = reason;
  failOverlay.classList.add('visible');
}

function hideModals() {
  winOverlay.classList.remove('visible');
  failOverlay.classList.remove('visible');
}

// ══════════════════════════════════════════════════════════════════
// TUTORIAL
// ══════════════════════════════════════════════════════════════════
let tutSteps = [];
let tutStepIdx = 0;

function showTutorial(steps) {
  tutSteps = steps; tutStepIdx = 0;
  renderTutStep();
  tutOverlay.classList.add('visible');
}

function renderTutStep() {
  const step = tutSteps[tutStepIdx];
  tutStepEl.innerHTML = step.pesan;
  tutDotsEl.innerHTML = tutSteps.map((_,i) => `<span class="tut-dot${i===tutStepIdx?' active':''}"></span>`).join('');
  btnTutNext.innerHTML = (tutStepIdx < tutSteps.length - 1)
    ? `Lanjut ${icon('chArrowRight', 13)}`
    : `Mulai ${icon('play', 13)}`;

  palettePanel.querySelectorAll('.block').forEach(b => b.style.outline = '');
  if (step.sorotBlok) {
    const target = palettePanel.querySelector(`.block[data-type="${step.sorotBlok}"]`);
    if (target) target.style.outline = '2px solid rgba(88,166,255,0.8)';
  }
}

function hideTutorial() {
  tutOverlay.classList.remove('visible');
  palettePanel.querySelectorAll('.block').forEach(b => b.style.outline = '');
}

// ══════════════════════════════════════════════════════════════════
// HOW TO PLAY
// ══════════════════════════════════════════════════════════════════
function buildHowTo() {
  const container = $('howto-blocks');
  if (!container) return;
  container.innerHTML = '';
  Object.entries(BLOCK_DEFS).forEach(([type, def]) => {
    const el = document.createElement('div');
    el.className = `howto-block block ${def.cls}`;
    el.style.background = 'transparent';
    el.innerHTML = `
      <span class="block-icon">${icon(def.iconKey, 16)}</span>
      <span class="hb-name">${def.label}</span>
      <span class="hb-desc">${def.tooltip}</span>
    `;
    container.appendChild(el);
  });
}

// ══════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════
function showToast(msg) {
  let t = $('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
      background:#21262d;border:1px solid #30363d;color:#e6edf3;
      padding:0.6rem 1.1rem;border-radius:9px;font-size:0.83rem;font-weight:700;
      z-index:200;box-shadow:0 4px 18px rgba(0,0,0,0.5);
      font-family:'Nunito',sans-serif;display:none;max-width:340px;text-align:center;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = 'none'; }, 3000);
}

// ══════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  btnPlay.addEventListener('click', () => {
    const prog = loadProgress();
    let nextLevel = 1;
    for (let i = 1; i <= LEVELS.length; i++) {
      if (!prog.levels[i]?.completed) { nextLevel = i; break; }
      nextLevel = i;
    }
    startLevel(nextLevel);
  });

  btnLevels.addEventListener('click', () => { buildLevelSelect(); showScreen('levels'); });
  btnHowto.addEventListener('click', () => { buildHowTo(); showScreen('howto'); });
  $('btn-back-levels').addEventListener('click', () => { showScreen('home'); initHome(); });
  $('btn-back-howto').addEventListener('click', () => showScreen('home'));

  btnMenu.addEventListener('click', () => {
    if (activeAnimation) { gameState.running = false; }
    buildLevelSelect(); showScreen('levels'); hideModals();
  });

  btnMute.addEventListener('click', () => {
    isMuted = !isMuted;
    const volIcon = $('icon-vol');
    if (volIcon) {
      volIcon.innerHTML = isMuted
        ? `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/>`
        : `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
    }
  });

  btnToggleNum.addEventListener('click', () => {
    showNumbers = !showNumbers;
    btnToggleNum.classList.toggle('active', showNumbers);
    renderBoard();
  });

  btnRun.addEventListener('click', () => handleRun(false));
  btnStep.addEventListener('click', () => {
    if (!activeAnimation) handleRun(true);
    else handleStep();
  });
  btnReset.addEventListener('click', handleReset);

  btnRetry.addEventListener('click', () => { hideModals(); handleReset(); });
  btnNextLevel.addEventListener('click', () => {
    hideModals();
    if (currentLevelId < LEVELS.length) startLevel(currentLevelId + 1);
  });

  btnFailRetry.addEventListener('click', () => { hideModals(); handleReset(); });
  btnFailMenu.addEventListener('click', () => { hideModals(); buildLevelSelect(); showScreen('levels'); });

  btnTutNext.addEventListener('click', () => {
    tutStepIdx++;
    if (tutStepIdx >= tutSteps.length) hideTutorial();
    else renderTutStep();
  });

  const btnClear = $('btn-clear-progress');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Yakin ingin menghapus semua progres permainan?')) {
        clearProgress(); initHome();
        showToast('Progres berhasil dihapus.');
      }
    });
  }

  initHome();
  showScreen('home');
});
