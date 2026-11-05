import { AREAS, STAGES, QUESTIONS } from './quiz-data.js';
import { calculateResults, getNextStep, getFutureNote } from './scoring.js';

const app = document.querySelector('#app');
const state = { screen: 'welcome', index: 0, selected: null, answers: {}, feedback: false, installHint: '' };
let installPrompt = null;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function stageFor(question) {
  return STAGES.find(stage => stage.id === question.stage);
}

function renderWelcome() {
  return `
    <section class="welcome-grid" aria-labelledby="welcome-heading">
      <div class="welcome-content">
        <span class="eyebrow"><span class="eyebrow-symbol">✦</span> SUA JORNADA COMEÇA AQUI</span>
        <h1 id="welcome-heading" tabindex="-1">O futuro tem <span class="text-lime">muitos caminhos.</span><br/>Qual você quer explorar?</h1>
        <p class="hero-lead">Seus interesses, seu jeito de pensar e suas ideias sobre o futuro podem abrir portas. Explore suas possibilidades em um jogo feito para descobrir mais sobre você.</p>
        <div class="welcome-actions">
          <button type="button" class="button button-primary button-large" data-action="start">Começar minha jornada <span aria-hidden="true">↗</span></button>
          <span class="subtle-count">27 perguntas · 7 etapas · sem cadastro</span>
        </div>
        <div class="trust-strip"><span aria-hidden="true">✳</span> Sem respostas certas sobre seu perfil <span class="trust-divider">·</span> Suas respostas ficam apenas nesta tela</div>
        <div class="install-card">
          <div class="install-copy"><strong>📱 Use como aplicativo na escola</strong><span>Adicione à tela inicial e jogue mesmo sem internet após abrir o jogo uma vez.</span></div>
          <button type="button" class="button button-secondary install-button" data-action="install">Adicionar ao celular</button>
        </div>
        ${state.installHint ? `<p class="install-hint" role="status" tabindex="-1">${esc(state.installHint)}</p>` : ''}
      </div>
      <div class="welcome-art" aria-label="Seis campos profissionais diferentes para explorar">
        <div class="orbits" aria-hidden="true">
          <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="orbit orbit-c"></div>
          <div class="center-orb"><span class="center-spark">✳</span><small>SEU<br/>FUTURO</small></div>
          <span class="planet p-health">✚</span><span class="planet p-tech">⌘</span><span class="planet p-arts">✺</span><span class="planet p-learn">✦</span><span class="planet p-nature">✿</span><span class="planet p-business">↗</span>
          <div class="floating-label floating-top"><strong>EXPLORE</strong><span>O que desperta você?</span></div>
          <div class="floating-label floating-bottom"><strong>DESCUBRA</strong><span>O próximo passo é seu.</span></div>
        </div>
      </div>
    </section>
    <section class="how-it-works" aria-label="Como funciona o jogo">
      <div class="how-title"><span class="eyebrow">UMA EXPERIÊNCIA EM 3 MOVIMENTOS</span><h2>Sem pressão. Com possibilidades.</h2></div>
      <div class="how-grid">
        <article class="how-card"><span class="how-icon">01</span><h3>Responda</h3><p>Descubra seus interesses, habilidades e o que importa para você.</p></article>
        <article class="how-card"><span class="how-icon">02</span><h3>Explore</h3><p>Conheça áreas profissionais e aprenda com desafios rápidos.</p></article>
        <article class="how-card"><span class="how-icon">03</span><h3>Encontre caminhos</h3><p>Veja seu mapa de interesses e ideias do que explorar depois.</p></article>
      </div>
      <p class="education-note">Este é um jogo educativo para reflexão. Não é um teste psicológico validado e não determina sua profissão.</p>
    </section>`;
}

function renderStageRail(activeStageId) {
  const currentIndex = STAGES.findIndex(stage => stage.id === activeStageId);
  return `<div class="stage-rail" aria-label="Etapas da jornada">${STAGES.map((stage, index) => `
    <div class="rail-item ${index === currentIndex ? 'is-current' : ''} ${index < currentIndex ? 'is-past' : ''}" ${index === currentIndex ? 'aria-current="step"' : ''}>
      <span class="rail-dot">${index < currentIndex ? '✓' : index + 1}</span>
      <span class="rail-name">${esc(stage.title)}</span>
    </div>`).join('')}</div>`;
}

