# Descubra Seus Caminhos — Escola Guarani

Jogo/quiz educativo de orientação profissional para estudantes da Escola Guarani.

## O que está implementado

- Experiência de aplicativo mobile em verde: início compacto, jornada, catálogo de áreas e mapa em telas próprias.
- Estrutura de altura de tela (`100dvh`), cabeçalho e navegação inferior persistentes; apenas o conteúdo central rola. Em telas grandes, mantém a mesma interface de celular, limitada a 480 px.
- Uma pergunta por tela com ações fixas. Pausar, explorar áreas e retomar preserva escolhas apenas enquanto a sessão está aberta.
- Resultados separados em Destaques, Panorama e Próximos passos; reinício exige confirmação.
- Sete etapas: interesses, habilidades, personalidade, valores, futuro, profissões e resultados.
- 27 perguntas, com alternativas responsivas e navegação para revisar respostas.
- Quatro perguntas educativas sobre profissões, com feedback explicativo.
- Pontuação em seis áreas: Saúde e Bem-estar, Tecnologia e Dados, Educação e Humanidades, Criatividade e Comunicação, Gestão e Negócios, Meio Ambiente e Animais.
- Mapa de afinidades exploratórias, duas áreas destacadas, profissões para pesquisar e ações sugeridas.
- Layout mobile-first com experiência de aplicativo, botões grandes, navegação por etapas, suporte a teclado, foco visível, sem animações obrigatórias e opção de impressão.
- Aplicativo Web Progressivo (PWA) instalável pela tela inicial do Android/iPhone, com cache dos arquivos públicos para funcionar sem internet depois da primeira visita concluída.
- **Nenhum cadastro, banco de dados, cookies, analytics ou envio de respostas.** As respostas só existem na memória da página enquanto ela está aberta. O cache offline guarda apenas os arquivos públicos do jogo, não as respostas.
- Zero dependências de execução; não usa Agent/Build do Lovable.

## Identidade e publicação

