# A Trilha do Corretor

Jogo de revisão para a Avaliação Unificada de Redes e Segurança da Informação (FAMATEC). São 24 rodadas e as 30 questões da revisão. Cada aluno joga no próprio celular, o telão mostra a história e o professor conduz pelo controle.

## Subir no Railway

1. Crie um repositório novo no GitHub e envie **o conteúdo** desta pasta (sem `node_modules`).
2. No Railway: **New Project → Deploy from GitHub repo** → escolha o repositório.
3. Em **Variables**, crie `SENHA` com a senha do controle. Se não criar, a senha é `fama2026`.
4. Em **Settings → Networking → Generate Domain**, gere o domínio.
5. Abra `https://SEU-DOMINIO/saude`. Se aparecer `"ok": true`, está no ar.

## Endereços

| Para quê | Endereço |
| --- | --- |
| Celular dos alunos | `/` (pelo QR do telão) |
| Telão | `/telao`. Clique uma vez para ativar o som e a tela cheia |
| Controle do professor | `/controle` |
| Relatório da turma | `/turma?senha=SUA_SENHA` (também tem link no controle) |
| Teste do servidor | `/saude` |

## Como conduzir

- O botão grande do controle faz tudo: avança a história, mostra a cena de chegada (leia em voz alta), abre a prova e fecha a rodada.
- A rodada fecha sozinha quando todos respondem ou quando o tempo acaba (100 s por questão).
- Durante a rodada, você pode **pausar**, dar **+30 s** ou **pular**.
- **Votação:** cada aluno vota no celular. A alternativa mais votada é a escolha da turma (empate é decidido no sorteio). Se a maioria acertar, a turma corre para o lugar certo. Se errar, corre para um lugar errado e perde tempo. O voto de cada um vale para os pontos individuais e para o relatório.
- **Fôlego do professor:** começa em 75 min. Cada questão em que a maioria erra tira 5 min. Se a turma errar 15 das 30 questões, o fôlego zera e o final é ruim. Os botões −5 e +5 ajustam o relógio na mão.
- **Ir para uma etapa:** serve para pular para qualquer ponto da história, por exemplo para a volta do intervalo.

## Relatórios

- **Aluno:** na tela final do celular aparece o botão **Ver meu relatório**. Ele mostra acertos por tema, cada questão errada com a resposta certa e o porquê, e tem botões para enviar no WhatsApp, salvar em PDF e baixar como documento do Word (.doc).
- **Professor:** `/turma` mostra as questões que a turma mais errou e o desempenho de cada aluno, com opção de PDF e planilha (CSV).

## Imagens (opcional)

Coloque as imagens na mesma pasta do `server.js`, com estes nomes (jpg, png ou webp). Sem imagem, o telão usa um fundo escuro com o nome do lugar.

| Arquivo | Onde aparece |
| --- | --- |
| img-abertura | Abertura |
| img-sala12 | Sala 12 (rodadas 1 e 14) |
| img-quadra | Quadra (rodadas 2 e 15, e a volta do intervalo) |
| img-cantina | Cantina (3 e 18) |
| img-informatica | Laboratório de informática (4 e 17) |
| img-secretaria | Secretaria (5 e 21) |
| img-biblioteca | Biblioteca (6 e 16) |
| img-professores | Sala dos professores (7) |
| img-enfermaria | Enfermaria (8 e 20) |
| img-diretoria | Diretoria (9 e 19) |
| img-auditorio | Auditório (10 e 22) |
| img-ciencias | Laboratório de ciências (11) |
| img-portaria | Portaria (12 e 23) |
| img-gremio | Sala do grêmio (13) |
| img-gancho | Gancho e intervalo |
| img-maquinas | Casa de máquinas (palpite e rodada 24) |
| img-revelacao | Revelação |
| img-final-bom | Final bom |
| img-final-ruim | Final ruim |

Retratos dos personagens (aparecem na cena de chegada e ao lado do nome no telão, em formato quadrado):

| Arquivo | Personagem |
| --- | --- |
| img-p-vera | Coordenadora Vera |
| img-p-raimundo | Seu Raimundo |
| img-p-zeze | Dona Zezé |
| img-p-igor | Igor |
| img-p-neide | Neide |
| img-p-marta | Dona Marta |
| img-p-bruno | Prof. Bruno |
| img-p-rosa | Enfermeira Rosa |
| img-p-celina | Diretora Celina |
| img-p-livia | Profa. Lívia |
| img-p-priscila | Priscila |
| img-p-josue | Josué |
| img-p-carol | Carol |
| img-p-henrique | Prof. Henrique |

## Mudar questões ou textos

- Questões e gabarito: `perguntas.js`. O navegador nunca recebe esse arquivo.
- Tema e comentário de cada questão: `comentarios.js`.
- História, falas, envelopes e quais questões caem em cada rodada: `historia.js`.
- Tempo por questão, relógio e penalidade: variáveis `TEMPO_QUESTAO`, `RELOGIO_INICIAL` e `PENALIDADE` no Railway.

## Cuidados

- O estado fica em `dados/estado.json`. Um reinício simples mantém tudo e deixa a rodada pausada. Um **novo deploy no Railway apaga tudo**, então não faça deploy durante a aula.
- `npm run teste` simula 30 alunos jogando o jogo inteiro (cerca de 3.700 verificações).
