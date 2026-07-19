// script.js
const questions = Array.isArray(window.PREDICTIONS) ? window.PREDICTIONS : PREDICTIONS;

let current = 0;
const userAnswers = [];

const els = {
  progress: document.getElementById('progress'),
  quiz: document.getElementById('quiz'),
  results: document.getElementById('results'),
  counter: document.getElementById('counter'),
  question: document.getElementById('question'),
  btnOui: document.getElementById('btn-oui'),
  btnNon: document.getElementById('btn-non'),
  score: document.getElementById('score'),
  scoreLabel: document.getElementById('score-label'),
  list: document.getElementById('list'),
  restart: document.getElementById('restart'),
};

function buildProgress() {
  els.progress.innerHTML = '';
  questions.forEach((_, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'line';
      els.progress.appendChild(line);
    }
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.dataset.index = i;
    els.progress.appendChild(dot);
  });
  updateProgress();
}

function updateProgress() {
  const dots = els.progress.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('done', 'current');
    if (i < current) dot.classList.add('done');
    else if (i === current) dot.classList.add('current');
  });
}

function renderQuestion() {
  const q = questions[current];
  els.counter.textContent = `Question ${current + 1} sur ${questions.length}`;
  els.question.textContent = q.question;
  updateProgress();
}

function answer(value) {
  const q = questions[current];
  userAnswers.push({
    question: q.question,
    expected: q.reponse,
    given: value,
    correct: value === q.reponse,
  });

  current++;
  if (current < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  els.quiz.classList.add('hidden');
  els.results.classList.remove('hidden');

  const correctCount = userAnswers.filter(a => a.correct).length;
  els.score.textContent = `${correctCount} / ${questions.length}`;
  els.scoreLabel.textContent = correctCount === questions.length
    ? "Toutes tes prédictions étaient justes."
    : correctCount === 0
      ? "Aucune prédiction juste cette fois."
      : "prédictions correctes";

  els.list.innerHTML = '';
  userAnswers.forEach(a => {
    const item = document.createElement('div');
    item.className = `item ${a.correct ? 'correct' : 'wrong'}`;

    const mark = document.createElement('div');
    mark.className = 'mark';
    mark.textContent = a.correct ? '✓' : '✕';

    const text = document.createElement('div');
    text.className = 'text';
    text.innerHTML = `
      <div class="q">${a.question}</div>
      <div class="a">Ta réponse : <b>${a.given === 'oui' ? 'Oui' : 'Non'}</b> — Réponse attendue : <b>${a.expected === 'oui' ? 'Oui' : 'Non'}</b></div>
    `;

    item.appendChild(mark);
    item.appendChild(text);
    els.list.appendChild(item);
  });
}

function restart() {
  current = 0;
  userAnswers.length = 0;
  els.results.classList.add('hidden');
  els.quiz.classList.remove('hidden');
  buildProgress();
  renderQuestion();
}

els.btnOui.addEventListener('click', () => answer('oui'));
els.btnNon.addEventListener('click', () => answer('non'));
els.restart.addEventListener('click', restart);

// Init
buildProgress();
renderQuestion();