function renderOptions(question) {
  return `<div class="answer-grid" role="group" aria-label="Escolha uma alternativa">${question.options.map((option, index) => {
    const selected = state.selected === option.id;
    const correct = question.kind === 'knowledge' && state.feedback && option.id === question.correct;
    const wrong = question.kind === 'knowledge' && state.feedback && selected && !correct;
    const disabled = question.kind === 'knowledge' && state.feedback;
    return `<button type="button" class="answer-card ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}" data-choice="${esc(option.id)}" aria-pressed="${selected ? 'true' : 'false'}" ${disabled ? 'disabled' : ''}>
        <span class="answer-key" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
        <span class="answer-copy"><strong>${esc(option.label)}</strong>${option.detail ? `<span>${esc(option.detail)}</span>` : ''}</span>
        <span class="answer-indicator" aria-hidden="true">${correct ? '✓' : wrong ? '×' : selected ? '✓' : '○'}</span>
      </button>`;
  }).join('')}</div>`;
}

function renderQuestion() {
  const question = QUESTIONS[state.index];
  const stage = stageFor(question);
  const stageIndex = STAGES.findIndex(s => s.id === question.stage);
  const stageQuestions = QUESTIONS.filter(q => q.stage === question.stage);
  const insideIndex = stageQuestions.findIndex(q => q.id === question.id) + 1;
  const progressPercent = Math.round((state.index / QUESTIONS.length) * 100);
  const feedback = question.kind === 'knowledge' && state.feedback;
  const isCorrect = feedback && state.selected === question.correct;

  return `
    <section class="game-container" aria-labelledby="question-heading">
      <div class="game-topline">
        <span class="eyebrow"><span class="eyebrow-symbol">✦</span> SUA JORNADA</span>
        <span class="counter">PERGUNTA <strong>${state.index + 1}</strong> DE ${QUESTIONS.length}</span>
      </div>
      <div class="progress-track" role="progressbar" aria-label="Progresso geral da jornada" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progressPercent}%"></span></div>
      ${renderStageRail(stage.id)}
      <div class="question-layout">
        <div class="stage-summary">
          <div class="stage-summary-icon" aria-hidden="true">${stage.icon}</div>
          <span class="eyebrow">ETAPA ${String(stageIndex + 1).padStart(2, '0')}</span>
          <h2>${esc(stage.title)}</h2>
          <p>${esc(stage.intro)}</p>
          <div class="stage-progress"><span>${insideIndex} de ${stageQuestions.length} nesta etapa</span><div><span style="width:${Math.round(100 * (insideIndex - 1) / stageQuestions.length)}%"></span></div></div>
        </div>
        <div class="question-card">
          <div class="question-heading-row"><span class="question-tag">${question.kind === 'knowledge' ? 'DESAFIO DE CONHECIMENTO' : question.kind === 'reflection' ? 'REFLEXÃO SOBRE O FUTURO' : 'SUA ESCOLHA'}</span><span class="question-numeral">${String(state.index + 1).padStart(2, '0')}</span></div>
          <h1 id="question-heading" tabindex="-1">${esc(question.title)}</h1>
          ${question.help ? `<p class="question-hint">${esc(question.help)}</p>` : ''}
          ${renderOptions(question)}
          ${feedback ? `<div class="knowledge-feedback ${isCorrect ? 'is-correct' : 'is-learning'}" role="status" tabindex="-1"><strong>${isCorrect ? 'Boa! Você acertou.' : 'Boa tentativa! Aprender faz parte.'}</strong><p>${esc(question.explanation)}</p></div>` : ''}
          <div class="question-actions">
            <button type="button" class="button button-quiet" data-action="back">${state.index === 0 ? 'Voltar ao início' : '← Anterior'}</button>
            <button type="button" class="button button-primary" data-action="next" ${!state.selected ? 'disabled' : ''}>${question.kind === 'knowledge' && !feedback ? 'Conferir resposta' : state.index === QUESTIONS.length - 1 ? 'Ver meu mapa ↗' : 'Continuar →'}</button>
          </div>
        </div>
      </div>
      <div class="below-question">Não existe resposta errada sobre quem você é. E tudo bem mudar de ideia.</div>
    </section>`;
}

