import { AREAS, QUESTIONS } from './quiz-data.js';

/**
 * Somente as perguntas do tipo `profile` compõem o mapa.
 * Cada área é dividida pelo máximo de pontos que poderia receber.
 * Valores de 0–100 indicam um índice exploratório e NÃO precisão psicométrica.
 */
export function calculateResults(answers, questions = QUESTIONS, areas = AREAS) {
  const points = Object.fromEntries(areas.map(area => [area.id, 0]));
  const maximums = Object.fromEntries(areas.map(area => [area.id, 0]));
  const contributions = Object.fromEntries(areas.map(area => [area.id, []]));
  let answeredProfile = 0;

  for (const question of questions) {
    if (question.kind !== 'profile') continue;
    const selected = question.options.find(option => option.id === answers[question.id]);
    if (!selected) continue;
    answeredProfile += 1;
    for (const area of areas) {
      const max = Math.max(0, ...question.options.map(option => option.weights?.[area.id] ?? 0));
      const score = selected.weights?.[area.id] ?? 0;
      maximums[area.id] += max;
      points[area.id] += score;
      if (score > 0) contributions[area.id].push({ question: question.id, score });
    }
  }

  const ranking = areas.map(area => ({
    ...area,
    points: points[area.id],
    possible: maximums[area.id],
    percent: maximums[area.id] ? Math.round(100 * points[area.id] / maximums[area.id]) : 0,
    contributionCount: contributions[area.id].length
  })).sort((a, b) => b.percent - a.percent || b.points - a.points || areas.findIndex(x => x.id === a.id) - areas.findIndex(x => x.id === b.id));

  const knowledgeQuestions = questions.filter(q => q.kind === 'knowledge');
  const knowledgeAnswered = knowledgeQuestions.filter(q => q.options.some(o => o.id === answers[q.id]));
  const knowledgeCorrect = knowledgeAnswered.filter(q => answers[q.id] === q.correct).length;

  return { ranking, answeredProfile, knowledgeAnswered: knowledgeAnswered.length, knowledgeCorrect };
}

export function getNextStep(answers) {
  const suggestions = {
    conversa: 'Converse com alguém que trabalhe em uma das áreas que apareceram no seu mapa.',
    visita: 'Procure conhecer um local de trabalho ou uma feira de profissões.',
    cursos: 'Pesquise cursos técnicos, graduações e formas de ingresso ligados aos seus interesses.',
    experiencia: 'Escolha uma atividade ou oficina para experimentar essa área na prática.',
    tempo: 'Escolha duas áreas para pesquisar com calma. Descobrir leva tempo e isso é normal.'
  };
  return suggestions[answers.f2] ?? 'Converse com pessoas, pesquise formações e experimente atividades antes de decidir.';
}

export function getFutureNote(answers) {
  if (answers.f3 === 'pressionado') return 'Sentir pressão para escolher pode acontecer. Você não precisa decidir tudo hoje: conversar com alguém de confiança pode ajudar.';
  if (answers.f3 === 'incerto') return 'Não saber por onde começar é uma possibilidade legítima. Um primeiro passo pequeno já conta.';
  if (answers.f3 === 'ideia') return 'Ter uma ideia é ótimo — e continuar explorando outras possibilidades também.';
  return 'Seus interesses podem mudar conforme você aprende e conhece experiências novas.';
}
