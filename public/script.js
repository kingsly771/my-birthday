/* ═══════════════════════════════════════════════
   VALENHART BIRTHDAY SYSTEM — script.js
   All interactive features
═══════════════════════════════════════════════ */

// ─── Dev console message ──────────────────────
console.log('%c\n  ██╗   ██╗ █████╗ ██╗     ███████╗███╗   ██╗██╗  ██╗ █████╗ ██████╗ ████████╗\n  ██║   ██║██╔══██╗██║     ██╔════╝████╗  ██║██║  ██║██╔══██╗██╔══██╗╚══██╔══╝\n  ╚████╔╝ ██║  ██║███████╗███████╗██║ ╚████║██║  ██║██║  ██║██║  ██║   ██║   \n', 'color: #00ff88; font-family: monospace; font-size: 10px;');
console.log('%c  🎮 VALENHART BIRTHDAY SYSTEM — Access granted ', 'background: #9d00ff; color: white; font-size: 14px; padding: 8px 16px; border-radius: 4px;');
console.log('%c  Sultan Lucien Valenhart亗 — LEVEL 05 ELITE ', 'color: #ffd700; font-size: 12px;');

// ═══════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════

const BOOT_LINES = [
  '> Initialisation du système Valenhart…',
  '> Chargement du protocole anniversaire [OK]',
  '> Vérification du rang… ÉLITE [CONFIRMÉ]',
  '> Chargement des mini-jeux [OK]',
  '> Connexion au portail message [OK]',
  '> Synchronisation effets visuels [OK]',
  '> Chargement profil joueur… Sultan Lucien Valenhart亗',
  '> Niveau détecté : 05 — CÉLÉBRATION ACTIVÉE',
  '> Système prêt.',
];

const bootLog = document.getElementById('boot-log');
const enterBtn = document.getElementById('enter-btn');

async function runBoot() {
  for (const line of BOOT_LINES) {
    await sleep(280);
    const p = document.createElement('div');
    p.textContent = line;
    p.style.opacity = '0';
    bootLog.appendChild(p);
    await sleep(50);
    p.style.transition = 'opacity 0.3s';
    p.style.opacity = '1';
    bootLog.scrollTop = bootLog.scrollHeight;
  }
  await sleep(300);
  enterBtn.style.display = 'inline-block';
  enterBtn.style.animation = 'glitch 1s ease-in-out';
  playSound('boot');
}

runBoot();

enterBtn.addEventListener('click', () => {
  playSound('click');
  const entry = document.getElementById('entry-screen');
  entry.style.transition = 'opacity 0.6s, transform 0.6s';
  entry.style.opacity = '0';
  entry.style.transform = 'scale(0.95)';
  setTimeout(() => {
    entry.style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    initParticles();
    loadStats();
    loadLikes();
    initCountdown();
    checkBirthday();
  }, 600);
});

// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active-section'));
    link.classList.add('active');
    document.getElementById(`${section}-section`).classList.add('active-section');
    if (section === 'messages') loadMessages();
    playSound('click');
  });
});

// ═══════════════════════════════════════════════
// PARTICLES CANVAS
// ═══════════════════════════════════════════════

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.2,
    color: ['#00d4ff', '#9d00ff', '#ffd700', '#ff006e'][Math.floor(Math.random() * 4)]
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ═══════════════════════════════════════════════
// COUNTDOWN
// ═══════════════════════════════════════════════

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = new Date();
  const year = now.getMonth() > 3 || (now.getMonth() === 3 && now.getDate() > 5)
    ? now.getFullYear() + 1
    : now.getFullYear();
  const target = new Date(year, 3, 5, 0, 0, 0); // April 5
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('countdown-display').style.display = 'none';
    document.getElementById('birthday-banner').style.display = 'block';
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

function checkBirthday() {
  const now = new Date();
  if (now.getMonth() === 3 && now.getDate() === 5) {
    setTimeout(() => showLevelUp(), 1500);
  }
}

// ═══════════════════════════════════════════════
// LEVEL UP OVERLAY
// ═══════════════════════════════════════════════

function showLevelUp() {
  const overlay = document.getElementById('levelup-overlay');
  overlay.style.display = 'flex';
  playSound('levelup');
  launchConfetti();
}

