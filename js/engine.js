/**
 * EcoCoder — engine.js
 * Mesin eksekusi game: state management, simulasi, animasi
 */

// ══════════════════════════════════════════════════════════════════
// KONSTANTA
// ══════════════════════════════════════════════════════════════════
const DIRECTIONS = ['kanan','atas','kiri','bawah']; // searah jarum jam
const DIR_DELTA  = { kanan:[1,0], atas:[0,1], kiri:[-1,0], bawah:[0,-1] };
const SPEED_MAP  = { 1: 1000, 2: 600, 3: 350, 4: 180, 5: 80 };

// ══════════════════════════════════════════════════════════════════
// STATE GLOBAL GAME
// ══════════════════════════════════════════════════════════════════
let gameState = null;

function createGameState(levelData) {
  return {
    levelData: levelData,

    // Posisi karakter: petak 1-indexed, arah
    charPetak: levelData.start.petak,
    charArah:  levelData.start.arah,
    charCarrying: null,   // { jenis, ikon, label } | null

    // Map sampah: petak -> data sampah (null jika sudah diambil)
    sampahMap: buildSampahMap(levelData),

    // Map tempat sampah: petak -> jenis (tidak berubah)
    binMap: buildBinMap(levelData),

    // Apakah permainan sedang berjalan animasi
    running: false,
    stepMode: false,

    // Antrian instruksi flat (setelah unroll)
    instructionQueue: [],
    instrIndex: 0,

    // Ref ke blok-blok DOM yang dieksekusi
    programBlocks: [],

    // Riwayat untuk step-by-step
    stepResolve: null,
  };
}

function buildSampahMap(levelData) {
  const m = {};
  levelData.sampah.forEach(s => { m[s.petak] = { ...s, sudahDiambil: false }; });
  return m;
}

function buildBinMap(levelData) {
  const m = {};
  levelData.tempatSampah.forEach(b => { m[b.petak] = b.jenis; });
  return m;
}

// ══════════════════════════════════════════════════════════════════
// COMPILE PROGRAM → FLAT INSTRUCTION LIST
// ══════════════════════════════════════════════════════════════════
/**
 * Membaca blok-blok dari DOM program area dan mengubahnya
 * menjadi daftar instruksi datar (perulangan di-unroll).
 * Setiap instruksi: { type, domEl, ulangiEl? }
 */
function compileProgram(programAreaEl) {
  const instructions = [];
  const children = Array.from(programAreaEl.querySelectorAll(':scope > .prog-block'));
  children.forEach(el => {
    if (el.dataset.type === 'ulangi') {
      const count = parseInt(el.querySelector('.ulangi-count').value) || 1;
      const innerEls = Array.from(el.querySelectorAll('.ulangi-body > .prog-block'));
      for (let i = 0; i < count; i++) {
        innerEls.forEach(inner => {
          instructions.push({ type: inner.dataset.type, domEl: inner, ulangiEl: el, iteration: i });
        });
      }
    } else {
      instructions.push({ type: el.dataset.type, domEl: el });
    }
  });
  return instructions;
}

// ══════════════════════════════════════════════════════════════════
// EKSEKUSI SATU INSTRUKSI
// ══════════════════════════════════════════════════════════════════
function executeInstruction(instr, state) {
  const { type } = instr;
  const { charPetak, charArah } = state;
  const col = (charPetak - 1) % 5;
  const row = Math.floor((charPetak - 1) / 5);

  switch (type) {
    case 'maju': {
      const [dc, dr] = DIR_DELTA[charArah];
      const newCol = col + dc;
      const newRow = row + dr;
      if (newCol < 0 || newCol > 4 || newRow < 0 || newRow > 4) {
        return { ok: false, reason: `Ups! Karakter keluar dari papan! Periksa arah dan langkah kamu. 🚧` };
      }
      const newPetak = newRow * 5 + newCol + 1;
      if (state.levelData.penghalang.includes(newPetak)) {
        return { ok: false, reason: `Benturan! Karakter menabrak penghalang di petak ${newPetak}. Cari jalur lain! 🪨` };
      }
      state.charPetak = newPetak;
      return { ok: true };
    }
    case 'putar_kanan': {
      const idx = DIRECTIONS.indexOf(state.charArah);
      state.charArah = DIRECTIONS[(idx + 1) % 4];
      return { ok: true };
    }
    case 'putar_kiri': {
      const idx = DIRECTIONS.indexOf(state.charArah);
      state.charArah = DIRECTIONS[(idx + 3) % 4];
      return { ok: true };
    }
    case 'ambil': {
      const s = state.sampahMap[state.charPetak];
      if (!s || s.sudahDiambil) {
        return { ok: false, reason: `Tidak ada sampah di sini! Blok Ambil hanya bekerja jika karakter berada di petak yang ada sampahnya. 👀` };
      }
      if (state.charCarrying) {
        return { ok: false, reason: `Karakter sudah membawa ${state.charCarrying.label}! Letakkan dulu sebelum mengambil sampah baru. 🙅` };
      }
      s.sudahDiambil = true;
      state.charCarrying = { jenis: s.jenis, ikon: s.ikon, label: s.label };
      return { ok: true };
    }
    case 'letakkan': {
      if (!state.charCarrying) {
        return { ok: false, reason: `Karakter tidak membawa sampah! Blok Letakkan hanya bekerja jika sedang membawa sampah. 🤔` };
      }
      const binJenis = state.binMap[state.charPetak];
      if (!binJenis) {
        return { ok: false, reason: `Tidak ada tempat sampah di petak ini! Pergi ke petak tempat sampah dulu. 🗑️` };
      }
      if (binJenis !== state.charCarrying.jenis) {
        const tipeLabel = state.charCarrying.jenis === 'organik' ? 'organik (hijau)' : 'anorganik (kuning)';
        return { ok: false, reason: `${state.charCarrying.label} adalah sampah ${state.charCarrying.jenis}! Buang ke tempat sampah ${tipeLabel}, bukan yang ini. ♻️` };
      }
      state.charCarrying = null;
      return { ok: true };
    }
    default:
      return { ok: true };
  }
}

