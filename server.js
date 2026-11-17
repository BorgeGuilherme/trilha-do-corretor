// A Trilha do Corretor — servidor do jogo (celular, telão e controle).
// Sem banco de dados: o estado fica em dados/estado.json.

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');

const perguntasLista = require('./perguntas');
const { ambientes, rodadas, textos, suspeitos, culpado } = require('./historia');
const { comentarios } = require('./comentarios');
const relatorio = require('./relatorio');

const PORT = process.env.PORT || 3000;
const SENHA = process.env.SENHA || 'fama2026';
const TEMPO_QUESTAO = Number(process.env.TEMPO_QUESTAO || 100); // segundos por questão
const RELOGIO_INICIAL = Number(process.env.RELOGIO_INICIAL || 45); // minutos de fôlego do professor
const PENALIDADE = Number(process.env.PENALIDADE || 5); // minutos perdidos por rodada ruim
const PONTOS_PALPITE = 50;
const DIR = __dirname;
const DADOS = path.join(DIR, 'dados');
const ARQ_ESTADO = path.join(DADOS, 'estado.json');

const perguntas = {};
for (const p of perguntasLista) perguntas[p.id] = p;
const rodadaPorN = {};
for (const r of rodadas) rodadaPorN[r.n] = r;

// ---------- Sequência de etapas ----------
const etapas = [{ tipo: 'lobby', nome: 'Entrada (QR code)' }, { tipo: 'texto', chave: 'abertura', nome: 'Abertura: o jornal' }, { tipo: 'texto', chave: 'abertura2', nome: 'Abertura: hoje, 19h' }];
for (const r of rodadas) {
  if (r.n === 15) etapas.push({ tipo: 'texto', chave: 'volta', nome: 'Volta do intervalo' });
  if (r.n === 24) etapas.push({ tipo: 'palpite', nome: 'Palpite: quem é o Corretor?' });
  etapas.push({ tipo: 'rodada', n: r.n, nome: `Rodada ${r.n} · ${ambientes[r.local].nome}` });
  if (r.n === 14) {
    etapas.push({ tipo: 'texto', chave: 'gancho', nome: 'Gancho: agora são dois' });
    etapas.push({ tipo: 'texto', chave: 'intervalo', nome: 'Intervalo' });
  }
}
etapas.push({ tipo: 'texto', chave: 'revelacao', nome: 'Revelação' });
etapas.push({ tipo: 'final', nome: 'Final' });
etapas.push({ tipo: 'ranking', nome: 'Ranking final' });

// ---------- Estado ----------
function estadoNovo() {
  return {
    etapa: 0,
    rodadaAtual: null, // { n, aberta, inicio, prazo, pausadoRestante, resultado }
    resultados: {},    // n -> resultado da rodada
    relogio: RELOGIO_INICIAL,
    jogadores: {},
    palpitePago: false,
    qrVisivel: true,
    criadoEm: Date.now()
  };
}
let estado = estadoNovo();

function carregar() {
  try {
    const dados = JSON.parse(fs.readFileSync(ARQ_ESTADO, 'utf8'));
    estado = Object.assign(estadoNovo(), dados);
    const ra = estado.rodadaAtual;
    if (ra && ra.aberta && ra.pausadoRestante == null) {
      ra.pausadoRestante = Math.max(15000, ra.prazo - Date.now());
    }
    console.log('Estado recuperado:', Object.keys(estado.jogadores).length, 'jogadores, etapa', estado.etapa);
  } catch (e) {
    console.log('Começando jogo novo.');
  }
}
let salvarTimer = null;
function salvarAgora() {
  if (salvarTimer) { clearTimeout(salvarTimer); salvarTimer = null; }
  try {
    fs.mkdirSync(DADOS, { recursive: true });
    fs.writeFileSync(ARQ_ESTADO + '.tmp', JSON.stringify(estado));
    fs.renameSync(ARQ_ESTADO + '.tmp', ARQ_ESTADO);
  } catch (e) { console.error('Erro ao salvar:', e.message); }
}
function salvar() {
  if (salvarTimer) return;
  salvarTimer = setTimeout(salvarAgora, 300);
}
for (const sinal of ['SIGTERM', 'SIGINT']) {
  process.on(sinal, () => { salvarAgora(); process.exit(0); });
}
carregar();

