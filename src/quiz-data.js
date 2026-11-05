/** Conteúdo pedagógico. Não é instrumento psicológico validado. */
export const AREAS = [
  {
    id: 'saude', title: 'Saúde e Bem-estar', emoji: '💚', color: '#66e0b0',
    short: 'Cuidar, acolher e compreender o bem-estar das pessoas.',
    description: 'Você demonstrou interesse por temas ligados à saúde, à escuta e ao cuidado. Vale explorar como diferentes profissionais contribuem para o bem-estar físico e emocional.',
    careers: ['Psicologia', 'Enfermagem', 'Medicina', 'Fisioterapia', 'Nutrição', 'Terapia Ocupacional'],
    experiments: ['Converse com alguém que trabalhe na área da saúde.', 'Pesquise a rotina de duas profissões diferentes de cuidado.', 'Participe de uma atividade escolar sobre saúde e prevenção.']
  },
  {
    id: 'tecnologia', title: 'Tecnologia e Dados', emoji: '💻', color: '#83a5ff',
    short: 'Investigar, programar e encontrar soluções com tecnologia.',
    description: 'Suas escolhas apontam curiosidade por raciocínio, sistemas e soluções tecnológicas. Essa área vai muito além de programar e reúne diferentes maneiras de resolver problemas.',
    careers: ['Análise e Desenvolvimento de Sistemas', 'Engenharia de Software', 'Ciência de Dados', 'Cibersegurança', 'Design de Produto Digital', 'Suporte em TI'],
    experiments: ['Experimente uma oficina gratuita de programação.', 'Observe que problemas da escola poderiam ter solução digital.', 'Pesquise a diferença entre programação, dados e segurança digital.']
  },
  {
    id: 'educacao', title: 'Educação e Humanidades', emoji: '📚', color: '#c2a1ff',
    short: 'Compartilhar conhecimento, explicar e aprender com pessoas.',
    description: 'Você parece gostar de aprender, compartilhar ideias e apoiar o desenvolvimento de outras pessoas. Existem muitos caminhos ligados ao ensino, à pesquisa e às humanidades.',
    careers: ['Pedagogia', 'Letras', 'História', 'Geografia', 'Licenciaturas', 'Biblioteconomia'],
    experiments: ['Ensine algo que você domina a um colega.', 'Conheça o dia a dia de um professor ou pesquisador.', 'Participe de um projeto de leitura, reforço ou monitoria.']
  },
  {
    id: 'criatividade', title: 'Criatividade e Comunicação', emoji: '🎨', color: '#ffb887',
    short: 'Criar, comunicar ideias e encontrar novas formas de expressão.',
    description: 'Você demonstrou interesse em imaginar possibilidades e transformar ideias em mensagens, projetos ou experiências. A criação também envolve pesquisa, colaboração e técnica.',
    careers: ['Design', 'Publicidade e Propaganda', 'Jornalismo', 'Produção Audiovisual', 'Fotografia', 'Produção Cultural'],
    experiments: ['Crie um cartaz, vídeo ou podcast sobre um tema importante.', 'Converse com alguém que trabalhe com comunicação ou design.', 'Monte um pequeno portfólio de projetos que você gostou de fazer.']
  },
  {
    id: 'gestao', title: 'Gestão e Negócios', emoji: '📊', color: '#ffe08b',
    short: 'Organizar, planejar, liderar projetos e transformar ideias em ação.',
    description: 'Suas respostas mostram interesse em organizar recursos, tomar decisões e realizar projetos. Existem diferentes formas de trabalhar com gestão, negócios e empreendedorismo.',
    careers: ['Administração', 'Ciências Contábeis', 'Economia', 'Marketing', 'Logística', 'Empreendedorismo'],
    experiments: ['Organize uma pequena ação ou evento escolar.', 'Investigue como funciona um negócio do seu bairro.', 'Monte um orçamento simples para uma ideia de projeto.']
  },
  {
    id: 'natureza', title: 'Meio Ambiente e Animais', emoji: '🌿', color: '#a9ec84',
    short: 'Entender a natureza, cuidar dos animais e pensar em sustentabilidade.',
    description: 'Você demonstrou curiosidade por animais, natureza e impacto ambiental. Esse interesse pode levar a carreiras de cuidado, pesquisa, conservação, produção e sustentabilidade.',
    careers: ['Medicina Veterinária', 'Biologia', 'Gestão Ambiental', 'Agronomia', 'Engenharia Ambiental', 'Zootecnia'],
    experiments: ['Participe de uma ação de educação ambiental.', 'Pesquise como funciona a rotina de uma clínica veterinária.', 'Investigue um problema ambiental da sua comunidade.']
  }
];