document.getElementById('close-levelup').addEventListener('click', () => {
  document.getElementById('levelup-overlay').style.display = 'none';
  playSound('click');
});

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    w: Math.random() * 10 + 5,
    h: Math.random() * 6 + 3,
    angle: Math.random() * 360,
    rot: (Math.random() - 0.5) * 6,
    vy: Math.random() * 4 + 2,
    vx: (Math.random() - 0.5) * 3,
    color: ['#ffd700', '#ff006e', '#00d4ff', '#9d00ff', '#00ff88', '#ff8c00'][Math.floor(Math.random() * 6)]
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.rot;
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ═══════════════════════════════════════════════
// STATS + LIKES
// ═══════════════════════════════════════════════

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      document.getElementById('stat-msgs').textContent = data.totalMessages;
      document.getElementById('stat-likes').textContent = data.likes;
      document.getElementById('like-count').textContent = data.likes;
    }
  } catch {}
}

async function loadLikes() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      document.getElementById('like-count').textContent = data.likes;
      document.getElementById('stat-likes').textContent = data.likes;
    }
  } catch {}
}

const likeBtn = document.getElementById('like-btn');
likeBtn.addEventListener('click', async () => {
  if (likeBtn.classList.contains('liked')) {
    showToast('Tu as déjà liké ! 💖');
    return;
  }
  likeBtn.classList.add('liked');
  playSound('click');

  // Heart burst animation
  const icon = likeBtn.querySelector('.like-icon');
  icon.style.animation = 'none';
  icon.offsetHeight;
  icon.style.transition = 'transform 0.3s cubic-bezier(.175,.885,.32,1.275)';
  icon.style.transform = 'scale(1.6)';
  setTimeout(() => { icon.style.transform = 'scale(1)'; }, 300);

  try {
    const res = await fetch('/api/like', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      document.getElementById('like-count').textContent = data.likes;
      document.getElementById('stat-likes').textContent = data.likes;
      showToast('❤️ Merci pour l\'amour ! Sultan te remercie !');
    }
  } catch { showToast('❤️ Like enregistré !'); }
});

// ═══════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════

document.getElementById('msg-text').addEventListener('input', function () {
  document.getElementById('char-counter').textContent = this.value.length;
});

document.getElementById('send-msg-btn').addEventListener('click', sendMessage);

async function sendMessage() {
  const name = document.getElementById('msg-name').value.trim();
  const text = document.getElementById('msg-text').value.trim();
  const feedback = document.getElementById('msg-feedback');

  if (!name || !text) {
    feedback.className = 'msg-feedback error';
    feedback.textContent = '⚠️ Remplis ton nom et ton message.';
    return;
  }

  feedback.className = 'msg-feedback';
  feedback.textContent = 'Envoi en cours…';

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text })
    });
    const data = await res.json();
    if (data.success) {
      feedback.className = 'msg-feedback success';
      feedback.textContent = '✅ Message envoyé ! Sultan l\'a reçu.';
      document.getElementById('msg-name').value = '';
      document.getElementById('msg-text').value = '';
      document.getElementById('char-counter').textContent = '0';
      loadMessages();
      loadStats();
      playSound('victory');
      setTimeout(() => { feedback.textContent = ''; }, 3000);
    } else {
      throw new Error(data.error);
    }
  } catch (e) {
    feedback.className = 'msg-feedback error';
    feedback.textContent = '❌ Erreur : ' + (e.message || 'Réessaie.');
  }
}

async function loadMessages() {
  const list = document.getElementById('messages-list');
  try {
    const res = await fetch('/api/messages');
    const data = await res.json();
    if (!data.success || !data.messages.length) {
      list.innerHTML = '<div class="loading-msg">Aucun message pour l\'instant. Sois le premier ! 💬</div>';
      return;
    }
    list.innerHTML = data.messages.map(m => `
      <div class="message-item">
        <div class="msg-header">
          <span class="msg-author">⚡ ${escHtml(m.name)}</span>
          <span class="msg-time">${formatDate(m.timestamp)}</span>
        </div>
        <div class="msg-body">${escHtml(m.text)}</div>
      </div>
    `).join('');
  } catch {
    list.innerHTML = '<div class="loading-msg">Erreur de chargement…</div>';
  }
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ═══════════════════════════════════════════════
// MINI-JEUX — SELECTOR
// ═══════════════════════════════════════════════

document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const game = card.dataset.game;
    document.getElementById('game-selector').style.display = 'none';
    const area = document.getElementById(`game-${game}`);
    area.style.display = 'block';
    playSound('click');
    if (game === 'memory') initMemory();
    else if (game === 'quiz') initQuiz();
    else if (game === 'choice') initChoice();
  });
});

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.back;
    document.querySelectorAll('.game-area').forEach(a => a.style.display = 'none');
    document.getElementById('game-selector').style.display = 'grid';
    playSound('click');
  });
});

// ═══════════════════════════════════════════════
// MINI-JEU 1 — MEMORY
// ═══════════════════════════════════════════════