// ---------- Utilidades ----------
function embaralhar(n) {
  const a = [...Array(n).keys()];
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function listaJogadores() { return Object.values(estado.jogadores); }
function ranking() {
  return listaJogadores()
    .sort((a, b) => b.pontos - a.pontos || a.tempoTotal - b.tempoTotal || a.entrouEm - b.entrouEm)
    .map((j, i) => ({ id: j.id, nome: j.nome, pontos: j.pontos, acertos: j.acertos, respondidas: j.respondidas, posicao: i + 1 }));
}
function etapaAtual() { return etapas[estado.etapa]; }
function restanteMs() {
  const ra = estado.rodadaAtual;
  if (!ra || !ra.aberta) return 0;
  if (ra.pausadoRestante != null) return ra.pausadoRestante;
  return Math.max(0, ra.prazo - Date.now());
}
function progressoJogador(j, n) {
  if (!j.rodadas[n]) j.rodadas[n] = { idx: 0, respostas: [], ordens: {}, inicioQuestao: null, final: null };
  return j.rodadas[n];
}
function terminouRodada(j, r) {
  const p = j.rodadas[r.n];
  return p && p.idx >= r.perguntas.length;
}
function ambientesErrados(r) {
  return Object.keys(ambientes).filter(k => k !== r.destino && k !== r.local && k !== 'maquinas');
}
function urlImagem(nome) {
  if (!nome) return null;
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (fs.existsSync(path.join(DIR, `${nome}.${ext}`))) return `/img/${nome}.${ext}`;
  }
  return null;
}

// ---------- Rodadas ----------
function abrirRodada(n) {
  const r = rodadaPorN[n];
  const agora = Date.now();
  estado.rodadaAtual = {
    n, aberta: true, inicio: agora,
    prazo: agora + TEMPO_QUESTAO * 1000 * r.perguntas.length,
    pausadoRestante: null, resultado: null
  };
  for (const j of listaJogadores()) {
    const p = progressoJogador(j, n);
    if (p.inicioQuestao == null) p.inicioQuestao = agora;
  }
}