function renderResults() {
  const result = calculateResults(state.answers);
  const [first, second] = result.ranking;
  const areaRows = result.ranking.map((area, i) => `
    <div class="area-row">
      <div class="area-heading"><span class="area-title"><span aria-hidden="true">${area.emoji}</span> ${esc(area.title)}</span><span class="area-value">${area.percent}%</span></div>
      <div class="area-bar" role="meter" aria-label="${esc(area.title)}: ${area.percent} por cento dos pontos possíveis" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${area.percent}"><span style="width:${area.percent}%;background:${area.color}"></span></div>
    </div>`).join('');
  const highlight = (area, title, extraClass) => `<article class="featured-area ${extraClass}">
    <div class="featured-label">${title}</div>
    <span class="featured-emoji" aria-hidden="true">${area.emoji}</span>
    <h3>${esc(area.title)}</h3><p>${esc(area.description)}</p>
    <div class="career-list" aria-label="Exemplos de profissões">${area.careers.map(c => `<span>${esc(c)}</span>`).join('')}</div>
  </article>`;

  return `<section class="results-container" aria-labelledby="results-heading">
    <div class="result-hero">
      <div><span class="eyebrow"><span class="eyebrow-symbol">✦</span> JORNADA CONCLUÍDA</span><h1 id="results-heading" tabindex="-1">Seu futuro não cabe <span class="text-lime">em uma única resposta.</span></h1><p>Este é o seu mapa de interesses de hoje. Use-o como ponto de partida para conhecer novas possibilidades — não como um rótulo.</p></div>
      <div class="result-burst" aria-hidden="true"><span>✳</span><small>SEU<br/>MAPA</small></div>
    </div>
    <div class="result-intro"><span class="result-spark">✦</span><div><strong>As áreas que mais apareceram nas suas escolhas</strong><p>Essas são sugestões exploratórias, não uma previsão da profissão ideal.</p></div></div>
    <div class="features-grid">
      ${highlight(first, '01 · ÁREA EM DESTAQUE', 'feature-primary')}
      ${highlight(second, '02 · OUTRA ÁREA PARA EXPLORAR', 'feature-secondary')}
    </div>
    <div class="details-grid">
      <section class="data-card" aria-labelledby="ranking-heading">
        <div class="card-heading"><div><span class="eyebrow">PANORAMA</span><h2 id="ranking-heading">Todas as suas áreas</h2></div><span class="heading-icon" aria-hidden="true">◫</span></div>
        <div class="areas-list">${areaRows}</div>
        <p class="metric-explain">Cada percentual é a proporção de pontos recebidos em relação ao máximo possível naquela área, considerando as ${result.answeredProfile} respostas de perfil. Não representa probabilidade, aptidão medida nem chance de sucesso.</p>
      </section>
      <section class="data-card steps-card" aria-labelledby="next-heading">
        <div class="card-heading"><div><span class="eyebrow">PRÓXIMO CAPÍTULO</span><h2 id="next-heading">O que fazer com isso?</h2></div><span class="heading-icon" aria-hidden="true">↗</span></div>
        <p class="next-step-feature">${esc(getNextStep(state.answers))}</p>
        <ul class="steps-list">${first.experiments.slice(0,2).map(step => `<li><span aria-hidden="true">✓</span>${esc(step)}</li>`).join('')}</ul>
        <p class="future-note">${esc(getFutureNote(state.answers))}</p>
      </section>
    </div>
    <div class="closing-grid">
      <div class="knowledge-summary"><span class="knowledge-icon" aria-hidden="true">💡</span><div><strong>Você também explorou o mundo das profissões</strong><p>Acertou ${result.knowledgeCorrect} de ${result.knowledgeAnswered} desafios. Eles servem para aprender e não alteraram seu mapa de interesses.</p></div></div>
      <div class="result-actions"><button type="button" class="button button-secondary" data-action="print">Imprimir meu mapa ↗</button><button type="button" class="button button-primary" data-action="restart">Refazer jornada ↻</button></div>
    </div>
    <p class="education-note result-disclaimer">Este jogo não substitui conversas com educadores e profissionais de orientação profissional. Interesses mudam, contextos importam e existem muitos caminhos de formação e trabalho.</p>
  </section>`;
}