const MEMORY_EMOJIS = ['🎮','💻','⚔️','🏆','✨','🎯','👑','🔥'];

let memoryState = { flipped: [], matched: 0, tries: 0, score: 0 };

function initMemory() {
  memoryState = { flipped: [], matched: 0, tries: 0, score: 0 };
  document.getElementById('memory-score').textContent = '0';
  document.getElementById('memory-tries').textContent = '0';

  const cards = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ emoji, id: i, matched: false }));

  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  cards.forEach((card) => {
    const el = document.createElement('div');
    el.className = 'memory-card';
    el.dataset.emoji = card.emoji;
    el.dataset.id = card.id;
    el.innerHTML = `<div class="memory-card-inner">
      <div class="memory-back"></div>
      <div class="memory-face">${card.emoji}</div>
    </div>`;
    el.addEventListener('click', () => onMemoryCardClick(el, cards));
    grid.appendChild(el);
  });
}

function onMemoryCardClick(el, cards) {
  if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
  if (memoryState.flipped.length >= 2) return;

  el.classList.add('flipped');
  memoryState.flipped.push(el);
  playSound('click');

  if (memoryState.flipped.length === 2) {
    memoryState.tries++;
    document.getElementById('memory-tries').textContent = memoryState.tries;

    const [a, b] = memoryState.flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      setTimeout(() => {
        a.classList.add('matched');
        b.classList.add('matched');
        memoryState.matched++;
        memoryState.score += 10;
        document.getElementById('memory-score').textContent = memoryState.score;
        memoryState.flipped = [];
        playSound('victory');
        if (memoryState.matched === MEMORY_EMOJIS.length) {
          setTimeout(() => {
            showToast(`🏆 Mémoire parfaite ! Score : ${memoryState.score} en ${memoryState.tries} essais`);
            launchConfetti();
          }, 400);
        }
      }, 300);
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        memoryState.flipped = [];
      }, 900);
    }
  }
}

document.getElementById('memory-restart').addEventListener('click', () => {
  initMemory();
  playSound('click');
});

// ═══════════════════════════════════════════════
// MINI-JEU 2 — QUIZ
// ═══════════════════════════════════════════════

const QUIZ_QUESTIONS = [
  {
    q: '🎂 En quelle année Sultan Lucien Valenhart fête-t-il son anniversaire le 5 Avril ?',
    opts: ['2023', '2024', '2025', '2026'],
    ans: 2,
    explain: '✅ Exact ! On est bien en 2025 !'
  },
  {
    q: '💻 Quelle est la classe de Sultan dans le système Valenhart ?',
    opts: ['Guerrier', 'Mage', 'Développeur', 'Archer'],
    ans: 2,
    explain: '✅ Sultan est un Développeur d\'élite !'
  },
  {
    q: '⚔️ Quel est le rang de Sultan dans le système ?',
    opts: ['Novice', 'Intermédiaire', 'Expert', 'Élite'],
    ans: 3,
    explain: '✅ ÉLITE — Le rang maximal !'
  },
  {
    q: '🌟 Quel niveau Sultan atteint-il lors de cet anniversaire ?',
    opts: ['Niveau 3', 'Niveau 4', 'Niveau 5', 'Niveau 10'],
    ans: 2,
    explain: '✅ Niveau 05 ! Un cap important !'
  },
  {
    q: '❄️ Quel symbole dans le nom de Sultan représente la glace ?',
    opts: ['✨', '亗', '❄️', '⚔️'],
    ans: 2,
    explain: '✅ ❄️ représente la glace dans le nom de Sultan !'
  },
];

let quizState = { current: 0, score: 0, answered: false };

function initQuiz() {
  quizState = { current: 0, score: 0, answered: false };
  document.getElementById('quiz-total').textContent = QUIZ_QUESTIONS.length;
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-container').style.display = 'block';
  renderQuestion();
}

function renderQuestion() {
  const q = QUIZ_QUESTIONS[quizState.current];
  if (!q) { showQuizResult(); return; }
  quizState.answered = false;

  document.getElementById('quiz-question-text').innerHTML =
    `<strong>Question ${quizState.current + 1}/${QUIZ_QUESTIONS.length}</strong><br><br>${q.q}`;

  const opts = document.getElementById('quiz-options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => onQuizAnswer(i, btn));
    opts.appendChild(btn);
  });
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-score').textContent = quizState.score;
}