export const STAGES = [
  { id: 'interesses', title: 'Seus interesses', small: 'O que desperta sua curiosidade', icon: '✨', intro: 'Não existe resposta certa. Escolha o que mais combina com você hoje.' },
  { id: 'habilidades', title: 'Suas habilidades', small: 'O que você já experimenta fazer', icon: '⚡', intro: 'É sobre o que você percebe em si agora. Habilidades podem ser desenvolvidas.' },
  { id: 'personalidade', title: 'Seu jeito de agir', small: 'Como você encara situações', icon: '🧩', intro: 'Imagine cada situação e escolha o que faria com mais vontade.' },
  { id: 'valores', title: 'O que importa', small: 'Prioridades e motivações', icon: '🧭', intro: 'Pense no que teria significado para você em uma atividade profissional.' },
  { id: 'futuro', title: 'Olhando adiante', small: 'Próximos passos e expectativas', icon: '🚀', intro: 'Você não precisa ter o futuro decidido. A ideia é enxergar possibilidades.' },
  { id: 'profissoes', title: 'Mundo das profissões', small: 'Aprendendo na prática', icon: '🌎', intro: 'Mini-desafios de conhecimento. Aqui, errar também é aprender.' },
  { id: 'resultado', title: 'Seu mapa', small: 'Descobertas e possibilidades', icon: '🎯', intro: 'Explore os caminhos que apareceram no seu mapa.' }
];

const op = (id, label, weights = {}, detail = '') => ({ id, label, weights, detail });
const q = (id, stage, title, options, help = '') => ({ id, stage, kind: 'profile', title, help, options });
const yesNo = (id, title, weights) => q(id, 'habilidades', title, [
  op('sim', 'Sim, me identifico com isso', weights, 'É algo que já percebo em mim.'),
  op('nao', 'Não, ou ainda estou aprendendo', {}, 'E tudo bem: habilidades se desenvolvem com prática.')
], 'Pense no que você já experimentou, sem se cobrar.' );
const future = (id, title, options, help = '') => ({ id, stage: 'futuro', kind: 'reflection', title, help, options });
const knowledge = (id, title, options, correct, explanation) => ({
  id, stage: 'profissoes', kind: 'knowledge', title,
  help: 'Escolha uma resposta e descubra algo novo sobre essa área.',
  options, correct, explanation
});

