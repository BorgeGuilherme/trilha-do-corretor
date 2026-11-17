// Relatório individual do aluno e relatório da turma (para o professor).

const { comentarios, temas } = require('./comentarios');

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = (a, b) => (b ? Math.round(a / b * 100) : 0);
const resumoTexto = (t, n = 110) => (t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t);

// Junta tudo o que um aluno respondeu na partida.
function dadosAluno(j, perguntas, rodadas, resultados) {
  const respostas = {};
  for (const r of rodadas) {
    const p = j.rodadas[r.n];
    if (p) for (const x of p.respostas) respostas[x.qid] = x;
  }
  const fechadas = new Set(Object.keys(resultados).map(Number));
  const itens = [];
  for (const r of rodadas) {
    for (const qid of r.perguntas) {
      const q = perguntas[qid];
      const x = respostas[qid];
      if (!x && !fechadas.has(r.n)) continue; // rodada ainda não jogada
      const pulada = resultados[r.n] && resultados[r.n].pulada && !x;
      if (pulada) continue;
      itens.push({
        qid, rodada: r.n, texto: q.texto,
        ok: x ? x.ok : false, respondeu: !!x,
        sua: x ? q.alternativas[x.escolhida] : null,
        certa: q.alternativas[q.correta],
        tema: comentarios[qid].tema, comentario: comentarios[qid].comentario
      });
    }
  }
  const porTema = {};
  for (const t of Object.values(temas)) porTema[t] = { total: 0, certas: 0 };
  for (const i of itens) { porTema[i.tema].total++; if (i.ok) porTema[i.tema].certas++; }
  const certas = itens.filter(i => i.ok).length;
  const revisar = Object.entries(porTema)
    .filter(([, v]) => v.total && v.certas < v.total)
    .sort((a, b) => a[1].certas / a[1].total - b[1].certas / b[1].total)
    .map(([t, v]) => ({ tema: t, certas: v.certas, total: v.total }));
  return { itens, certas, total: itens.length, porTema, revisar };
}

function textoWhatsApp(j, d, extra) {
  const linhas = [];
  linhas.push(`*A Trilha do Corretor · Relatório de ${j.nome}*`);
  linhas.push(`Acertos: ${d.certas} de ${d.total} (${pct(d.certas, d.total)}%) · ${j.pontos} pontos · ${extra.posicao}º lugar`);
  const erros = d.itens.filter(i => !i.ok);
  if (erros.length) {
    linhas.push('');
    linhas.push(`*Para revisar (${erros.length}):*`);
    for (const i of erros) linhas.push(`• Q${i.qid} (${i.tema}): ${resumoTexto(i.certa, 140)}`);
  } else {
    linhas.push('Acertei todas as questões!');
  }
  if (d.revisar.length) {
    linhas.push('');
    linhas.push('*Temas que preciso estudar:* ' + d.revisar.slice(0, 3).map(r => r.tema).join('; '));
  }
  return linhas.join('\n');
}