function render({ focusHeading = false, focusChoice = false, focusFeedback = false } = {}) {
  document.documentElement.dataset.screen = state.screen;
  app.innerHTML = state.screen === 'welcome' ? renderWelcome() : state.screen === 'results' ? renderResults() : renderQuestion();
  if (focusFeedback) app.querySelector('.knowledge-feedback')?.focus({ preventScroll: true });
  else if (focusChoice) app.querySelector('.answer-card.selected')?.focus({ preventScroll: true });
  else if (focusHeading) app.querySelector('h1')?.focus({ preventScroll: true });
}

function start() {
  state.screen = 'question';
  state.index = 0;
  state.selected = null;
  state.answers = {};
  state.feedback = false;
  render({ focusHeading: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function back() {
  if (state.feedback) {
    state.feedback = false;
    render({ focusHeading: true });
    return;
  }
  if (state.index === 0) {
    state.screen = 'welcome';
    render({ focusHeading: true });
    return;
  }
  state.index -= 1;
  state.selected = state.answers[QUESTIONS[state.index].id] ?? null;
  state.feedback = false;
  render({ focusHeading: true });
}

function next() {
  const question = QUESTIONS[state.index];
  if (!question || !question.options.some(option => option.id === state.selected)) return;
  if (question.kind === 'knowledge' && !state.feedback) {
    state.feedback = true;
    render({ focusFeedback: true });
    return;
  }
  state.answers[question.id] = state.selected;
  if (state.index === QUESTIONS.length - 1) {
    state.screen = 'results';
  } else {
    state.index += 1;
    state.selected = state.answers[QUESTIONS[state.index].id] ?? null;
    state.feedback = false;
  }
  render({ focusHeading: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

app.addEventListener('click', event => {
  const control = event.target.closest('button');
  if (!control || !app.contains(control)) return;
  const action = control.dataset.action;
  if (action === 'start' || action === 'restart') return start();
  if (action === 'back') return back();
  if (action === 'next') return next();
  if (action === 'print') return window.print();
  if (action === 'install') return installOnPhone();
  if (control.dataset.choice) {
    const question = QUESTIONS[state.index];
    if (state.screen !== 'question' || state.feedback) return;
    if (!question.options.some(option => option.id === control.dataset.choice)) return;
    state.selected = control.dataset.choice;
    render({ focusChoice: true });
  }
});

render();

// Instalação opcional: o jogo também funciona diretamente no navegador.
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
});

async function installOnPhone() {
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    state.installHint = 'O jogo já está aberto como aplicativo neste celular.';
  } else if (installPrompt) {
    const prompt = installPrompt;
    installPrompt = null;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      state.installHint = choice.outcome === 'accepted'
        ? 'Instalação solicitada. Procure o ícone do jogo na sua tela inicial.'
        : 'Você também pode instalar pelo menu do navegador, quando quiser.';
    } catch {
      state.installHint = 'Abra o menu do navegador e escolha “Adicionar à tela inicial” ou “Instalar app”.';
    }
  } else {
    state.installHint = 'No iPhone: toque em Compartilhar e depois em “Adicionar à Tela de Início”. No Android: abra o menu ⋮ e escolha “Adicionar à tela inicial” ou “Instalar app”.';
  }
  render();
  app.querySelector('.install-hint')?.focus({ preventScroll: true });
}

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .catch(() => { /* Em visualização local sem HTTPS, o jogo continua disponível on-line. */ });
  });
}
