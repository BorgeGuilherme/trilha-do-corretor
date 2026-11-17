// Teste automático: 30 alunos simulados jogam o jogo inteiro, do QR ao ranking.
// Uso: npm run teste   (sobe um servidor próprio na porta 3999 com dados temporários)

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const perguntas = require('./perguntas');
const { rodadas } = require('./historia');

const PORTA = 3999;
const BASE = `http://127.0.0.1:${PORTA}`;
const SENHA = 'teste123';
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'trilha-'));
for (const f of ['server.js', 'perguntas.js', 'historia.js', 'comentarios.js', 'relatorio.js', 'celular.html', 'telao.html', 'controle.html', 'estilo.css', 'package.json']) {
  fs.copyFileSync(path.join(__dirname, f), path.join(pasta, f));
}
fs.symlinkSync(path.join(__dirname, 'node_modules'), path.join(pasta, 'node_modules'));

let srv;
function subir() {
  srv = spawn('node', ['server.js'], { cwd: pasta, env: Object.assign({}, process.env, { PORT: PORTA, SENHA, TEMPO_QUESTAO: '20' }), stdio: ['ignore', 'pipe', 'pipe'] });
  srv.stderr.on('data', d => process.stderr.write('[srv] ' + d));
  return new Promise(ok => srv.stdout.on('data', d => { if (String(d).includes('rodando')) ok(); }));
}
const espera = ms => new Promise(r => setTimeout(r, ms));
let falhas = 0, verificacoes = 0;
function confere(cond, msg) { verificacoes++; if (!cond) { falhas++; console.log('  ✗ FALHOU:', msg); } }