function paginaAluno(j, d, extra) {
  const erros = d.itens.filter(i => !i.ok);
  const data = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const zap = textoWhatsApp(j, d, extra);
  const corpo = `
  <h1>Relatório de desempenho</h1>
  <p class="meta">A Trilha do Corretor · Revisão da Avaliação Unificada de Redes e Segurança da Informação · ${esc(data)}</p>
  <table class="resumo"><tr>
    <td><b>${esc(j.nome)}</b><span>aluno</span></td>
    <td><b>${d.certas}/${d.total}</b><span>acertos (${pct(d.certas, d.total)}%)</span></td>
    <td><b>${j.pontos}</b><span>pontos</span></td>
    <td><b>${extra.posicao}º</b><span>de ${extra.totalJogadores}</span></td>
  </tr></table>
  <h2>Desempenho por tema</h2>
  <table class="temas">
    <tr><th>Tema</th><th>Acertos</th><th></th></tr>
    ${Object.entries(d.porTema).filter(([, v]) => v.total).map(([t, v]) => `<tr><td>${esc(t)}</td><td>${v.certas} de ${v.total}</td><td><div class="bar"><div style="width:${pct(v.certas, v.total)}%;background:${v.certas === v.total ? '#2e8b57' : (v.certas / v.total >= .5 ? '#d39b2a' : '#c0392b')}"></div></div></td></tr>`).join('')}
  </table>
  ${d.revisar.length ? `<p class="dica"><b>O que estudar primeiro:</b> ${d.revisar.slice(0, 3).map(r => esc(r.tema)).join('; ')}.</p>` : '<p class="dica"><b>Parabéns:</b> você acertou todos os temas.</p>'}
  <h2>Questões para revisar (${erros.length})</h2>
  ${erros.length ? erros.map(i => `
    <div class="q">
      <div class="qn">Questão ${i.qid} · ${esc(i.tema)}</div>
      <p class="en">${esc(i.texto)}</p>
      <p class="sua">${i.respondeu ? 'Sua resposta: ' + esc(i.sua) : 'Você não respondeu a tempo.'}</p>
      <p class="cer">Resposta certa: ${esc(i.certa)}</p>
      <p class="com"><b>Por quê:</b> ${esc(i.comentario)}</p>
    </div>`).join('') : '<p>Nenhuma. Você acertou tudo o que respondeu.</p>'}
  ${extra.palpite != null ? `<p class="meta" style="margin-top:18px">Palpite sobre o Corretor: ${extra.palpite ? 'certo' : 'errado'}.</p>` : ''}`;

  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Relatório · ${esc(j.nome)}</title>
<style>
  body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #1d1d1f; background: #f3f1ec; margin: 0; }
  .folha { background: #fff; max-width: 760px; margin: 0 auto; padding: 28px 24px 40px; }
  h1 { font-family: Georgia, serif; font-weight: normal; font-size: 28px; margin: 0 0 4px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .5px; color: #8e1622; margin: 26px 0 10px; border-bottom: 2px solid #8e1622; padding-bottom: 4px; }
  .meta { color: #666; font-size: 13px; margin: 0; }
  table.resumo { width: 100%; border-collapse: collapse; margin-top: 18px; }
  table.resumo td { border: 1px solid #ddd; padding: 10px; text-align: center; width: 25%; }
  table.resumo b { display: block; font-size: 20px; }
  table.resumo span { color: #666; font-size: 12px; }
  table.temas { width: 100%; border-collapse: collapse; font-size: 14px; }
  table.temas th { text-align: left; color: #666; font-weight: 600; font-size: 12px; padding: 4px 6px; }
  table.temas td { padding: 7px 6px; border-top: 1px solid #eee; }
  table.temas td:nth-child(2) { white-space: nowrap; width: 80px; }
  table.temas td:nth-child(3) { width: 35%; }
  .bar { height: 10px; background: #eee; border-radius: 5px; overflow: hidden; }
  .bar div { height: 100%; }
  .dica { background: #fff7e6; border-left: 4px solid #d39b2a; padding: 10px 12px; font-size: 14px; }
  .q { border: 1px solid #e3e0d8; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; page-break-inside: avoid; }
  .qn { font-size: 12px; font-weight: 700; color: #8e1622; text-transform: uppercase; letter-spacing: .4px; }
  .q p { margin: 6px 0; font-size: 14px; line-height: 1.45; }
  .en { color: #444; }
  .sua { color: #b03030; }
  .cer { color: #1f7a4a; font-weight: 600; }
  .com { background: #f6f6f3; padding: 8px 10px; border-radius: 6px; }
  .acoes { position: sticky; top: 0; z-index: 2; background: #1d1d1f; padding: 10px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
  .acoes button, .acoes a { flex: 1 1 140px; max-width: 220px; padding: 11px 10px; border-radius: 8px; border: 0; font: inherit; font-weight: 600; font-size: 14px; cursor: pointer; text-align: center; text-decoration: none; }
  .b1 { background: #25d366; color: #052e16; }
  .b2 { background: #fff; color: #1d1d1f; }
  .b3 { background: #d62839; color: #fff; }
  @media print { .acoes { display: none; } body { background: #fff; } .folha { padding: 0; } }
</style></head>
<body>
<div class="acoes">
  <a class="b1" id="zap" href="https://wa.me/?text=${encodeURIComponent(zap)}" target="_blank" rel="noopener">Enviar no WhatsApp</a>
  <button class="b2" id="pdf">Salvar em PDF</button>
  <button class="b2" id="doc">Baixar documento (.doc)</button>
  <button class="b3" id="comp" style="display:none">Compartilhar</button>
</div>
<div class="folha" id="doc-conteudo">${corpo}</div>
<script>
  const nomeArq = ${JSON.stringify('relatorio-' + j.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase())};
  const texto = ${JSON.stringify(zap)};
  document.getElementById('pdf').onclick = () => window.print();
  document.getElementById('doc').onclick = () => {
    const estilo = document.querySelector('style').outerHTML.replace(/\\.acoes[^}]*}/g, '');
    const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">' + estilo + '</head><body>' + document.getElementById('doc-conteudo').innerHTML + '</body></html>';
    const blob = new Blob(['\\ufeff', html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nomeArq + '.doc';
    document.body.appendChild(a); a.click(); a.remove();
  };
  if (navigator.share) {
    const b = document.getElementById('comp');
    b.style.display = '';
    b.onclick = () => navigator.share({ title: 'Meu relatório · A Trilha do Corretor', text: texto }).catch(() => {});
  }
</script>
</body></html>`;
}

function dadosTurma(jogadores, perguntas, rodadas, resultados, ranking) {
  const alunos = ranking.map(r => {
    const j = jogadores[r.id];
    const d = dadosAluno(j, perguntas, rodadas, resultados);
    return { nome: j.nome, posicao: r.posicao, pontos: j.pontos, certas: d.certas, total: d.total, erradas: d.itens.filter(i => !i.ok).map(i => i.qid) };
  });
  const porQuestao = Object.values(perguntas).map(q => {
    let total = 0, certas = 0;
    for (const j of Object.values(jogadores)) {
      for (const p of Object.values(j.rodadas)) for (const x of p.respostas) if (x.qid === q.id) { total++; if (x.ok) certas++; }
    }
    return { qid: q.id, tema: comentarios[q.id].tema, texto: q.texto, certa: q.alternativas[q.correta], total, certas };
  }).filter(x => x.total);
  return { alunos, porQuestao };
}

function paginaTurma(t, senha) {
  const dificeis = t.porQuestao.slice().sort((a, b) => a.certas / a.total - b.certas / b.total);
  const data = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Relatório da turma</title>
<style>
  body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; color: #1d1d1f; margin: 0; background: #fff; }
  .folha { max-width: 900px; margin: 0 auto; padding: 24px 18px 40px; }
  h1 { font-family: Georgia, serif; font-weight: normal; margin: 0 0 4px; }
  h2 { font-size: 15px; text-transform: uppercase; color: #8e1622; border-bottom: 2px solid #8e1622; padding-bottom: 4px; margin-top: 28px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { text-align: left; font-size: 12px; color: #666; padding: 6px; border-bottom: 1px solid #ccc; }
  td { padding: 7px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
  .p { white-space: nowrap; font-weight: 700; }
  .ruim { color: #b03030; } .medio { color: #a06d00; } .bom { color: #1f7a4a; }
  .acoes { display: flex; gap: 8px; margin: 14px 0; }
  .acoes a, .acoes button { padding: 10px 14px; border-radius: 8px; border: 1px solid #ccc; background: #f5f5f5; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; color: #1d1d1f; }
  @media print { .acoes { display: none; } }
</style></head><body><div class="folha">
<h1>Relatório da turma</h1>
<p style="color:#666;margin:0">A Trilha do Corretor · ${esc(data)} · ${t.alunos.length} alunos</p>
<div class="acoes"><button onclick="print()">Salvar em PDF</button><a href="/turma.csv?senha=${encodeURIComponent(senha)}">Baixar planilha (CSV)</a></div>
<h2>Questões que a turma mais errou</h2>
<table><tr><th>Questão</th><th>Tema</th><th>Acerto</th><th>Resposta certa</th></tr>
${dificeis.map(q => { const v = pct(q.certas, q.total); return `<tr><td class="p">Q${q.qid}</td><td>${esc(q.tema)}</td><td class="p ${v < 50 ? 'ruim' : v < 75 ? 'medio' : 'bom'}">${v}% <small style="color:#888;font-weight:400">(${q.certas}/${q.total})</small></td><td>${esc(resumoTexto(q.certa, 160))}</td></tr>`; }).join('')}
</table>
<h2>Alunos</h2>
<table><tr><th>#</th><th>Nome</th><th>Pontos</th><th>Acertos</th><th>Errou as questões</th></tr>
${t.alunos.map(a => `<tr><td>${a.posicao}º</td><td>${esc(a.nome)}</td><td class="p">${a.pontos}</td><td class="p">${a.certas}/${a.total}</td><td>${a.erradas.length ? a.erradas.map(n => 'Q' + n).join(', ') : '—'}</td></tr>`).join('')}
</table></div></body></html>`;
}

function csvTurma(t) {
  const linhas = [['posicao', 'nome', 'pontos', 'acertos', 'respondidas', 'questoes_erradas'].join(';')];
  for (const a of t.alunos) linhas.push([a.posicao, '"' + a.nome.replace(/"/g, '""') + '"', a.pontos, a.certas, a.total, a.erradas.map(n => 'Q' + n).join(' ')].join(';'));
  return '﻿' + linhas.join('\r\n');
}

module.exports = { dadosAluno, paginaAluno, dadosTurma, paginaTurma, csvTurma };