function fecharRodada({ pulada = false } = {}) {
  const ra = estado.rodadaAtual;
  if (!ra || !ra.aberta) return;
  const r = rodadaPorN[ra.n];
  ra.aberta = false;
  ra.pausadoRestante = null;
  const jogs = listaJogadores();
  let certas = 0, completos = 0;
  for (const j of jogs) {
    const p = progressoJogador(j, r.n);
    certas += p.respostas.filter(x => x.ok).length;
    if (p.respostas.length === r.perguntas.length && p.respostas.every(x => x.ok)) completos++;
  }
  const possivel = jogs.length * r.perguntas.length;
  const taxa = possivel ? certas / possivel : 0;

  // Apuração: a alternativa mais votada é a escolha da turma
  const votos = r.perguntas.map(qid => {
    const q = perguntas[qid];
    const contagem = q.alternativas.map(() => 0);
    for (const j of jogs) {
      const x = (j.rodadas[r.n] ? j.rodadas[r.n].respostas : []).find(y => y.qid === qid);
      if (x) contagem[x.escolhida]++;
    }
    const total = contagem.reduce((a, b) => a + b, 0);
    const max = Math.max(...contagem);
    const empatadas = contagem.map((c, i) => (c === max ? i : -1)).filter(i => i >= 0);
    const vencedora = total ? empatadas[crypto.randomInt(empatadas.length)] : -1;
    return {
      qid, alternativas: q.alternativas, contagem, total, vencedora, correta: q.correta,
      ok: vencedora === q.correta, empate: total > 0 && empatadas.length > 1
    };
  });
  const erradas = votos.filter(v => !v.ok).length;
  const antes = estado.relogio;
  let perdeu = false;
  if (!pulada && jogs.length > 0 && erradas > 0) {
    estado.relogio = Math.max(0, estado.relogio - PENALIDADE * erradas);
    perdeu = true;
  }
  const finalOk = votos[votos.length - 1].ok;
  let turma;
  if (pulada) turma = { ok: true, titulo: 'Rodada pulada', texto: `O envelope estava na ${ambientes[r.destino].nome}.` };
  else if (r.cadeado) turma = finalOk
    ? { ok: true, titulo: 'Clique! O cadeado abriu.', texto: 'A porta da casa de máquinas range...' }
    : { ok: false, titulo: 'O cadeado não abriu...', texto: 'A turma força a porta até ela ceder, mas o tempo do professor está acabando.' };
  else if (r.ocultarDestino) turma = finalOk
    ? { ok: true, titulo: 'A turma decifrou o envelope!', texto: 'O destino só será revelado depois do intervalo.' }
    : { ok: false, titulo: 'A turma não decifrou o envelope...', texto: 'O destino só será revelado depois do intervalo.' };
  else if (finalOk) {
    const d = ambientes[r.destino];
    turma = { ok: true, titulo: `A turma correu para: ${d.nome}`, texto: `E achou o próximo envelope com ${d.personagem}!` };
  } else {
    const lista = ambientesErrados(r);
    const errado = ambientes[lista[crypto.randomInt(lista.length)]];
    const fala = errado.vazio[crypto.randomInt(errado.vazio.length)];
    turma = { ok: false, titulo: `A turma correu para: ${errado.nome}`, texto: `${fala} Só depois de perder tempo vocês acharam o envelope na ${ambientes[r.destino].nome}.` };
  }
  for (const j of jogs) {
    const p = progressoJogador(j, r.n);
    const meus = p.respostas;
    const acertou = meus.length === r.perguntas.length && meus.every(x => x.ok);
    p.final = meus.length
      ? { tipo: acertou ? 'certo' : 'errado', titulo: turma.titulo, texto: turma.texto }
      : { tipo: 'sem', titulo: turma.titulo, texto: 'Você não votou a tempo nesta rodada. ' + turma.texto };
  }
  ra.resultado = {
    pulada, taxa: Math.round(taxa * 100), completos, total: jogs.length,
    relogioAntes: antes, relogioDepois: estado.relogio, perdeu, erradas,
    destino: r.ocultarDestino ? null : ambientes[r.destino].nome,
    cadeado: !!r.cadeado, turma, votos,
    respostasCertas: r.perguntas.map(qid => perguntas[qid].alternativas[perguntas[qid].correta]),
    explicacoes: r.perguntas.map(qid => comentarios[qid].comentario)
  };
  estado.resultados[r.n] = ra.resultado;
}

function responder(j, k) {
  const ra = estado.rodadaAtual;
  if (!ra || !ra.aberta) return { erro: 'A rodada não está aberta.' };
  if (ra.pausadoRestante != null) return { erro: 'O jogo está pausado.' };
  const r = rodadaPorN[ra.n];
  const p = progressoJogador(j, r.n);
  if (p.idx >= r.perguntas.length) return { erro: 'Você já respondeu esta rodada.' };
  const qid = r.perguntas[p.idx];
  const q = perguntas[qid];
  const ordem = p.ordens[qid];
  if (!ordem || typeof k !== 'number' || k < 0 || k >= ordem.length) return { erro: 'Resposta inválida.' };
  const escolhida = ordem[k];
  const ok = escolhida === q.correta;
  const agora = Date.now();
  const ms = agora - (p.inicioQuestao || ra.inicio);
  const fracao = Math.max(0, 1 - ms / (TEMPO_QUESTAO * 1000));
  const pts = ok ? 10 + Math.round(5 * fracao) : 0;
  p.respostas.push({ qid, escolhida, ok, ms, pts });
  j.pontos += pts;
  j.respondidas += 1;
  if (ok) j.acertos += 1;
  j.tempoTotal += ms;
  p.idx += 1;
  p.inicioQuestao = agora;

  const ultima = p.idx >= r.perguntas.length;
  if (!ultima) {
    p.parcial = { ok: null, titulo: 'Voto registrado!', texto: 'Envelope duplo: agora vote na segunda questão.' };
  } else {
    p.parcial = null;
    p.final = { tipo: 'votou', titulo: 'Voto registrado!', texto: 'Aguarde a turma. A alternativa mais votada decide para onde todos vão correr.' };
  }
  salvar();
  verificarFechamento();
  return { ok: true };
}