// Cek apakah semua sampah sudah benar
function allTrashDone(state) {
  return Object.values(state.sampahMap).every(s => s.sudahDiambil);
}

// ══════════════════════════════════════════════════════════════════
// HITUNG BLOK (UNTUK SISTEM BINTANG)
// ══════════════════════════════════════════════════════════════════
function countBlocks(programAreaEl) {
  let total = 0;
  Array.from(programAreaEl.querySelectorAll(':scope > .prog-block')).forEach(el => {
    if (el.dataset.type === 'ulangi') {
      const inner = el.querySelectorAll('.ulangi-body > .prog-block').length;
      total += 1 + inner; // blok ulangi itu sendiri + isinya (dihitung sekali)
    } else {
      total++;
    }
  });
  return total;
}

function calcStars(blockCount, optimal) {
  if (blockCount <= optimal) return 3;
  if (blockCount <= optimal + 2) return 2;
  return 1;
}

// ══════════════════════════════════════════════════════════════════
// ANIMASI RUNNER
// ══════════════════════════════════════════════════════════════════
async function runProgram(state, speed, callbacks) {
  const delay = () => new Promise(r => setTimeout(r, SPEED_MAP[speed] || 400));

  for (let i = 0; i < state.instructionQueue.length; i++) {
    if (!state.running) break;

    const instr = state.instructionQueue[i];
    callbacks.onHighlight(instr.domEl, instr.ulangiEl || null);

    // Tunggu jika step mode
    if (state.stepMode) {
      await new Promise(r => { state.stepResolve = r; });
      state.stepResolve = null;
    }

    const result = executeInstruction(instr, state);
    callbacks.onRender(state);
    await delay();

    if (!result.ok) {
      callbacks.onFail(result.reason, instr.domEl);
      return;
    }

    if (allTrashDone(state)) {
      callbacks.onWin();
      return;
    }
  }

  if (state.running && !allTrashDone(state)) {
    callbacks.onFail('Program sudah selesai dijalankan, tapi masih ada sampah yang belum dibuang! Tambahkan lebih banyak blok. 🗑️', null);
  }
}

// ══════════════════════════════════════════════════════════════════
// PENYIMPANAN PROGRES (localStorage)
// ══════════════════════════════════════════════════════════════════
const STORAGE_KEY = 'ecocoder_progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { levels: {} };
  } catch { return { levels: {} }; }
}

function saveProgress(levelId, stars) {
  const prog = loadProgress();
  const existing = prog.levels[levelId] || { stars: 0, completed: false };
  if (stars > existing.stars) {
    prog.levels[levelId] = { stars, completed: true };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prog)); } catch {}
  }
}

function isLevelUnlocked(levelId, prog) {
  if (levelId === 1) return true;
  return prog.levels[levelId - 1]?.completed === true;
}

function getLevelStars(levelId, prog) {
  return prog.levels[levelId]?.stars || 0;
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// ══════════════════════════════════════════════════════════════════
// KONFETI (canvas-based, lightweight)
// ══════════════════════════════════════════════════════════════════
function launchConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 100,
    r: 4 + Math.random() * 6,
    color: ['#3fb950','#58a6ff','#bc8cff','#e3b341','#f78166','#39d353'][Math.floor(Math.random()*6)],
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 8,
    opacity: 1
  }));

  let frame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
      if (p.y < canvas.height) { alive = true; p.opacity = Math.max(0, p.opacity - 0.008); }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6);
      ctx.restore();
    });
    if (alive) frame = requestAnimationFrame(animate);
    else { canvas.style.display = 'none'; ctx.clearRect(0,0,canvas.width,canvas.height); }
  }
  animate();
  return () => { cancelAnimationFrame(frame); canvas.style.display = 'none'; };
}
