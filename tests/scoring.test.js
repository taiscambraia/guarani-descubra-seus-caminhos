import test from 'node:test';
import assert from 'node:assert/strict';
import { AREAS, QUESTIONS } from '../src/quiz-data.js';
import { calculateResults, getNextStep, getFutureNote } from '../src/scoring.js';

const answerAllWithFirst = () => Object.fromEntries(QUESTIONS.map(q => [q.id, q.options[0].id]));

test('Há sete etapas, seis áreas e perguntas com IDs únicos', () => {
  assert.equal(AREAS.length, 6);
  assert.equal(QUESTIONS.length, 27);
  assert.equal(new Set(QUESTIONS.map(q => q.id)).size, QUESTIONS.length);
  for (const q of QUESTIONS) {
    assert.ok(q.options.length >= 2, q.id);
    assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length, q.id);
    if (q.kind === 'knowledge') assert.ok(q.options.some(o => o.id === q.correct), q.id);
  }
});

test('Pontuação normalizada se mantém entre 0% e 100%', () => {
  const result = calculateResults(answerAllWithFirst());
  assert.equal(result.answeredProfile, 20);
  assert.equal(result.knowledgeAnswered, 4);
  for (const area of result.ranking) {
    assert.ok(area.possible > 0, area.id);
    assert.ok(area.percent >= 0 && area.percent <= 100, area.id);
    assert.ok(area.points <= area.possible, area.id);
  }
});

test('Conhecimentos e expectativas não mudam o mapa de interesses', () => {
  const before = answerAllWithFirst();
  const after = { ...before, f1: 'trabalho', f2: 'conversa', f3: 'pressionado', k1: 'b', k2: 'c', k3: 'b', k4: 'c' };
  const a = calculateResults(before);
  const b = calculateResults(after);
  assert.deepEqual(a.ranking.map(({ id, percent }) => [id, percent]), b.ranking.map(({ id, percent }) => [id, percent]));
  assert.equal(b.knowledgeCorrect, 4);
});

test('Mais escolhas de tecnologia destacam tecnologia no resultado', () => {
  const answers = Object.fromEntries(QUESTIONS.map(q => {
    const best = q.options.reduce((top, candidate) => (candidate.weights?.tecnologia ?? 0) > (top.weights?.tecnologia ?? 0) ? candidate : top, q.options[0]);
    return [q.id, best.id];
  }));
  const result = calculateResults(answers);
  assert.equal(result.ranking[0].id, 'tecnologia');
  assert.equal(result.ranking[0].percent, 100);
});

test('Respostas não selecionadas não geram pontos imaginários', () => {
  const result = calculateResults({});
  assert.equal(result.answeredProfile, 0);
  assert.ok(result.ranking.every(area => area.points === 0 && area.percent === 0));
});

test('Sugestão de próximo passo e nota para o futuro respondem sem diagnóstico', () => {
  assert.match(getNextStep({ f2: 'cursos' }), /cursos técnicos/);
  assert.match(getFutureNote({ f3: 'pressionado' }), /não precisa decidir/);
});