async function post(url, corpo) {
  const r = await fetch(BASE + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  return { status: r.status, dados: await r.json() };
}
async function get(url) { const r = await fetch(BASE + url); return { status: r.status, texto: await r.text() }; }
const controle = (acao, extra = {}) => post('/api/controle', Object.assign({ senha: SENHA, acao }, extra));
const estadoDe = async id => JSON.parse((await get('/api/estado?id=' + id)).texto);
const telao = () => new Promise(ok => {
  // lê um evento do SSE do telão
  fetch(BASE + '/eventos?tipo=telao').then(async r => {
    const leitor = r.body.getReader();
    let buf = '';
    while (true) {
      const { value } = await leitor.read();
      buf += Buffer.from(value).toString();
      const i = buf.indexOf('data: ');
      const f = buf.indexOf('\n\n', i);
      if (i >= 0 && f > i) { leitor.cancel(); return ok(JSON.parse(buf.slice(i + 6, f))); }
    }
  });
});

(async () => {
  await subir();
  console.log('Servidor de teste no ar.');

  // Segurança: arquivos internos não podem ser baixados
  for (const f of ['/perguntas.js', '/historia.js', '/comentarios.js', '/relatorio.js', '/server.js', '/dados/estado.json', '/package.json', '/img/../server.js']) {
    confere((await get(f)).status === 404, `${f} deveria dar 404`);
  }
  confere((await get('/')).status === 200, 'celular abre');
  confere((await get('/telao')).status === 200, 'telão abre');
  confere((await get('/controle')).status === 200, 'controle abre');
  confere((await get('/qr.svg')).texto.includes('<svg'), 'QR gerado');
  confere((await post('/api/controle', { senha: 'errada', acao: 'proximo' })).status === 403, 'senha errada bloqueada');

  // 30 alunos entram
  const N = 30;
  const alunos = [];
  for (let i = 0; i < N; i++) {
    const { dados } = await post('/api/entrar', { nome: 'Aluno ' + (i + 1) });
    alunos.push({ id: dados.id, habilidade: 0.35 + (i / N) * 0.6 });
  }
  const dup = await post('/api/entrar', { nome: 'Aluno 1' });
  confere(dup.dados.nome === 'Aluno 1 2', 'nome repetido ganha sufixo');
  await controle('remover', { id: dup.dados.id });
  confere((await post('/api/entrar', { nome: 'x' })).status === 400, 'nome curto recusado');

  let tela = await telao();
  confere(tela.etapa.tipo === 'lobby' && tela.jogadores === N, 'telão mostra lobby com 30');

  const porTexto = {};
  for (const p of perguntas) porTexto[p.texto] = p;

  let rodadasJogadas = 0, reinicioFeito = false;
  for (let guarda = 0; guarda < 200; guarda++) {
    tela = await telao();
    const tipo = tela.etapa.tipo;
    if (tipo === 'rodada' && tela.rodada.cena) {
      const ec = await estadoDe(alunos[0].id);
      confere(ec.fase === 'cena' && ec.chegada.length >= 2, `celular mostra a cena da rodada ${tela.rodada.n}`);
      await controle('proximo');
      continue;
    }
    if (tipo === 'rodada' && tela.rodada.aberta) {
      const n = tela.rodada.n;
      // Reinício do servidor no meio da rodada 7: nada pode se perder
      if (n === 7 && !reinicioFeito) {
        reinicioFeito = true;
        const antes = (await estadoDe(alunos[0].id)).jogador.pontos;
        srv.kill(); await espera(300); await subir();
        const depois = await estadoDe(alunos[0].id);
        confere(depois.jogador.pontos === antes, 'pontos mantidos após reinício');
        tela = await telao();
        confere(tela.rodada.pausado === true, 'rodada volta pausada após reinício');
        await controle('retomar');
      }
      // Cada aluno responde todas as questões da rodada
      for (const a of alunos) {
        for (let k = 0; k < 3; k++) {
          const e = await estadoDe(a.id);
          if (e.fase !== 'pergunta') break;
          const q = porTexto[e.pergunta.texto];
          confere(!!q, 'pergunta reconhecida');
          const certaTexto = q.alternativas[q.correta];
          const iCerta = e.pergunta.opcoes.indexOf(certaTexto);
          confere(iCerta >= 0, 'alternativa certa está entre as opções');
          const acerta = Math.random() < a.habilidade;
          const escolha = acerta ? iCerta : (iCerta + 1) % 4;
          const r = await post('/api/responder', { id: a.id, opcao: escolha, chave: e.pergunta.chave });
          confere(r.status === 200, 'resposta aceita');
          // resposta duplicada deve ser recusada
          const r2 = await post('/api/responder', { id: a.id, opcao: escolha, chave: e.pergunta.chave });
          confere(r2.status === 409, 'resposta duplicada recusada');
        }
      }
      await espera(700); // fecha sozinha quando todos respondem
      tela = await telao();
      confere(tela.rodada.aberta === false, `rodada ${n} fechou sozinha`);
      const res = tela.rodada.resultado;
      confere(res && typeof res.taxa === 'number', `rodada ${n} tem resultado`);
      const e0 = await estadoDe(alunos[N - 1].id);
      confere(e0.fase === 'resultado' && e0.minhas.length === rodadas[n - 1].perguntas.length, `celular mostra gabarito da rodada ${n}`);
      rodadasJogadas++;
      await controle('proximo');
      continue;
    }
    if (tipo === 'palpite') {
      for (const [i, a] of alunos.entries()) await post('/api/palpite', { id: a.id, suspeito: i % 3 === 0 ? 'marta' : 'vera' });
      const pts = (await estadoDe(alunos[1].id)).jogador.pontos;
      await controle('proximo');
      confere((await estadoDe(alunos[1].id)).jogador.pontos === pts + 50, 'palpite certo vale 50');
      continue;
    }
    if (tipo === 'ranking') break;
    await controle('proximo');
  }

  tela = await telao();
  confere(rodadasJogadas === 24, `24 rodadas jogadas (foram ${rodadasJogadas})`);
  confere(tela.etapa.tipo === 'ranking' && tela.top.length === 15, 'ranking final com 15 nomes');
  confere(tela.palpiteCertos === 20, 'contagem de palpites certos');
  const respostas = alunos.reduce((s, a) => s, 0);
  const e = await estadoDe(alunos[N - 1].id);
  confere(e.jogador.respondidas === 30, `aluno respondeu as 30 questões (${e.jogador.respondidas})`);
  confere(e.fase === 'fim', 'celular mostra o fim');
  const rel = await get('/relatorio?id=' + alunos[0].id);
  confere(rel.status === 200 && rel.texto.includes('Relatório de desempenho') && rel.texto.includes('wa.me'), 'relatório individual gerado');
  const errosAluno0 = (rel.texto.match(/class="q"/g) || []).length;
  confere(rel.texto.includes((30 - errosAluno0) + '/30'), 'relatório conta acertos e erros certo');
  confere((await get('/turma?senha=errada')).status === 403, 'relatório da turma protegido');
  const tur = await get('/turma?senha=' + SENHA);
  confere(tur.status === 200 && tur.texto.includes('Questões que a turma mais errou'), 'relatório da turma gerado');
  const csv = await get('/turma.csv?senha=' + SENHA);
  confere(csv.texto.split('\n').length === N + 1, 'CSV com uma linha por aluno');
  fs.writeFileSync('/tmp/relatorio-exemplo.html', rel.texto);
  fs.writeFileSync('/tmp/turma-exemplo.html', tur.texto);
  console.log(`Fôlego final do professor: ${tela.relogio} min · final ${tela.finalBom ? 'bom' : 'ruim'}`);
  console.log('Top 3:', tela.top.slice(0, 3).map(j => `${j.nome} ${j.pontos}`).join(' · '));

  // Tempo esgotado: rodada fecha sozinha sem todos responderem
  await controle('zerar', { confirmacao: 'ZERAR' });
  const s = await post('/api/entrar', { nome: 'Solitário' });
  for (let i = 0; i < 4; i++) await controle('proximo'); // abertura -> abertura2 -> cena -> rodada 1
  tela = await telao();
  confere(tela.rodada && tela.rodada.aberta, 'rodada 1 aberta após zerar');
  await controle('mais30');
  await controle('pular');
  const es = await estadoDe(s.dados.id);
  confere(es.jogador.pontos === 0, 'rodada pulada não dá pontos');

  srv.kill();
  console.log(`\n${verificacoes - falhas} de ${verificacoes} verificações passaram.`);
  process.exit(falhas ? 1 : 0);
})().catch(e => { console.error(e); if (srv) srv.kill(); process.exit(1); });