function verificarFechamento() {
  const ra = estado.rodadaAtual;
  if (!ra || !ra.aberta || ra.pausadoRestante != null) return;
  const r = rodadaPorN[ra.n];
  const jogs = listaJogadores();
  const todos = jogs.length > 0 && jogs.every(j => terminouRodada(j, r));
  if (todos || Date.now() >= ra.prazo) {
    fecharRodada();
    salvar();
    avisar();
  }
}
setInterval(verificarFechamento, 500);

// ---------- Avançar etapas ----------
function entrarEtapa() {
  const e = etapaAtual();
  if (e.tipo === 'rodada') {
    const ra = estado.rodadaAtual;
    if (!ra || ra.n !== e.n) {
      if (estado.resultados[e.n]) {
        estado.rodadaAtual = { n: e.n, aberta: false, resultado: estado.resultados[e.n] };
      } else {
        estado.rodadaAtual = { n: e.n, aberta: false, cena: true, resultado: null };
      }
    }
  }
  if (e.tipo === 'final' && estado.finalBom == null) estado.finalBom = estado.relogio > 0;
}
function sairEtapa() {
  const e = etapaAtual();
  if (e.tipo === 'palpite' && !estado.palpitePago) {
    estado.palpitePago = true;
    for (const j of listaJogadores()) if (j.palpite === culpado) j.pontos += PONTOS_PALPITE;
  }
}
function irPara(i) {
  if (i < 0 || i >= etapas.length) return;
  const ra = estado.rodadaAtual;
  if (ra && ra.aberta) fecharRodada({ pulada: true });
  sairEtapa();
  estado.etapa = i;
  if (i < etapas.findIndex(x => x.tipo === 'final')) estado.finalBom = null;
  entrarEtapa();
}

function acaoControle(a, dados) {
  const ra = estado.rodadaAtual;
  const e = etapaAtual();
  switch (a) {
    case 'proximo':
      if (e.tipo === 'rodada' && ra && ra.cena) { abrirRodada(ra.n); break; }
      if (e.tipo === 'rodada' && ra && ra.aberta) { fecharRodada(); break; }
      if (estado.etapa < etapas.length - 1) { sairEtapa(); estado.etapa += 1; entrarEtapa(); }
      break;
    case 'anterior':
      if (e.tipo === 'rodada' && ra && ra.aberta) return { erro: 'Feche a rodada antes de voltar.' };
      if (estado.etapa > 0) {
        estado.etapa -= 1;
        if (estado.etapa < etapas.findIndex(x => x.tipo === 'final')) estado.finalBom = null;
        entrarEtapa();
      }
      break;
    case 'irPara': irPara(Number(dados.indice)); break;
    case 'pausar':
      if (ra && ra.aberta && ra.pausadoRestante == null) ra.pausadoRestante = Math.max(0, ra.prazo - Date.now());
      break;
    case 'retomar':
      if (ra && ra.aberta && ra.pausadoRestante != null) {
        const extra = Date.now() + ra.pausadoRestante - ra.prazo;
        ra.prazo = Date.now() + ra.pausadoRestante;
        ra.pausadoRestante = null;
        for (const j of listaJogadores()) {
          const p = j.rodadas[ra.n];
          if (p && p.inicioQuestao) p.inicioQuestao += Math.max(0, extra);
        }
      }
      break;
    case 'mais30':
      if (ra && ra.aberta) {
        if (ra.pausadoRestante != null) ra.pausadoRestante += 30000; else ra.prazo += 30000;
      }
      break;
    case 'pular':
      if (e.tipo === 'rodada' && ra && ra.cena) abrirRodada(ra.n);
      if (e.tipo === 'rodada' && estado.rodadaAtual && estado.rodadaAtual.aberta) fecharRodada({ pulada: true });
      if (estado.etapa < etapas.length - 1) { sairEtapa(); estado.etapa += 1; entrarEtapa(); }
      break;
    case 'relogioMais': estado.relogio += 5; break;
    case 'relogioMenos': estado.relogio = Math.max(0, estado.relogio - 5); break;
    case 'qr': estado.qrVisivel = !estado.qrVisivel; break;
    case 'remover': delete estado.jogadores[dados.id]; break;
    case 'zerar':
      if (dados.confirmacao !== 'ZERAR') return { erro: 'Digite ZERAR para confirmar.' };
      estado = estadoNovo();
      break;
    default: return { erro: 'Ação desconhecida.' };
  }
  salvar();
  return { ok: true };
}