function onQuizAnswer(idx, btn) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = QUIZ_QUESTIONS[quizState.current];
  const allBtns = document.querySelectorAll('.quiz-option');
  allBtns.forEach(b => b.disabled = true);
  allBtns[q.ans].classList.add('correct');

  if (idx === q.ans) {
    quizState.score++;
    btn.classList.add('correct');
    document.getElementById('quiz-feedback').style.color = 'var(--neon-green)';
    playSound('victory');
  } else {
    btn.classList.add('wrong');
    document.getElementById('quiz-feedback').style.color = 'var(--neon-pink)';
    playSound('click');
  }

  document.getElementById('quiz-feedback').textContent = q.explain;
  document.getElementById('quiz-score').textContent = quizState.score;

  setTimeout(() => {
    quizState.current++;
    renderQuestion();
  }, 1500);
}

function showQuizResult() {
  const score = quizState.score;
  const total = QUIZ_QUESTIONS.length;
  const pct = Math.round(score / total * 100);
  let grade, msg;

  if (pct >= 80) { grade = '🏆 PARFAIT'; msg = 'Tu es un vrai fan de Sultan !'; }
  else if (pct >= 60) { grade = '⚡ BIEN JOUÉ'; msg = 'Pas mal ! Continue !'; }
  else { grade = '💪 ESSAIE ENCORE'; msg = 'Sultan croit en toi !'; }

  const result = document.getElementById('quiz-result');
  result.style.display = 'block';
  document.getElementById('quiz-container').style.display = 'none';
  result.innerHTML = `
    <div class="result-title">${grade}</div>
    <div class="result-score">Score : ${score}/${total} (${pct}%)</div>
    <p style="color:var(--text-dim);margin-bottom:1rem">${msg}</p>
    <button class="neon-btn small" onclick="initQuiz()">🔄 REJOUER</button>
  `;
  if (pct >= 80) { launchConfetti(); playSound('levelup'); }
}

// ═══════════════════════════════════════════════
// MINI-JEU 3 — HISTOIRE INTERACTIVE
// ═══════════════════════════════════════════════

const STORY = {
  start: {
    text: '🌌 Tu es Sultan Lucien Valenhart, Développeur Élite. Une alerte s\'affiche : un bug critique menace le système. Que fais-tu ?',
    choices: [
      { text: '⚔️ Attaquer le bug frontalement', next: 'fight' },
      { text: '🔍 Analyser le code d\'abord', next: 'analyze' },
    ]
  },
  fight: {
    text: '💥 Tu te lances tête baissée ! Mais le bug est plus complexe que prévu. Tu perds 30 minutes. Que fais-tu ensuite ?',
    choices: [
      { text: '☕ Faire une pause café', next: 'coffee' },
      { text: '📖 Consulter la documentation', next: 'docs' },
    ]
  },
  analyze: {
    text: '🔍 Brillant ! Tu identifies l\'origine du bug en 5 minutes. C\'est un problème d\'asynchronisme. Quelle solution ?',
    choices: [
      { text: '⚡ Utiliser async/await', next: 'async' },
      { text: '🔄 Ajouter des callbacks', next: 'callback' },
    ]
  },
  coffee: {
    text: '☕ Le café t\'inspire ! Tu reviens frais. Tu vois le problème clairement. Tu corriges le bug en 2 lignes. VICTOIRE !',
    choices: [{ text: '🏆 TERMINER', next: 'end_good' }]
  },
  docs: {
    text: '📖 La documentation te guide. Tu trouves la solution officielle. Bug corrigé proprement. VICTOIRE !',
    choices: [{ text: '🏆 TERMINER', next: 'end_good' }]
  },
  async: {
    text: '⚡ async/await parfaitement maîtrisé ! Le code est propre, lisible, et fonctionne à la perfection. VICTOIRE PARFAITE !',
    choices: [{ text: '🏆 TERMINER', next: 'end_perfect' }]
  },
  callback: {
    text: '🔄 Les callbacks fonctionnent mais c\'est un peu messy. Ça marche quand même ! Le système est sauvé.',
    choices: [{ text: '🏆 TERMINER', next: 'end_good' }]
  },
  end_good: {
    text: null,
    result: { type: 'good', title: '🏆 SULTAN GAGNE !', msg: 'Tu as sauvé le système. Le rang Élite est mérité !' }
  },
  end_perfect: {
    text: null,
    result: { type: 'perfect', title: '✨ VICTOIRE PARFAITE !', msg: 'Code propre, solution élégante. Sultan Valenhart亗 — LÉGENDAIRE !' }
  }
};

let choiceState = { node: 'start', steps: 0 };

function initChoice() {
  choiceState = { node: 'start', steps: 0 };
  document.getElementById('choice-result').style.display = 'none';
  document.getElementById('choice-container').style.display = 'block';
  document.getElementById('choice-path').textContent = '0';
  renderChoice();
}