A identidade desta versão é verde (#176342), com verde escuro e superfícies claras. Não reutiliza a paleta do ALP. Os ícones de instalação e o manifest seguem a mesma identidade. A referência do ALP foi usada somente para a organização da experiência em telas.

O endereço publicado no Lovable é uma implantação separada: alterar este repositório não atualiza automaticamente aquele endereço. Esta versão é estática e pode ser servida via HTTPS, inclusive em subpastas, sem usar o editor ou créditos do Lovable.

## Usar em sala de aula no celular

1. Publique o site via HTTPS, como GitHub Pages (não é necessária loja de aplicativos).
2. Com internet, abra o endereço no celular pelo QR Code e espere o jogo carregar uma vez. Isso permite armazenar os arquivos públicos para uso offline.
3. Toque em **Adicionar ao celular** na tela inicial; no iPhone use **Compartilhar → Adicionar à Tela de Início**; em Android pode aparecer a opção **Instalar app** ou **Adicionar à tela inicial** no menu do navegador.
4. Abra pelo ícone, em tela cheia, e responda às etapas. Em celulares compartilhados, cada aluno deve começar uma nova jornada; se a página for fechada ou recarregada, as respostas não são guardadas.
5. Teste instalação, modo avião, navegação e leitura em aparelhos reais antes de levar à escola. **Não há captura de respostas, administração de turmas ou histórico.**

A instalação exige acesso HTTPS e suporte do navegador. O cache só garante o modo offline **após a instalação do service worker e dos arquivos do jogo**, não na primeira abertura sem rede. A versão local aberta como arquivo `file://` não instala nem disponibiliza PWA.

## Rodar localmente

Requer Python 3 ou servidor estático equivalente:

```bash
python3 -m http.server 4173
```

Depois acesse http://localhost:4173. Não abra `index.html` diretamente via `file://`, pois o navegador pode bloquear imports de módulos JavaScript.

## Testar

Com Node.js 18+:

```bash
npm test
```

O comando `npm run check` também verifica a sintaxe dos módulos.

## Publicar no GitHub Pages — sem build

1. Crie um repositório **novo** no GitHub (por exemplo `guarani-descubra-seus-caminhos`).
2. Envie os arquivos deste projeto para a branch `main`.
3. Acesse **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/(root)`; salve.
5. A página ficará em `https://SEU-USUARIO.github.io/guarani-descubra-seus-caminhos/` (dependendo da configuração da conta).

As referências no HTML são relativas, portanto funcionam em subdiretórios do GitHub Pages. **Não é necessário usar o Lovable.**

## Metodologia de pontuação (provisória)

- Apenas as perguntas de `kind: 'profile'` entram no mapa. Isso corresponde a **20 perguntas** das etapas 1–4.
- Cada alternativa possui pesos configuráveis por área, normalmente de 0 a 3. Algumas contribuem com pontos para duas áreas.
- A pontuação de uma área é `pontos recebidos ÷ soma dos máximos possíveis daquela área nas perguntas respondidas × 100`, arredondada ao inteiro mais próximo.
- A ordenação mostra os índices mais altos. Os percentuais **não** são estatísticas, probabilidades, aptidões medidas nem um diagnóstico.
- As três perguntas sobre o futuro personalizam as recomendações, sem afetar a afinidade.
- Os quatro desafios de conhecimento exibem explicações e um resumo de acertos, mas **não alteram a afinidade**.
- Essa matriz é uma **hipótese pedagógica inicial**, sem validação psicométrica. Antes de uso amplo, revisar questões, linguagem, pesos e resultados junto à equipe escolar e a profissionais de orientação profissional/psicologia quando pertinente.
- Um interesse que não apareça entre os seis grupos não significa falta de potencial. Os resultados não devem restringir escolhas dos estudantes.

## Cuidados de privacidade e aplicação escolar

- Não solicite nome, turma, e-mail nem outros dados pessoais para jogar.
- Não há armazenamento ou coleta de respostas por padrão.
- Evite tratar as pontuações como classificação dos alunos.
- Antes de aplicar com uma turma, faça um piloto com estudantes e docentes; observe legibilidade, acessibilidade e interpretação das recomendações.
- Caso deseje futuramente salvar respostas ou gerar relatórios por turma, isso **exigirá novo projeto de privacidade**, avaliação de necessidade, consentimento/base legal adequada e proteção reforçada para menores.

## Arquivos

```text
index.html          Entrada do jogo
styles.css          Visual responsivo, telas e impressão
favicon.svg         Identidade visual local
manifest.webmanifest Dados de instalação na tela inicial
service-worker.js   Cache offline dos arquivos públicos
icons/              Ícones 180, 192 e 512 px
src/quiz-data.js    Conteúdos, alternativas, áreas e profissões
src/scoring.js      Algoritmo puro de cálculo e recomendações
src/app.js          Fluxo e interface do jogo
tests/              Testes automatizados da metodologia
```

## Próximos passos desejáveis

1. Validar o nome definitivo e a identidade visual com a Escola Guarani.
2. Fazer oficina-piloto para aferir se as perguntas são fáceis de entender e não induzem respostas.
3. Revisar a matriz de pesos em conjunto com educadores antes de divulgar resultados como orientação.
4. Se necessário, ampliar a lista de áreas e introduzir exploração de cursos técnicos, trabalhos locais e ocupações emergentes.

## Referências de apoio (conteúdo educacional)

- Instituto Federal de Minas Gerais / eduCapes — *Orientação profissional: aprendendo a ser e a escolher*: https://educapes.capes.gov.br/handle/capes/644256
- Conselho Federal de Educação Física (CONFEF) — Informações sobre bacharelado/licenciatura: https://faq.confef.org.br/faq/index.php?action=faq&cat=3&id=33&artlang=pt-br

> **Aviso:** Esta é uma atividade de reflexão e exploração de interesses. Não é um teste psicológico validado nem substitui orientação profissional realizada por pessoas qualificadas.