// ---------- Visões (o que cada tela recebe) ----------
function cadernoAte() {
  const e = etapaAtual();
  let limite = 0;
  for (let i = 0; i <= estado.etapa; i++) if (etapas[i].tipo === 'rodada') limite = etapas[i].n;
  if (e.tipo === 'lobby') limite = 0;
  return rodadas.filter(r => r.n <= limite).map(r => ({
    n: r.n, lugar: ambientes[r.local].nome,
    personagem: r.vazia ? null : ambientes[r.local].personagem, fala: r.fala
  }));
}
function textoEtapa(e) {
  if (e.tipo === 'texto') return textos[e.chave];
  if (e.tipo === 'palpite') return textos.palpite;
  if (e.tipo === 'final') return estado.finalBom ? textos.finalBom : textos.finalRuim;
  if (e.tipo === 'ranking') return textos.encerramento;
  return null;
}
function visaoRodada(publico) {
  const ra = estado.rodadaAtual;
  const e = etapaAtual();
  if (e.tipo !== 'rodada' || !ra) return null;
  const r = rodadaPorN[ra.n];
  const amb = ambientes[r.local];
  const jogs = listaJogadores();
  return {
    n: r.n, total: rodadas.length, lugar: amb.nome,
    personagem: r.vazia ? null : amb.personagem,
    img: urlImagem(amb.img), foto: r.vazia ? null : urlImagem(amb.foto),
    cena: !!ra.cena, chegada: r.chegada || [],
    fala: r.fala, envelope: r.envelope,
    nq: r.perguntas.length, aberta: ra.aberta,
    restante: restanteMs(), pausado: ra.pausadoRestante != null,
    terminaram: jogs.filter(j => terminouRodada(j, r)).length, jogadores: jogs.length,
    resultado: ra.resultado || null
  };
}
function visaoTelao(host) {
  const e = etapaAtual();
  const t = textoEtapa(e);
  const rk = ranking();
  return {
    etapa: { tipo: e.tipo, indice: estado.etapa, total: etapas.length, nome: e.nome, chave: e.chave || null },
    texto: t ? { titulo: t.titulo, paragrafos: t.texto, img: urlImagem(t.img) } : null,
    rodada: visaoRodada(true),
    relogio: estado.relogio, relogioInicial: RELOGIO_INICIAL,
    jogadores: rk.length,
    nomes: e.tipo === 'lobby' ? listaJogadores().sort((a, b) => b.entrouEm - a.entrouEm).slice(0, 60).map(j => j.nome) : [],
    top: rk.slice(0, e.tipo === 'ranking' || e.tipo === 'final' ? 15 : 6),
    palpites: e.tipo === 'palpite' ? listaJogadores().filter(j => j.palpite).length : 0,
    palpiteCertos: (e.tipo === 'final' || e.tipo === 'ranking') ? listaJogadores().filter(j => j.palpite === culpado).length : null,
    finalBom: e.tipo === 'final' || e.tipo === 'ranking' ? estado.finalBom : null,
    qr: estado.qrVisivel
  };
}
function visaoCelular(id) {
  const j = estado.jogadores[id];
  if (!j) return { fase: 'entrar' };
  const e = etapaAtual();
  const rk = ranking();
  const eu = rk.find(x => x.id === id);
  const base = {
    jogador: { nome: j.nome, pontos: j.pontos, posicao: eu ? eu.posicao : null, total: rk.length, acertos: j.acertos, respondidas: j.respondidas },
    relogio: estado.relogio,
    caderno: cadernoAte(),
    etapaNome: e.nome
  };
  if (e.tipo === 'rodada' && estado.rodadaAtual) {
    const ra = estado.rodadaAtual;
    const r = rodadaPorN[ra.n];
    const p = progressoJogador(j, r.n);
    base.rodada = { n: r.n, total: rodadas.length, lugar: ambientes[r.local].nome, personagem: r.vazia ? null : ambientes[r.local].personagem };
    if (ra.cena) {
      return Object.assign(base, { fase: 'cena', chegada: r.chegada || [], fala: r.fala, foto: r.vazia ? null : urlImagem(ambientes[r.local].foto) });
    }
    if (ra.aberta && p.idx < r.perguntas.length) {
      const qid = r.perguntas[p.idx];
      const q = perguntas[qid];
      if (!p.ordens[qid]) { p.ordens[qid] = embaralhar(q.alternativas.length); salvar(); }
      if (p.inicioQuestao == null) p.inicioQuestao = Date.now();
      return Object.assign(base, {
        fase: 'pergunta',
        parcial: p.parcial || null,
        pergunta: {
          chave: `${r.n}-${p.idx}`, numero: p.idx + 1, de: r.perguntas.length, qid,
          texto: q.texto, opcoes: p.ordens[qid].map(i => q.alternativas[i]),
          tempoTotal: TEMPO_QUESTAO * 1000 * r.perguntas.length
        },
        restante: restanteMs(), pausado: ra.pausadoRestante != null
      });
    }
    if (ra.aberta) {
      return Object.assign(base, { fase: 'esperando', final: p.final, restante: restanteMs(), pausado: ra.pausadoRestante != null });
    }
    const minhas = r.perguntas.map((qid, i) => {
      const resp = p.respostas[i];
      const q = perguntas[qid];
      return { qid, ok: resp ? resp.ok : false, respondeu: !!resp, certa: q.alternativas[q.correta], sua: resp ? q.alternativas[resp.escolhida] : null, comentario: comentarios[qid].comentario };
    });
    return Object.assign(base, { fase: 'resultado', final: p.final, minhas, resultado: ra.resultado });
  }
  if (e.tipo === 'palpite') {
    return Object.assign(base, { fase: 'palpite', suspeitos, palpite: j.palpite || null });
  }
  if (e.tipo === 'final' || e.tipo === 'ranking') {
    return Object.assign(base, {
      fase: 'fim', finalBom: estado.finalBom,
      palpiteCerto: j.palpite ? j.palpite === culpado : null,
      relatorio: '/relatorio?id=' + encodeURIComponent(id),
      culpado: suspeitos.find(s => s.id === culpado).nome
    });
  }
  return Object.assign(base, { fase: 'aguardar', titulo: textoEtapa(e) ? textoEtapa(e).titulo : null, lobby: e.tipo === 'lobby' });
}
function visaoControle() {
  const e = etapaAtual();
  return {
    etapas: etapas.map((x, i) => ({ i, nome: x.nome, tipo: x.tipo })),
    etapa: estado.etapa, etapaNome: e.nome, tipo: e.tipo,
    rodada: visaoRodada(false),
    relogio: estado.relogio,
    jogadores: ranking(),
    qr: estado.qrVisivel,
    palpites: listaJogadores().filter(j => j.palpite).length,
    proximaNome: etapas[estado.etapa + 1] ? etapas[estado.etapa + 1].nome : null
  };
}