export const QUESTIONS = [
  q('i1', 'interesses', 'Com o que você sente mais vontade de trabalhar?', [
    op('pessoas', 'Pessoas', { saude: 2, educacao: 1 }, 'Conversar, colaborar ou cuidar.'),
    op('animais', 'Animais e natureza', { natureza: 3 }, 'Observar, proteger e conhecer.'),
    op('tecnologia', 'Tecnologia', { tecnologia: 3 }, 'Sistemas, computadores e invenções.'),
    op('objetos', 'Objetos e equipamentos', { tecnologia: 2, gestao: 1 }, 'Entender, montar e consertar.'),
    op('ideias', 'Ideias e histórias', { criatividade: 2, educacao: 1 }, 'Imaginar, criar e compartilhar.'),
    op('projetos', 'Projetos e equipes', { gestao: 2, criatividade: 1 }, 'Planejar e colocar coisas em movimento.')
  ]),
  q('i2', 'interesses', 'No seu tempo livre, o que mais chama sua atenção?', [
    op('escutar', 'Conversar e escutar pessoas', { saude: 2, educacao: 1 }),
    op('games', 'Explorar jogos, aplicativos e tecnologia', { tecnologia: 3 }),
    op('arte', 'Desenhar, filmar, escrever ou criar', { criatividade: 3 }),
    op('organizar', 'Organizar eventos e ideias', { gestao: 3 }),
    op('aprender', 'Ler, estudar e explicar assuntos', { educacao: 3 }),
    op('ar-livre', 'Cuidar de animais ou estar na natureza', { natureza: 3 })
  ]),
  q('i3', 'interesses', 'Que tipo de atividade parece mais interessante?', [
    op('pratica', 'Colocar a mão na massa e testar', { tecnologia: 2, natureza: 1 }),
    op('social', 'Participar e ajudar pessoas', { saude: 2, educacao: 1 }),
    op('criativa', 'Inventar algo novo', { criatividade: 3 }),
    op('intelectual', 'Pesquisar e descobrir respostas', { tecnologia: 2, educacao: 1 }),
    op('lideranca', 'Planejar e coordenar', { gestao: 3 }),
    op('natureza', 'Observar seres vivos e ambientes', { natureza: 3 })
  ]),
  q('i4', 'interesses', 'Quais assuntos despertam mais sua curiosidade?', [
    op('corpo', 'Corpo, mente e bem-estar', { saude: 3 }),
    op('computacao', 'Computadores, ciência e inovação', { tecnologia: 3 }),
    op('historia', 'História, livros e sociedade', { educacao: 3 }),
    op('midias', 'Música, artes e redes sociais', { criatividade: 3 }),
    op('economia', 'Empresas, dinheiro e projetos', { gestao: 3 }),
    op('ecologia', 'Animais, plantas e sustentabilidade', { natureza: 3 })
  ]),
  q('i5', 'interesses', 'Se pudesse conhecer um lugar por um dia, qual escolheria?', [
    op('hospital', 'Um hospital ou centro de saúde', { saude: 3 }),
    op('labtech', 'Um laboratório de tecnologia', { tecnologia: 3 }),
    op('escola', 'Uma escola ou museu interativo', { educacao: 3 }),
    op('estudio', 'Um estúdio de criação e audiovisual', { criatividade: 3 }),
    op('empresa', 'Uma empresa ou startup', { gestao: 3 }),
    op('reserva', 'Um parque ou centro de proteção animal', { natureza: 3 })
  ]),

  yesNo('h1', 'Você costuma encontrar soluções para problemas do dia a dia?', { tecnologia: 2, gestao: 1 }),
  yesNo('h2', 'Você se considera uma pessoa comunicativa?', { criatividade: 2, educacao: 1 }),
  yesNo('h3', 'Você sente facilidade ou interesse por cálculos e lógica?', { tecnologia: 2, gestao: 2 }),
  yesNo('h4', 'Você gosta de desenhar, escrever ou inventar projetos?', { criatividade: 3 }),
  yesNo('h5', 'Você sente que sabe escutar e acolher outras pessoas?', { saude: 2, educacao: 1 }),
  yesNo('h6', 'Você gosta de organizar tarefas ou coordenar grupos?', { gestao: 3 }),
  yesNo('h7', 'Você gosta de observar e compreender animais ou a natureza?', { natureza: 3 }),

  q('p1', 'personalidade', 'Sua turma recebeu um desafio. Qual papel você gostaria de assumir?', [
    op('apoio', 'Ouvir as pessoas e apoiar o grupo', { saude: 3 }),
    op('pesquisa', 'Pesquisar ferramentas e soluções', { tecnologia: 3 }),
    op('explicar', 'Explicar o conteúdo aos colegas', { educacao: 3 }),
    op('criar', 'Criar a apresentação visual', { criatividade: 3 }),
    op('planejar', 'Organizar as tarefas do grupo', { gestao: 3 }),
    op('impacto', 'Pensar no impacto sobre o ambiente', { natureza: 3 })
  ]),
  q('p2', 'personalidade', 'Quando aparece um problema novo, sua primeira vontade é…', [
    op('conversar', 'Entender como as pessoas se sentem', { saude: 3 }),
    op('investigar', 'Analisar dados e possíveis causas', { tecnologia: 3 }),
    op('aprender', 'Ler, pesquisar e dividir o que descobriu', { educacao: 3 }),
    op('alternativas', 'Imaginar uma solução diferente', { criatividade: 3 }),
    op('plano', 'Criar um plano de ação', { gestao: 3 }),
    op('observar', 'Observar o ambiente e suas relações', { natureza: 3 })
  ]),
  q('p3', 'personalidade', 'Qual projeto escolar você escolheria?', [
    op('saude', 'Campanha de promoção da saúde', { saude: 3 }),
    op('app', 'Protótipo de um aplicativo', { tecnologia: 3 }),
    op('oficina', 'Oficina para ensinar algo', { educacao: 3 }),
    op('podcast', 'Podcast, curta ou exposição artística', { criatividade: 3 }),
    op('feira', 'Feira de projetos e empreendedorismo', { gestao: 3 }),
    op('ambiental', 'Ação de cuidado ambiental', { natureza: 3 })
  ]),
  q('p4', 'personalidade', 'Qual dessas tarefas te daria mais satisfação?', [
    op('acolher', 'Ajudar alguém a se sentir melhor', { saude: 3 }),
    op('solucao', 'Fazer uma solução técnica funcionar', { tecnologia: 3 }),
    op('ensinar', 'Ver alguém aprender com você', { educacao: 3 }),
    op('obra', 'Ver uma ideia criativa ganhar forma', { criatividade: 3 }),
    op('entregar', 'Ver um projeto concluído em equipe', { gestao: 3 }),
    op('cuidar', 'Contribuir para o cuidado com a natureza', { natureza: 3 })
  ]),

  q('v1', 'valores', 'O que seria mais importante para você em um trabalho?', [
    op('cuidado', 'Contribuir com o bem-estar das pessoas', { saude: 3 }),
    op('inovacao', 'Descobrir e criar soluções úteis', { tecnologia: 3 }),
    op('conhecimento', 'Ajudar outras pessoas a aprender', { educacao: 3 }),
    op('expressao', 'Ter espaço para criar e se expressar', { criatividade: 3 }),
    op('realizacao', 'Transformar ideias em resultados', { gestao: 3 }),
    op('sustentabilidade', 'Proteger seres vivos e ambientes', { natureza: 3 })
  ]),
  q('v2', 'valores', 'Se pudesse participar de uma iniciativa, escolheria…', [
    op('saude', 'Uma rede de apoio à comunidade', { saude: 3 }),
    op('tecnologia', 'Uma inovação que facilita a vida', { tecnologia: 3 }),
    op('educacao', 'Um projeto para ampliar o acesso à educação', { educacao: 3 }),
    op('cultura', 'Um projeto de arte e cultura', { criatividade: 3 }),
    op('negocio', 'Um negócio que gera oportunidades', { gestao: 3 }),
    op('ambiental', 'Uma iniciativa de preservação ambiental', { natureza: 3 })
  ]),
  q('v3', 'valores', 'Qual conquista você acharia mais marcante?', [
    op('acolheu', 'Ter acolhido alguém em um momento difícil', { saude: 3 }),
    op('inventou', 'Ter criado uma ferramenta que funciona', { tecnologia: 3 }),
    op('ensinou', 'Ter ajudado alguém a aprender', { educacao: 3 }),
    op('comunicou', 'Ter contado uma história que emocionou', { criatividade: 3 }),
    op('liderou', 'Ter liderado um projeto coletivo', { gestao: 3 }),
    op('protegeu', 'Ter protegido um espaço natural', { natureza: 3 })
  ]),
  q('v4', 'valores', 'Qual ambiente de trabalho parece mais interessante?', [
    op('cuidado', 'Um espaço de cuidado e escuta', { saude: 3 }),
    op('tecnico', 'Um laboratório ou time técnico', { tecnologia: 3 }),
    op('aprendizado', 'Um espaço de pesquisa e aprendizagem', { educacao: 3 }),
    op('estudio', 'Um estúdio ou equipe criativa', { criatividade: 3 }),
    op('projetos', 'Uma organização com projetos e equipes', { gestao: 3 }),
    op('campo', 'Um ambiente de pesquisa de campo', { natureza: 3 })
  ]),

  future('f1', 'Hoje, qual caminho você pensa em explorar após a escola?', [
    op('superior', 'Ensino superior'), op('tecnico', 'Curso técnico ou profissionalizante'),
    op('trabalho', 'Começar a trabalhar ou buscar experiência'),
    op('empreender', 'Empreender ou desenvolver um projeto'),
    op('explorar', 'Ainda quero conhecer mais possibilidades')
  ], 'Não existe um único caminho correto.'),
  future('f2', 'O que mais ajudaria você a decidir seus próximos passos?', [
    op('conversa', 'Conversar com profissionais'), op('visita', 'Conhecer ambientes de trabalho'),
    op('cursos', 'Pesquisar cursos e formas de ingresso'), op('experiencia', 'Testar atividades na prática'),
    op('tempo', 'Ter mais tempo para pensar e explorar')
  ]),
  future('f3', 'Como você se sente quando pensa em escolher uma profissão?', [
    op('animado', 'Com vontade de começar a descobrir'),
    op('duvida', 'Com dúvidas, mas com curiosidade'),
    op('pressionado', 'Um pouco pressionado(a)'),
    op('ideia', 'Já tenho uma ideia, mas posso mudar'),
    op('incerto', 'Ainda não sei por onde começar')
  ], 'É normal sentir mais de uma coisa ao mesmo tempo.'),

  knowledge('k1', 'Uma pessoa formada em Psicologia pode trabalhar em quais contextos?', [
    op('a', 'Somente atendendo em consultório'),
    op('b', 'Escolas, organizações, saúde, pesquisa e outros contextos'),
    op('c', 'Apenas aplicando testes de personalidade'),
    op('d', 'Somente em hospitais')
  ], 'b', 'A Psicologia tem diferentes campos de atuação. A formação e as normas profissionais definem as atividades que podem ser exercidas.'),
  knowledge('k2', 'Quais são algumas possibilidades de atuação em Tecnologia?', [
    op('a', 'Somente consertar computadores'),
    op('b', 'Apenas desenvolver jogos'),
    op('c', 'Software, dados, segurança digital, design e suporte'),
    op('d', 'Somente trabalhar em grandes empresas')
  ], 'c', 'A tecnologia reúne várias profissões e pode ser utilizada em escolas, hospitais, empresas, organizações sociais e muito mais.'),
  knowledge('k3', 'Em Educação Física, qual é uma diferença importante entre licenciatura e bacharelado?', [
    op('a', 'São cursos idênticos, sem diferença de formação'),
    op('b', 'Licenciatura prepara para ensinar na educação básica; bacharelado para outras áreas de atuação, conforme normas'),
    op('c', 'Somente o bacharelado prepara para dar aulas na escola'),
    op('d', 'Ambos são cursos de nível técnico')
  ], 'b', 'A licenciatura é voltada à docência escolar. O bacharelado se relaciona a outros campos da Educação Física. Para atuar, é preciso observar a formação e as normas profissionais vigentes.'),
  knowledge('k4', 'Qual afirmação representa melhor o mundo do trabalho?', [
    op('a', 'Toda profissão tem um único tipo de rotina'),
    op('b', 'Precisamos decidir uma carreira para sempre na adolescência'),
    op('c', 'Há diferentes formas de formação, atuação e mudança de trajetória'),
    op('d', 'Só existe sucesso profissional em cursos universitários')
  ], 'c', 'Existem trajetórias com cursos técnicos, graduação, aprendizagem e experiências práticas. As pessoas também podem mudar de caminho ao longo da vida.')
];

export const PROFILE_QUESTION_COUNT = QUESTIONS.filter(x => x.kind === 'profile').length;
export const LAST_QUESTION_INDEX = QUESTIONS.length - 1;