function renderChoice() {
  const node = STORY[choiceState.node];
  if (!node) return;

  if (node.result) {
    showChoiceResult(node.result);
    return;
  }

  document.getElementById('choice-scene').innerHTML = node.text;
  const optContainer = document.getElementById('choice-options');
  optContainer.innerHTML = '';
  node.choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'choice-option';
    btn.textContent = ch.text;
    btn.addEventListener('click', () => {
      choiceState.node = ch.next;
      choiceState.steps++;
      document.getElementById('choice-path').textContent = choiceState.steps;
      playSound('click');
      renderChoice();
    });
    optContainer.appendChild(btn);
  });
}

function showChoiceResult(result) {
  document.getElementById('choice-container').style.display = 'none';
  const res = document.getElementById('choice-result');
  res.style.display = 'block';
  const color = result.type === 'perfect' ? 'var(--neon-gold)' : 'var(--neon-green)';
  res.innerHTML = `
    <div style="font-family:var(--font-main);font-size:1.4rem;color:${color};margin-bottom:0.8rem;text-shadow:0 0 20px ${color}">${result.title}</div>
    <p style="color:var(--text-dim);font-size:1rem;margin-bottom:1.2rem">${result.msg}</p>
    <p style="font-family:var(--font-mono);font-size:0.8rem;color:var(--neon-violet);margin-bottom:1.5rem">Chemin parcouru : ${choiceState.steps} étapes</p>
    <button class="neon-btn small" onclick="initChoice()">🔄 REJOUER</button>
  `;
  if (result.type === 'perfect') { launchConfetti(); playSound('levelup'); }
  else playSound('victory');
}

// ═══════════════════════════════════════════════
// AUDIO SYSTEM
// ═══════════════════════════════════════════════

let audioCtx = null;
let musicOn = false;
let musicNode = null;
let musicGain = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioCtx();
    if (type === 'click') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 800;
      o.type = 'square';
      g.gain.setValueAtTime(0.05, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.start(); o.stop(ctx.currentTime + 0.1);
    } else if (type === 'victory') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        o.type = 'sine';
        const t = ctx.currentTime + i * 0.1;
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.start(t); o.stop(t + 0.2);
      });
    } else if (type === 'levelup') {
      [262, 330, 392, 523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        o.type = 'sine';
        const t = ctx.currentTime + i * 0.08;
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t); o.stop(t + 0.25);
      });
    } else if (type === 'boot') {
      [200, 300, 400, 600].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        o.type = 'sawtooth';
        const t = ctx.currentTime + i * 0.12;
        g.gain.setValueAtTime(0.04, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        o.start(t); o.stop(t + 0.15);
      });
    }
  } catch {}
}

function startBgMusic() {
  try {
    const ctx = getAudioCtx();
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.03;
    musicGain.connect(ctx.destination);

    // Simple ambient arpeggios
    const notes = [261, 329, 392, 523, 659, 523, 392, 329];
    let i = 0;
    function playNote() {
      if (!musicOn) return;
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = notes[i % notes.length];
      o.connect(musicGain);
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.03, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      o.start(); o.stop(ctx.currentTime + 0.4);
      i++;
      if (musicOn) musicNode = setTimeout(playNote, 350);
    }
    playNote();
  } catch {}
}

document.getElementById('music-btn').addEventListener('click', () => {
  musicOn = !musicOn;
  document.getElementById('music-btn').textContent = musicOn ? '🔊' : '🔇';
  if (musicOn) {
    startBgMusic();
    showToast('🎵 Musique activée !');
  } else {
    clearTimeout(musicNode);
    showToast('🔇 Musique désactivée.');
  }
  playSound('click');
});

// ═══════════════════════════════════════════════
// SECRET MODE — Konami code: ↑↑↓↓←→←→BA
// ═══════════════════════════════════════════════

const SECRET_CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let secretBuffer = [];

document.addEventListener('keydown', (e) => {
  secretBuffer.push(e.key);
  if (secretBuffer.length > SECRET_CODE.length) secretBuffer.shift();
  if (secretBuffer.join(',') === SECRET_CODE.join(',')) {
    document.getElementById('secret-overlay').style.display = 'flex';
    playSound('levelup');
    console.log('%c 🔐 SECRET MODE ACTIVATED — Welcome, Elite 亗 ', 'background: #9d00ff; color: white; font-size: 16px; padding: 10px;');
  }
});

document.getElementById('close-secret').addEventListener('click', () => {
  document.getElementById('secret-overlay').style.display = 'none';
  playSound('click');
});

// ═══════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════

let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ═══════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