// ---------- Tempo real (SSE) ----------
const conexoes = new Set();
let avisoPendente = false;
let ultimoAviso = 0;
function avisar() {
  if (avisoPendente) return;
  avisoPendente = true;
  const espera = Math.max(0, 150 - (Date.now() - ultimoAviso));
  setTimeout(() => {
    avisoPendente = false;
    ultimoAviso = Date.now();
    for (const c of conexoes) enviar(c);
  }, espera);
}
function enviar(c) {
  let dados;
  try {
    if (c.tipo === 'telao') dados = visaoTelao(c.host);
    else if (c.tipo === 'controle') dados = visaoControle();
    else dados = visaoCelular(c.id);
    c.res.write(`data: ${JSON.stringify(dados)}\n\n`);
  } catch (e) { console.error('Erro ao enviar:', e.message); }
}
setInterval(() => { for (const c of conexoes) c.res.write(': ping\n\n'); }, 20000);

// ---------- HTTP ----------
const ARQUIVOS = {
  '/': ['celular.html', 'text/html; charset=utf-8'],
  '/telao': ['telao.html', 'text/html; charset=utf-8'],
  '/controle': ['controle.html', 'text/html; charset=utf-8'],
  '/estilo.css': ['estilo.css', 'text/css; charset=utf-8']
};
const TIPOS_IMG = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

