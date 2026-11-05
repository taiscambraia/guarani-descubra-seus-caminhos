import { AREAS, STAGES, QUESTIONS } from './quiz-data.js';
import { calculateResults, getNextStep, getFutureNote } from './scoring.js';

const app = document.querySelector('#app');
const state = { screen: 'home', index: 0, selected: null, answers: {}, feedback: false, started: false, complete: false, area: null, resultTab: 'highlights', installHint: '' };
let installPrompt = null;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const paths = {
  home: '<path d="m3 10 9-7 9 7v10H6V10m3 10v-7h6v7"/>',
  journey: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
  areas: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  back: '<path d="m14 6-6 6 6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.journey}</svg>`;
const button = (action, text, secondary = false) => `<button class="button ${secondary ? 'secondary' : 'primary'}" data-action="${action}">${text}</button>`;
const title = (eyebrow, heading, description = '') => `<div class="screen-title"><span class="eyebrow">${eyebrow}</span><h1 tabindex="-1">${heading}</h1>${description ? `<p>${description}</p>` : ''}</div>`;
const answered = () => Object.keys(state.answers).length;
const stageFor = q => STAGES.find(s => s.id === q.stage);

function home() {
  return `<section class="home-screen">
    <div class="home-greeting"><span class="eyebrow">SEU FUTURO, DO SEU JEITO</span><span class="tiny-tag">27 escolhas</span></div>
    <div class="discovery-card">
      <div class="compass-art" aria-hidden="true"><span class="orbit"></span><span class="compass">${icon('journey')}</span><span class="spark spark-one">✦</span><span class="spark spark-two">✦</span><span class="path-dot"></span></div>
      <span class="eyebrow">DESCUBRA SEUS CAMINHOS</span>
      <h1 tabindex="-1">O próximo passo<br>começa em você.</h1>
      <p>Explore seus interesses e descubra possibilidades para o seu futuro.</p>
      <div class="home-stats"><span><strong>7</strong> etapas</span><span><strong>27</strong> perguntas</span><span><strong>6</strong> áreas</span></div>
      ${button(state.complete ? 'map' : 'start', `${state.complete ? 'Ver meu mapa' : state.started ? 'Continuar jornada' : 'Começar minha jornada'} ${icon('arrow')}`)}
    </div>
    <button class="list-link" data-action="areas"><span class="tile-icon">${icon('areas')}</span><span><strong>Que caminhos existem?</strong><small>Conheça as seis áreas profissionais</small></span>${icon('arrow')}</button>
    <p class="privacy-note">Sem cadastro. Suas escolhas ficam só nesta sessão.<br>Este jogo não determina sua profissão.</p>
  </section>`;
}
function journey() {
  return `<section>${title('UM PASSO DE CADA VEZ', 'Sua jornada', 'Conheça o caminho. Você pode sair das perguntas e continuar enquanto o app estiver aberto.')}
    <div class="progress-card"><div><strong>${answered()} de 27</strong><span> escolhas concluídas</span></div><progress max="27" value="${answered()}" aria-label="Perguntas concluídas"></progress></div>
    <ol class="stage-list">${STAGES.map((stage, i) => {
      const qs = QUESTIONS.filter(q => q.stage === stage.id);
      const done = stage.id === 'resultado' ? state.complete : qs.every(q => state.answers[q.id]);
      const current = !state.complete && (state.started ? QUESTIONS[state.index].stage === stage.id : i === 0);
      return `<li class="${done ? 'done' : current ? 'current' : ''}"><span class="stage-number">${done ? icon('check') : String(i + 1).padStart(2, '0')}</span><div><strong>${esc(stage.title)}</strong><small>${esc(stage.small)}</small></div>${current ? '<span class="current-label">Agora</span>' : ''}</li>`;
    }).join('')}</ol>
    ${button(state.complete ? 'map' : 'start', state.complete ? 'Explorar meu mapa' : state.started ? 'Continuar de onde parei' : 'Começar jornada')}
  </section>`;
}
function areas() {
  if (state.area) {
    const a = AREAS.find(x => x.id === state.area);
    return `<section><button class="text-button" data-action="areas">${icon('back')} Todas as áreas</button><div class="area-detail-icon" aria-hidden="true">${a.emoji}</div>${title('UM CAMINHO PARA EXPLORAR', esc(a.title), esc(a.description))}<h2>Profissões para conhecer</h2><div class="career-list">${a.careers.map(c => `<span>${esc(c)}</span>`).join('')}</div><h2>Experimente na prática</h2><ul class="experiment-list">${a.experiments.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="info-note">São exemplos, não limites. Uma mesma profissão pode combinar interesses de várias áreas.</p></section>`;
  }
  return `<section>${title('EXPLORE POSSIBILIDADES', 'Um mundo de caminhos', 'Não precisa escolher agora. Toque em uma área para conhecer profissões e ideias para experimentar.')}
    <div class="area-catalog">${AREAS.map(a => `<button class="area-tile" data-area="${a.id}"><span class="area-emoji" aria-hidden="true">${a.emoji}</span><strong>${esc(a.title)}</strong><span>${esc(a.short)}</span><small>Explorar ${icon('arrow')}</small></button>`).join('')}</div></section>`;
}
function question() {
  const q = QUESTIONS[state.index];
  const stage = stageFor(q);
  const stageIndex = STAGES.indexOf(stage) + 1;
  return `<section class="question-screen" aria-labelledby="question-title"><div class="question-progress"><span>ETAPA ${stageIndex} DE 7 · ${esc(stage.title)}</span><strong>${state.index + 1}<span> / 27</span></strong></div>
    <progress max="27" value="${state.index}" aria-label="Progresso da jornada"></progress>
    <div class="question-body"><span class="question-type">${q.kind === 'knowledge' ? 'DESAFIO DE CONHECIMENTO' : q.kind === 'reflection' ? 'OLHANDO PARA O FUTURO' : 'O QUE COMBINA COM VOCÊ?'}</span><h1 id="question-title" tabindex="-1">${esc(q.title)}</h1><p class="question-help">${esc(q.help || stage.intro)}</p>
    <div class="answer-list" role="group" aria-label="Escolha uma alternativa">${q.options.map((o, i) => {
      const selected = state.selected === o.id;
      const correct = state.feedback && o.id === q.correct;
      const wrong = state.feedback && selected && !correct;
      return `<button class="answer ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}" data-choice="${esc(o.id)}" aria-pressed="${selected}" ${state.feedback ? 'disabled' : ''}><span class="answer-letter">${correct ? '✓' : wrong ? '×' : String.fromCharCode(65 + i)}</span><span><strong>${esc(o.label)}</strong>${o.detail ? `<small>${esc(o.detail)}</small>` : ''}</span><span class="answer-radio" aria-hidden="true">${selected ? icon('check') : ''}</span></button>`;
    }).join('')}</div>
    ${state.feedback ? `<div class="feedback" role="status" tabindex="-1"><strong>${state.selected === q.correct ? 'Boa! Você acertou.' : 'Aprender faz parte do caminho.'}</strong><p>${esc(q.explanation)}</p></div>` : ''}</div></section>`;
}
function map() {
  if (!state.complete) return `<section class="empty-map"><div class="empty-map-art">${icon('map')}</div>${title('SUAS DESCOBERTAS', 'Seu mapa está a caminho', 'Conclua a jornada para descobrir as áreas que mais aparecem nas suas escolhas.')}${state.started ? `<p class="info-note">Você já concluiu ${answered()} de 27 escolhas.</p>` : ''}${button('start', state.started ? 'Continuar minha jornada' : 'Começar minha jornada')}<p class="privacy-note">Se fechar ou recarregar o app, as respostas serão apagadas.</p></section>`;
  const result = calculateResults(state.answers);
  const tabs = [['highlights', 'Destaques'], ['ranking', 'Panorama'], ['next', 'Próximos passos']];
  let content;
  if (state.resultTab === 'highlights') content = `<p class="map-intro">Os caminhos que mais apareceram nas suas escolhas de hoje.</p>${result.ranking.slice(0, 2).map((a, i) => `<button class="result-area" data-area="${a.id}"><span class="result-label">0${i + 1} · ${i ? 'TAMBÉM PARA EXPLORAR' : 'SEU PRIMEIRO DESTAQUE'}</span><span class="result-emoji" aria-hidden="true">${a.emoji}</span><h2>${esc(a.title)}</h2><p>${esc(a.short)}</p><span class="text-link">Conhecer esse caminho ${icon('arrow')}</span></button>`).join('')}`;
  else if (state.resultTab === 'ranking') content = `<div class="ranking">${result.ranking.map(a => `<div class="ranking-row"><div><strong>${a.emoji} ${esc(a.title)}</strong><span>${a.percent}%</span></div><meter min="0" max="100" value="${a.percent}" aria-label="${esc(a.title)}"></meter></div>`).join('')}</div><p class="info-note">Proporção dos pontos possíveis em cada área, considerando ${result.answeredProfile} respostas de perfil. Não representa probabilidade, aptidão medida ou chance de sucesso.</p>`;
  else content = `<div class="next-card"><span class="eyebrow">SEU PRÓXIMO PASSO</span><h2>Da descoberta à experiência</h2><p>${esc(getNextStep(state.answers))}</p></div><ul class="experiment-list">${result.ranking[0].experiments.slice(0, 2).map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="info-note">${esc(getFutureNote(state.answers))}</p><p class="info-note">Você acertou ${result.knowledgeCorrect} de ${result.knowledgeAnswered} desafios sobre profissões. Eles não alteram seu mapa de interesses.</p>${button('print', 'Imprimir meu mapa', true)}${button('restart-confirm', 'Refazer a jornada', true)}`;
  return `<section>${title('JORNADA CONCLUÍDA', 'Seu mapa de interesses')}<div class="segments" role="group" aria-label="Seções do mapa">${tabs.map(([id, label]) => `<button data-result-tab="${id}" aria-pressed="${state.resultTab === id}">${label}</button>`).join('')}</div>${content}<p class="privacy-note">Um ponto de partida, não um rótulo. Interesses mudam.<br>Este jogo não é um teste psicológico validado.</p></section>`;
}
function info() {
  return `<section>${title('NO SEU CELULAR', 'Leve seus caminhos com você', 'Adicione o Guarani à tela inicial para abrir como aplicativo.')}${button('install', `${icon('download')} Adicionar à tela inicial`)}<p class="info-note" role="status">${esc(state.installHint || 'No iPhone: Compartilhar → Adicionar à Tela de Início. No Android: menu do navegador → Instalar app ou Adicionar à tela inicial.')}</p><h2>Sem internet?</h2><p>Depois de carregar o jogo com internet e concluir o preparo offline, você pode abrir o aplicativo sem conexão.</p><p class="offline-state" role="status">${esc(offlineStatus)}</p><h2>Suas respostas são suas</h2><p>Sem cadastro e sem envio de respostas. Elas existem apenas nesta sessão e desaparecem ao fechar ou recarregar o app.</p><p class="info-note">Atividade educativa para explorar interesses. Não é um teste psicológico validado e não determina uma profissão.</p></section>`;
}
let offlineStatus = 'Preparando arquivos para uso offline…';
function render({ focus = false, keepScroll = false, choice = false, feedback = false } = {}) {
  const scroll = app.querySelector('.screen-content')?.scrollTop || 0;
  const isQuestion = state.screen === 'question';
  const navScreen = state.screen === 'area' ? 'areas' : state.screen;
  const labels = { home: 'Descubra seus caminhos', journey: 'Sua jornada', areas: 'Explore as áreas', area: 'Explore as áreas', map: 'Meu mapa', info: 'Sobre o aplicativo' };
  const content = isQuestion ? question() : state.screen === 'journey' ? journey() : ['areas', 'area'].includes(state.screen) ? areas() : state.screen === 'map' ? map() : state.screen === 'info' ? info() : home();
  app.innerHTML = `<div class="app-shell"><header class="app-header">${isQuestion ? `<button class="icon-button" data-action="pause" aria-label="Pausar e ver a jornada">${icon('close')}</button><div class="header-title"><strong>Sua jornada</strong><small>Uma escolha de cada vez</small></div>` : `<span class="brand-mark" aria-hidden="true">G<span>↗</span></span><div class="header-title"><strong>ESCOLA GUARANI</strong><small>${labels[state.screen]}</small></div><button class="icon-button" data-action="info" aria-label="Sobre e instalar aplicativo">${icon('info')}</button>`}</header><main id="conteudo" class="screen-content" tabindex="-1">${content}</main>${isQuestion ? `<footer class="question-controls"><button class="button secondary" data-action="back" aria-label="${state.index ? 'Pergunta anterior' : 'Voltar à jornada'}">${icon('back')} Voltar</button><button class="button primary" data-action="next" ${!state.selected ? 'disabled' : ''}>${QUESTIONS[state.index].kind === 'knowledge' && !state.feedback ? 'Conferir' : state.index === QUESTIONS.length - 1 ? 'Ver meu mapa' : 'Continuar'} ${icon('arrow')}</button></footer>` : `<nav class="tab-bar" aria-label="Navegação principal">${[['home', 'Início'], ['journey', 'Jornada'], ['areas', 'Áreas'], ['map', 'Meu mapa']].map(([id, label]) => `<button data-action="${id}" ${navScreen === id ? 'aria-current="page"' : ''}>${icon(id)}<span>${label}</span></button>`).join('')}</nav>`}</div>`;
  if (keepScroll) app.querySelector('.screen-content').scrollTop = scroll;
  if (feedback) app.querySelector('.feedback')?.focus({ preventScroll: true });
  else if (choice) app.querySelector('.answer.selected')?.focus({ preventScroll: true });
  else if (focus) app.querySelector('h1')?.focus({ preventScroll: true });
}
function go(screen) { state.screen = screen; if (screen === 'areas') state.area = null; render({ focus: true }); }
function start() { state.started = true; go('question'); }
function next() {
  const q = QUESTIONS[state.index];
  if (!q.options.some(o => o.id === state.selected)) return;
  if (q.kind === 'knowledge' && !state.feedback) { state.feedback = true; render({ feedback: true, keepScroll: true }); app.querySelector('.feedback')?.scrollIntoView({ block: 'nearest' }); return; }
  state.answers[q.id] = state.selected;
  if (state.index === QUESTIONS.length - 1) { state.complete = true; state.resultTab = 'highlights'; go('map'); return; }
  state.index++;
  state.selected = state.answers[QUESTIONS[state.index].id] ?? null;
  state.feedback = false;
  render({ focus: true });
}
function back() {
  if (state.feedback) state.feedback = false;
  else if (!state.index) { go('journey'); return; }
  else { state.index--; state.selected = state.answers[QUESTIONS[state.index].id] ?? null; }
  render({ focus: true });
}
app.addEventListener('click', e => {
  const control = e.target.closest('button');
  if (!control || !app.contains(control)) return;
  if (control.dataset.choice) {
    if (state.screen !== 'question' || state.feedback) return;
    state.selected = control.dataset.choice;
    render({ keepScroll: true, choice: true }); return;
  }
  if (control.dataset.area) { state.area = control.dataset.area; go('area'); return; }
  if (control.dataset.resultTab) { state.resultTab = control.dataset.resultTab; render(); return; }
  const action = control.dataset.action;
  if (['home', 'journey', 'areas', 'map', 'info'].includes(action)) return go(action);
  if (action === 'start') return start();
  if (action === 'pause') return go('journey');
  if (action === 'next') return next();
  if (action === 'back') return back();
  if (action === 'install') return install();
  if (action === 'print') return printMap();
  if (action === 'restart-confirm') {
    const dialog = document.querySelector('#restart-dialog'); dialog.showModal(); return;
  }
});
document.querySelector('#restart-dialog').addEventListener('close', e => {
  if (e.target.returnValue !== 'restart') return;
  Object.assign(state, { screen: 'question', index: 0, selected: null, answers: {}, feedback: false, started: true, complete: false });
  render({ focus: true });
});
function printMap() {
  const r = calculateResults(state.answers);
  document.querySelector('#print-map').innerHTML = `<h1>Seu mapa de interesses — Escola Guarani</h1><p>Um ponto de partida para explorar, não um diagnóstico.</p>${r.ranking.map(a => `<h2>${esc(a.title)} · ${a.percent}%</h2><p>${esc(a.description)}</p><p>${a.careers.map(esc).join(' · ')}</p>`).join('')}<h2>Próximos passos</h2><p>${esc(getNextStep(state.answers))}</p><p>${esc(getFutureNote(state.answers))}</p>`;
  window.print();
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; });
async function install() {
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) state.installHint = 'Você já está usando o aplicativo instalado.';
  else if (installPrompt) {
    const prompt = installPrompt; installPrompt = null;
    try { await prompt.prompt(); const choice = await prompt.userChoice; state.installHint = choice.outcome === 'accepted' ? 'Instalação solicitada. Procure o ícone na tela inicial.' : 'Você pode instalar depois pelo menu do navegador.'; }
    catch { state.installHint = 'Use o menu do navegador para adicionar à tela inicial.'; }
  } else state.installHint = 'No iPhone: Compartilhar → Adicionar à Tela de Início. No Android: menu ⋮ → Instalar app ou Adicionar à tela inicial. A opção depende do navegador e exige HTTPS.';
  render();
}
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then(() => navigator.serviceWorker.ready).then(() => {
    offlineStatus = 'Pronto para abrir sem internet neste navegador.';
    if (state.screen === 'info') render();
  }).catch(() => { offlineStatus = 'Preparo offline indisponível. Conecte-se à internet e tente abrir novamente.'; if (state.screen === 'info') render(); });
} else offlineStatus = 'Para instalar e preparar o modo offline, abra o jogo por HTTPS ou localhost.';
render();