function lerCorpo(req) {
  return new Promise((ok, falha) => {
    let s = '';
    req.on('data', d => { s += d; if (s.length > 1e5) { falha(new Error('grande')); req.destroy(); } });
    req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch (e) { ok({}); } });
  });
}
function json(res, cod, obj) {
  res.writeHead(cod, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}
function urlPublica(req) {
  if (process.env.URL_PUBLICA) return process.env.URL_PUBLICA;
  const proto = (req.headers['x-forwarded-proto'] || 'http').split(',')[0];
  return `${proto}://${req.headers.host}/`;
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const rota = url.pathname;
  try {
    if (req.method === 'GET' && ARQUIVOS[rota]) {
      const [arq, tipo] = ARQUIVOS[rota];
      res.writeHead(200, { 'Content-Type': tipo, 'Cache-Control': 'no-cache' });
      return fs.createReadStream(path.join(DIR, arq)).pipe(res);
    }
    if (req.method === 'GET' && rota.startsWith('/img/')) {
      const nome = rota.slice(5);
      const m = /^(img-[a-z0-9-]+)\.(jpg|jpeg|png|webp)$/.exec(nome);
      const arq = m && path.join(DIR, nome);
      if (!m || !fs.existsSync(arq)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TIPOS_IMG[m[2]], 'Cache-Control': 'public, max-age=3600' });
      return fs.createReadStream(arq).pipe(res);
    }
    if (req.method === 'GET' && rota === '/qr.svg') {
      const svg = await QRCode.toString(urlPublica(req), { type: 'svg', margin: 1, color: { dark: '#000000', light: '#ffffff' } });
      res.writeHead(200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' });
      return res.end(svg);
    }
    if (req.method === 'GET' && rota === '/endereco') return json(res, 200, { url: urlPublica(req) });
    if (req.method === 'GET' && rota === '/relatorio') {
      const j = estado.jogadores[url.searchParams.get('id')];
      if (!j) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Jogador não encontrado.'); }
      const rk = ranking();
      const d = relatorio.dadosAluno(j, perguntas, rodadas, estado.resultados);
      const html = relatorio.paginaAluno(j, d, {
        posicao: (rk.find(x => x.id === j.id) || {}).posicao, totalJogadores: rk.length,
        palpite: j.palpite ? j.palpite === culpado : null
      });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(html);
    }
    if (req.method === 'GET' && (rota === '/turma' || rota === '/turma.csv')) {
      if (url.searchParams.get('senha') !== SENHA) { res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Senha errada.'); }
      const t = relatorio.dadosTurma(estado.jogadores, perguntas, rodadas, estado.resultados, ranking());
      if (rota === '/turma.csv') {
        res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="turma-trilha-do-corretor.csv"' });
        return res.end(relatorio.csvTurma(t));
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(relatorio.paginaTurma(t, SENHA));
    }
    if (req.method === 'GET' && rota === '/api/estado') return json(res, 200, visaoCelular(url.searchParams.get('id')));
    if (req.method === 'GET' && rota === '/saude') {
      return json(res, 200, { ok: true, jogadores: listaJogadores().length, etapa: etapaAtual().nome, conexoes: conexoes.size });
    }
    if (req.method === 'GET' && rota === '/eventos') {
      const tipo = url.searchParams.get('tipo') || 'celular';
      if (tipo === 'controle' && url.searchParams.get('senha') !== SENHA) { res.writeHead(403); return res.end(); }
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
      res.write('retry: 2000\n\n');
      const c = { res, tipo, id: url.searchParams.get('id'), host: req.headers.host };
      conexoes.add(c);
      enviar(c);
      req.on('close', () => conexoes.delete(c));
      return;
    }
    if (req.method === 'POST' && rota === '/api/entrar') {
      const b = await lerCorpo(req);
      let nome = String(b.nome || '').replace(/\s+/g, ' ').trim().slice(0, 24);
      if (nome.length < 2) return json(res, 400, { erro: 'Digite seu nome.' });
      const usados = new Set(listaJogadores().map(j => j.nome.toLowerCase()));
      let final = nome, k = 2;
      while (usados.has(final.toLowerCase())) final = `${nome} ${k++}`;
      const id = crypto.randomBytes(9).toString('base64url');
      estado.jogadores[id] = { id, nome: final, pontos: 0, acertos: 0, respondidas: 0, tempoTotal: 0, entrouEm: Date.now(), rodadas: {}, palpite: null };
      const ra = estado.rodadaAtual;
      if (ra && ra.aberta) progressoJogador(estado.jogadores[id], ra.n).inicioQuestao = Date.now();
      salvar(); avisar();
      return json(res, 200, { id, nome: final });
    }
    if (req.method === 'POST' && rota === '/api/responder') {
      const b = await lerCorpo(req);
      const j = estado.jogadores[b.id];
      if (!j) return json(res, 404, { erro: 'Jogador não encontrado. Entre de novo.' });
      const ra = estado.rodadaAtual;
      if (ra && b.chave) {
        const p = j.rodadas[ra.n];
        if (!p || `${ra.n}-${p.idx}` !== b.chave) return json(res, 409, { erro: 'Essa questão já foi respondida.' });
      }
      const r = responder(j, Number(b.opcao));
      avisar();
      return json(res, r.erro ? 400 : 200, r);
    }
    if (req.method === 'POST' && rota === '/api/palpite') {
      const b = await lerCorpo(req);
      const j = estado.jogadores[b.id];
      if (!j) return json(res, 404, { erro: 'Jogador não encontrado.' });
      if (etapaAtual().tipo !== 'palpite') return json(res, 400, { erro: 'O palpite está fechado.' });
      if (!suspeitos.some(s => s.id === b.suspeito)) return json(res, 400, { erro: 'Suspeito inválido.' });
      j.palpite = b.suspeito;
      salvar(); avisar();
      return json(res, 200, { ok: true });
    }
    if (req.method === 'POST' && rota === '/api/controle') {
      const b = await lerCorpo(req);
      if (b.senha !== SENHA) return json(res, 403, { erro: 'Senha errada.' });
      const r = acaoControle(b.acao, b);
      avisar();
      return json(res, r.erro ? 400 : 200, r);
    }
    if (rota === '/favicon.ico') { res.writeHead(204); return res.end(); }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
  } catch (e) {
    console.error(e);
    if (!res.headersSent) json(res, 500, { erro: 'Erro no servidor.' });
  }
});

// Atualiza os relógios das telas a cada segundo durante uma rodada aberta.
setInterval(() => {
  const ra = estado.rodadaAtual;
  if (ra && ra.aberta) avisar();
}, 1000);

servidor.listen(PORT, () => console.log(`A Trilha do Corretor rodando na porta ${PORT}`));
