// A história do jogo "A Trilha do Corretor".
// Imagens (opcionais): coloque na mesma pasta do server.js arquivos com estes nomes
// (jpg, png ou webp), por exemplo img-quadra.jpg ou img-p-vera.png.
// img     = cenário do lugar     foto = retrato do personagem

const ambientes = {
  sala12: {
    nome: 'Sala 12', personagem: 'Coordenadora Vera', img: 'img-sala12', foto: 'img-p-vera',
    vazio: [
      'A sala 12 está vazia. Só o giz no chão e um "boa sorte" escrito no quadro.',
      'Nada aqui além de carteiras e o eco dos seus passos.',
      'A sala está vazia. Você jura que ouviu uma risada no corredor.'
    ]
  },
  quadra: {
    nome: 'Quadra', personagem: 'Seu Raimundo', img: 'img-quadra', foto: 'img-p-raimundo',
    vazio: [
      'Seu Raimundo: "Tranquei tudo aqui. Envelope nenhum."',
      'Seu Raimundo: "Aqui só tem bola murcha e goteira, jovem."',
      'Seu Raimundo aponta a lanterna na sua cara: "Errou o caminho, hein?"'
    ]
  },
  cantina: {
    nome: 'Cantina', personagem: 'Dona Zezé', img: 'img-cantina', foto: 'img-p-zeze',
    vazio: [
      'Dona Zezé: "Aqui só tem café, meu filho. Nada de envelope."',
      'Dona Zezé: "Senta, come um pão de queijo e pensa melhor."',
      'Dona Zezé: "Nem debaixo da bandeja, nem dentro da garrafa. Volta lá!"'
    ]
  },
  informatica: {
    nome: 'Laboratório de informática', personagem: 'Igor', img: 'img-informatica', foto: 'img-p-igor',
    vazio: [
      'Igor: "Revirei as bancadas. Não tem nada aqui."',
      'Igor, sem tirar os olhos da tela: "Erro 404: envelope não encontrado."',
      'Igor: "Já dei ping em tudo aqui. Nada responde."'
    ]
  },
  secretaria: {
    nome: 'Secretaria', personagem: 'Neide', img: 'img-secretaria', foto: 'img-p-neide',
    vazio: [
      'Neide: "Trinta anos aqui e nunca vi esse envelope."',
      'Neide: "Sem protocolo, sem envelope. Próximo!"',
      'Neide carimba alguma coisa sem olhar: "Não é aqui, não."'
    ]
  },
  biblioteca: {
    nome: 'Biblioteca', personagem: 'Dona Marta', img: 'img-biblioteca', foto: 'img-p-marta',
    vazio: [
      'Dona Marta: "Nenhum envelope por aqui, querido. Aceita um chá?"',
      'Dona Marta: "Shhh! Biblioteca. E não, não tem envelope."',
      'Dona Marta, sorrindo: "Errar faz parte. Mas o tempo do professor está passando."'
    ]
  },
  professores: {
    nome: 'Sala dos professores', personagem: 'Prof. Bruno', img: 'img-professores', foto: 'img-p-bruno',
    vazio: [
      'Prof. Bruno: "Olhei todos os escaninhos. Nada."',
      'Prof. Bruno apita: "Falta! Lugar errado!"',
      'Prof. Bruno: "Aqui só tem prova para corrigir. Das minhas."'
    ]
  },
  enfermaria: {
    nome: 'Enfermaria', personagem: 'Enfermeira Rosa', img: 'img-enfermaria', foto: 'img-p-rosa',
    vazio: [
      'Enfermeira Rosa: "Só remédio e curativo aqui."',
      'Enfermeira Rosa: "Se veio pela dor de cabeça da questão, tenho dipirona. Envelope, não."',
      'Enfermeira Rosa: "Respira fundo e tenta de novo."'
    ]
  },
  diretoria: {
    nome: 'Diretoria', personagem: 'Diretora Celina', img: 'img-diretoria', foto: 'img-p-celina',
    vazio: [
      'Diretora Celina: "Fora da minha sala. Não tem envelope nenhum aqui."',
      'Diretora Celina: "Isso vai para a sua ficha. Errou o lugar."',
      'Diretora Celina nem levanta os olhos: "Porta."'
    ]
  },
  auditorio: {
    nome: 'Auditório', personagem: 'Profa. Lívia', img: 'img-auditorio', foto: 'img-p-livia',
    vazio: [
      'Profa. Lívia: "O palco está vazio. Nada por aqui."',
      'Profa. Lívia: "Entrada errada, cena errada! Corta!"',
      'Profa. Lívia: "Nem atrás da cortina. Volta para o primeiro ato."'
    ]
  },
  ciencias: {
    nome: 'Laboratório de ciências', personagem: 'Priscila', img: 'img-ciencias', foto: 'img-p-priscila',
    vazio: [
      'Priscila: "Conferi cada gaveta. Nenhum envelope."',
      'Priscila: "Nem no microscópio. Hipótese descartada."',
      'Priscila: "Cuidado com os frascos! E não, não é aqui."'
    ]
  },
  portaria: {
    nome: 'Portaria', personagem: 'Josué', img: 'img-portaria', foto: 'img-p-josue',
    vazio: [
      'Josué: "Ninguém deixou nada na portaria."',
      'Josué: "O portão continua trancado e o envelope não está aqui."',
      'Josué, de olho no pátio: "Volta, volta! Está perdendo tempo."'
    ]
  },
  gremio: {
    nome: 'Sala do grêmio', personagem: 'Carol', img: 'img-gremio', foto: 'img-p-carol',
    vazio: [
      'Carol: "O mural está vazio. Não é aqui."',
      'Carol: "Vou abrir uma votação: quem acha que é aqui? Ninguém."',
      'Carol: "Só tem cartaz da festa junina. Tenta outro lugar!"'
    ]
  },
  maquinas: {
    nome: 'Casa de máquinas', personagem: 'Prof. Henrique', img: 'img-maquinas', foto: 'img-p-henrique',
    vazio: ['A porta está trancada e não há nada aqui.']
  }
};

// local = onde a turma está; destino = para onde a resposta certa leva.
// chegada = narração lida antes de abrir a prova; fala = a pista do personagem (vai para o caderno).
const rodadas = [
  { n: 1, local: 'sala12', perguntas: [1], destino: 'quadra',
    chegada: [
      'A Coordenadora Vera atravessa a sala devagar, sem pressa nenhuma, e deixa o envelope sobre a mesa do professor. O lacre de cera vermelha ainda está morno.',
      'Ela olha para a turma por cima dos óculos, do jeito de quem aplica uma prova.'
    ],
    fala: '"Achei na mesa dele. Vocês sabem como funciona. Sejam rápidos." Ela não parece assustada.',
    envelope: 'Boa noite, turma. O professor de vocês está esperando. Comecemos pelo que liga uma máquina à outra: um cabo que cruza o caminho.' },
  { n: 2, local: 'quadra', perguntas: [2], destino: 'cantina',
    chegada: [
      'A turma atravessa o pátio debaixo de chuva. A quadra está escura, iluminada só pelos relâmpagos refletidos no piso encerado.',
      'Seu Raimundo está parado embaixo da trave, lanterna na mão, o molho de chaves tilintando na cintura. Ele aponta a rede do gol por um bom tempo antes de falar.'
    ],
    fala: '"O envelope estava preso na rede do gol. Eu tranquei a quadra às seis. Quem entrou aqui tinha chave."',
    envelope: 'Cores importam. Um fio fora do lugar e nada conversa. Vocês lembram a ordem?' },
  { n: 3, local: 'cantina', perguntas: [3], destino: 'informatica',
    chegada: [
      'O cheiro de café chega antes da luz das velas. Dona Zezé arrumou a cantina como se fosse uma noite normal: bandejas de pão de queijo, garrafas térmicas, tudo no lugar.',
      'Ela levanta uma bandeja e faz cara de quem já esperava encontrar o envelope ali.'
    ],
    fala: '"Estava debaixo da bandeja de pão de queijo. Engraçado, ontem a coordenadora me pediu vela vermelha emprestada."',
    envelope: 'Duas máquinas conversando sozinhas, sem ninguém para levar o recado para fora. Por que funciona?' },
  { n: 4, local: 'informatica', perguntas: [4, 5], destino: 'secretaria',
    chegada: [
      'No laboratório de informática, só um monitor está aceso, com um cursor verde piscando. Igor, o técnico, está debruçado sobre o teclado, suando frio.',
      'Ele gira a cadeira devagar e entrega o envelope, que estava grudado embaixo do mouse. Este é mais grosso que os outros.'
    ],
    fala: '"As câmeras foram desligadas às 18h55, antes de a luz cair. Foi alguém com senha do sistema."',
    envelope: 'Envelope duplo. Um ping que mente e uma caixa que sabe exatamente para onde vai cada quadro.' },
  { n: 5, local: 'secretaria', perguntas: [6], destino: 'biblioteca',
    chegada: [
      'A secretaria cheira a papel velho. Neide tenta o telefone fixo pela décima vez, e pela décima vez ele está mudo.',
      'Ela abre o livro de ponto e o envelope escorrega lá de dentro, como se estivesse esperando a turma.'
    ],
    fala: '"Estava no meio do livro de ponto. Olha, o Seu Raimundo tem cópia de todas as chaves deste colégio, viu?"',
    envelope: 'Quero todos os detalhes, não só o básico. Qual comando entrega tudo?' },
  { n: 6, local: 'biblioteca', perguntas: [7], destino: 'professores',
    chegada: [
      'A biblioteca é o único lugar quentinho do colégio: um abajur amarelo, uma chaleira chiando e estantes que vão até o teto.',
      'Dona Marta tira um dicionário enorme da prateleira, abre na letra P e sorri como uma avó.'
    ],
    fala: '"Estava dentro do dicionário, na letra P. De prova, imagino. Querem um chá? Não? Que pena."',
    envelope: 'Dois alunos com o mesmo nome na chamada geram confusão. Duas máquinas com o mesmo endereço, também.' },
  { n: 7, local: 'professores', perguntas: [8], destino: 'enfermaria',
    chegada: [
      'Na sala dos professores, as canecas ainda estão mornas sobre a mesa. O Prof. Bruno anda de um lado para o outro, apito no pescoço, sem saber o que fazer com as mãos.',
      'Ele puxa o envelope do escaninho do Henrique com cuidado, como se pudesse explodir.'
    ],
    fala: '"Estava no escaninho do Henrique. Ele me disse semana passada que alguém da coordenação vivia perguntando quando seria a prova de vocês."',
    envelope: 'Uma agenda telefônica com os números errados. A rede funciona, mas ninguém encontra ninguém pelo nome.' },
  { n: 8, local: 'enfermaria', perguntas: [9, 10], destino: 'diretoria',
    chegada: [
      'A enfermaria tem cheiro de álcool e uma maca forrada de papel. A Enfermeira Rosa já separou curativos, como se esperasse feridos.',
      'Dentro da caixa de primeiros socorros, entre gazes e esparadrapos, está mais um envelope duplo.'
    ],
    fala: '"Estava na caixa de primeiros socorros. E sumiu um frasco de calmante daqui hoje à tarde."',
    envelope: 'Envelope duplo. Um fio destrançado que engana o testador, e um endereço que começa com 169.' },
  { n: 9, local: 'diretoria', perguntas: [11], destino: 'auditorio',
    chegada: [
      'A porta da diretoria está entreaberta. A Diretora Celina está sentada atrás da mesa de madeira escura, de braços cruzados, iluminada de baixo pela luminária.',
      'Ela abre a gaveta trancada com uma chave pequenininha e joga o envelope na mesa, como quem entrega uma advertência.'
    ],
    fala: '"Ninguém sai daqui contando nada para jornal. Entendido? O envelope estava na minha gaveta trancada."',
    envelope: 'Cartas dentro de envelopes dentro de malotes. O que muda em cada parada, e o que nunca muda?' },
  { n: 10, local: 'auditorio', perguntas: [12], destino: 'ciencias',
    chegada: [
      'O auditório está escuro, com as cortinas de veludo fechadas. Só um holofote ilumina o palco, onde a Profa. Lívia ensaiava uma peça sozinha.',
      'Ela folheia o roteiro, e o envelope cai das páginas bem no meio do segundo ato.'
    ],
    fala: '"Estava no meio do roteiro da peça. A coordenadora veio aqui às seis e meia perguntar se o auditório ficaria vazio hoje."',
    envelope: 'Um centímetro e dois milímetros. A diferença entre um cabo firme e um cabo que solta na primeira puxada.' },
  { n: 11, local: 'ciencias', perguntas: [13], destino: 'portaria',
    chegada: [
      'No laboratório de ciências, frascos coloridos brilham à luz das lanternas. Priscila, a técnica, está pálida, segurando o microscópio como se fosse uma prova de crime.',
      'O envelope estava enrolado dentro do tubo da lente.'
    ],
    fala: '"Estava dentro do microscópio. Quem fez isso sabia exatamente onde eu guardo as coisas."',
    envelope: 'Cada roteador do caminho conta a vida de um pacote. Usem isso para seguir a trilha.' },
  { n: 12, local: 'portaria', perguntas: [14, 15], destino: 'gremio',
    chegada: [
      'Da portaria se vê o portão de ferro fechado com corrente. A chuva bate forte no vidro da guarita.',
      'Josué, o vigia, entrega o envelope duplo com a mão tremendo. Estava preso na corrente do portão, do lado de dentro.'
    ],
    fala: '"O portão travou sozinho às 19h. Ninguém entrou nem saiu. Quem fez isso ainda está aqui dentro."',
    envelope: 'Envelope duplo. Uma entrega rápida que não volta atrás, e uma caixinha no telhado que também é gente na rede.' },
  { n: 13, local: 'gremio', perguntas: [16], destino: 'sala12',
    chegada: [
      'A sala do grêmio é cheia de cartazes de festa junina e de eleição. Carol, a presidente, arranca o envelope do mural.',
      'Ela lê em voz alta antes de todo mundo e fica séria de repente.'
    ],
    fala: '"Estava no mural, preso com um alfinete vermelho. Gente, o recado manda voltar para a sala 12."',
    envelope: 'Metade da prova. Agora vamos falar de segurança: o que acontece quando qualquer um pode abrir as suas pastas?' },
  { n: 14, local: 'sala12', perguntas: [17], destino: 'quadra', ocultarDestino: true, vazia: true,
    chegada: [
      'A turma volta correndo pelo corredor até a sala 12, onde tudo começou. A porta está aberta e as luzes de emergência piscam.',
      'A Coordenadora Vera não está mais aqui.'
    ],
    fala: 'A sala está escura. Na cadeira da coordenadora estão o crachá dela e um envelope novo.',
    envelope: 'Mudança nas regras. Às vezes, quem bloqueia a conversa está protegendo vocês.' },
  { n: 15, local: 'quadra', perguntas: [18], destino: 'biblioteca',
    chegada: [
      'De volta à quadra. A chuva diminuiu, mas o vento faz a rede do gol balançar como se alguém tivesse acabado de passar por ali.',
      'Seu Raimundo está sentado na arquibancada, olhando para o nada. Ele tira do bolso um envelope que achou no banco de reservas.'
    ],
    fala: '"Vi a coordenadora passar sozinha por aqui durante o intervalo. Sem pressa nenhuma. Sequestrada não parecia."',
    envelope: 'Alguém responde antes do servidor verdadeiro e oferece o caminho errado. Vocês aceitariam?' },
  { n: 16, local: 'biblioteca', perguntas: [19], destino: 'informatica',
    chegada: [
      'A chaleira da biblioteca esfriou. Dona Marta está no balcão, folheando o livro de empréstimos com os óculos na ponta do nariz.',
      'Ela vira o livro para a turma e aponta uma ficha. O envelope estava preso nela com um clipe.'
    ],
    fala: '"Alguém pegou emprestado ontem a pasta de recortes de jornal sobre o caso Vila Nova. A ficha está assinada só com um V, em tinta vermelha."',
    envelope: 'Vocês digitam o endereço certo e chegam ao lugar errado. Quem trocou as placas da estrada?' },
  { n: 17, local: 'informatica', perguntas: [20, 21], destino: 'cantina',
    chegada: [
      'Igor não saiu do laboratório. Agora há três monitores acesos, cheios de linhas de registro do sistema.',
      'Ele levanta os olhos da tela com cara de quem achou alguma coisa e não gostou. O envelope duplo estava dentro do gabinete do servidor.'
    ],
    fala: '"Recuperei o registro do sistema. As câmeras foram desligadas com o login da coordenação. Mas a senha fica num post-it que metade do colégio já viu."',
    envelope: 'Envelope duplo. Uma identidade copiada, e um impostor que diz ser o portão de saída.' },
  { n: 18, local: 'cantina', perguntas: [22], destino: 'diretoria',
    chegada: [
      'A cantina está mais escura do que antes: as velas estão no fim. Dona Zezé embrulha num pano o pão de queijo que sobrou.',
      'O envelope estava dentro da garrafa térmica vazia.'
    ],
    fala: '"O Seu Raimundo passou correndo por aqui agorinha, com o molho de chaves todo na mão."',
    envelope: 'Uma tomada esquecida num corredor é uma porta destrancada. Quem pode entrar por ela?' },
  { n: 19, local: 'diretoria', perguntas: [23], destino: 'enfermaria',
    chegada: [
      'Desta vez a Diretora Celina não está de braços cruzados. Ela está de pé, com a pasta de funcionários aberta sobre a mesa.',
      'Pela primeira vez na noite, ela fala baixo.'
    ],
    fala: '"A Vera veio transferida da Vila Nova há dois meses, logo depois dos ataques. Eu achei que era coincidência."',
    envelope: 'Antigamente, todo mundo ouvia a conversa de todo mundo. O que mudou?' },
  { n: 20, local: 'enfermaria', perguntas: [24, 25], destino: 'secretaria',
    chegada: [
      'Na enfermaria, a Enfermeira Rosa lava as mãos na pia pela terceira vez. Tem alguma coisa vermelha escorrendo pelo ralo.',
      'Calma: é só cera derretida. O envelope duplo está sobre a maca.'
    ],
    fala: '"Achei cera vermelha derretida na pia. E um cheiro de lavanda, igual ao perfume da Dona Marta."',
    envelope: 'Envelope duplo. Um sequestrador de arquivos que viaja pela rede, e servidores que fingem estar dormindo.' },
  { n: 21, local: 'secretaria', perguntas: [26], destino: 'auditorio',
    chegada: [
      'Neide espalhou na mesa todos os malotes do dia. Ela é a única pessoa do colégio que sabe de onde veio cada papel.',
      'O envelope estava no último malote da pilha.'
    ],
    fala: '"O primeiro envelope? Chegou no malote interno às cinco da tarde, enviado pela coordenação. Duas horas antes de a luz cair."',
    envelope: 'Três envelopes para o fim. Alguém espiou por cima do seu ombro. O que vocês perderam?' },
  { n: 22, local: 'auditorio', perguntas: [27], destino: 'portaria',
    chegada: [
      'O palco está iluminado de novo. A Profa. Lívia sai do camarim segurando um casaco cinza, dobrado com cuidado.',
      'No bolso do casaco, o envelope.'
    ],
    fala: '"O casaco da coordenadora está no camarim, sequinho. Quem foi levado na chuva não fica com o casaco seco."',
    envelope: 'Vinte reais viraram dois centavos no meio do caminho. Que pilar caiu?' },
  { n: 23, local: 'portaria', perguntas: [28, 29], destino: 'maquinas',
    chegada: [
      'Josué está diante do quadro de chaves da portaria, contando os ganchos. Um deles está vazio, com uma etiqueta: CASA DE MÁQUINAS.',
      'No lugar da chave, alguém pendurou o último envelope duplo.'
    ],
    fala: '"A chave da casa de máquinas sumiu do quadro. Só eu, o Seu Raimundo e a coordenação temos acesso a ele."',
    envelope: 'Envelope duplo. O cofre mais caro do mundo, aberto por uma senha fraca. E um jogo grátis que não é grátis.' },
  { n: 24, local: 'maquinas', perguntas: [30], destino: 'maquinas', cadeado: true, vazia: true,
    chegada: [
      'A casa de máquinas fica no fundo do colégio, depois do estacionamento. O gerador faz tanto barulho que ninguém escuta a própria voz.',
      'Mas, quando o motor dá uma pausa, vem lá de dentro um som abafado: alguém respirando devagar.'
    ],
    fala: 'A porta de metal está trancada com um cadeado de código. No cadeado está presa a última prova.',
    envelope: 'Última questão. Na hora do lanche, o Pix não funciona. Acertem e o cadeado abre.' }
];

// Textos que aparecem no telão entre as rodadas.
const textos = {
  abertura: {
    titulo: 'A Trilha do Corretor', img: 'img-abertura',
    texto: [
      'JORNAL DA REGIÃO, setembro: "Professor desaparece em escola de Vila Nova. Alunos encontram docente após seguir pistas deixadas em envelopes lacrados com cera vermelha."',
      'Duas semanas depois, outra manchete: "Segundo professor some na mesma escola. Desta vez, os alunos não chegaram a tempo."',
      'A imprensa deu um apelido ao responsável: o Corretor. Ele apaga as luzes, leva um professor e deixa provas pelo caminho. Cada resposta certa leva ao próximo envelope. Cada erro custa tempo. E o tempo é do professor.'
    ]
  },
  abertura2: {
    titulo: 'Hoje, 19h', img: 'img-sala12',
    texto: [
      'Instituto Monte Sereno. Chove como não chovia há anos. O Prof. Henrique escreve no quadro "Revisão para a avaliação unificada" quando um trovão sacode as janelas. A luz cai.',
      'Quando o gerador ronca e as luzes de emergência acendem, a mesa do professor está vazia. A cadeira ainda está girando. Na porta, a Coordenadora Vera segura um envelope lacrado com cera vermelha.',
      'Vocês sabem o que isso significa. O relógio já está correndo.'
    ]
  },
  gancho: {
    titulo: 'Agora são dois', img: 'img-gancho',
    texto: [
      'A turma lê o fim do envelope em silêncio.',
      '"Agora são dois. Vocês têm quinze minutos para descansar. Eu não."',
      'Um estalo vem do quadro de força. As luzes de emergência piscam uma, duas, três vezes...',
      '...e o colégio inteiro mergulha no escuro.'
    ]
  },
  intervalo: {
    titulo: 'Intervalo', img: 'img-gancho',
    texto: [
      'Voltamos às 20h30.',
      'Guardem o celular com a tela do jogo aberta. A trilha continua de onde parou.',
      'Enquanto isso, pensem: quem, neste colégio, sabia exatamente onde cada envelope deveria estar?'
    ]
  },
  volta: {
    titulo: 'Segunda chamada', img: 'img-sala12',
    texto: [
      'As luzes de emergência voltam a acender, uma de cada vez, pelo corredor.',
      'O último envelope apontava para a Quadra. Mas agora a turma procura duas pessoas: o Prof. Henrique e a Coordenadora Vera.',
      'No quadro da sala 12, alguém escreveu em giz vermelho: SEGUNDA CHAMADA.'
    ]
  },
  palpite: {
    titulo: 'Quem é o Corretor?', img: 'img-maquinas',
    texto: [
      'Antes de abrir a casa de máquinas, a turma para no corredor. Alguém deixou cada envelope no lugar certo, na hora certa, com acesso a todas as salas. Cada um dá o seu palpite no celular. Releiam o caderno de pistas: palpite certo vale 50 pontos.'
    ]
  },
  revelacao: {
    titulo: 'O Corretor', img: 'img-revelacao',
    texto: [
      'O cadeado cede com um estalo seco. Lá dentro, sentado numa cadeira entre canos e motores, o Prof. Henrique dorme, sob efeito de calmante. Está vivo.',
      'Atrás da turma, passos. Na porta da casa de máquinas está a Coordenadora Vera. O casaco seco. O cabelo arrumado. Uma caneta-tinteiro vermelha na mão.',
      '"Parabéns. Trinta questões numa noite. Vocês nunca estudaram tanto na vida."',
      '"Na Vila Nova também foi assim. Ninguém estuda quando não tem nada em jogo. Eu só coloquei alguma coisa em jogo."',
      'Ela tampa a caneta devagar. "Nota final? Vamos ver."'
    ]
  },
  finalBom: {
    titulo: 'Caso encerrado', img: 'img-final-bom',
    texto: [
      'O Prof. Henrique abre os olhos e reconhece a turma. "Vocês... vieram."',
      'Josué e Seu Raimundo seguram a coordenadora antes que ela chegue à porta. Ela não resiste. Só sorri.',
      'Às 21h40 o portão destrava sozinho, e as luzes das viaturas já iluminam a rua molhada.',
      'Na manhã seguinte, a manchete do jornal da região: "Alunos do noturno salvam professor e desmascaram o Corretor."'
    ]
  },
  finalRuim: {
    titulo: 'Tarde demais', img: 'img-final-ruim',
    texto: [
      'A turma chega à casa de máquinas tarde demais. A cadeira está vazia.',
      'Sobre o assento, uma última prova corrigida em vermelho. Nota: zero. Embaixo, um bilhete: "Na próxima escola, estudem mais."',
      'A Coordenadora Vera nunca mais foi vista. Dizem que uma escola da cidade vizinha acabou de contratar uma coordenadora nova.'
    ]
  },
  encerramento: {
    titulo: 'Ranking final', img: null,
    texto: ['As 30 questões do Corretor eram a revisão da Avaliação Unificada de Redes e Segurança da Informação. Abram o relatório no celular: ele mostra o que revisar até o dia 30.']
  }
};

const suspeitos = [
  { id: 'vera',     nome: 'Coordenadora Vera' },
  { id: 'raimundo', nome: 'Seu Raimundo' },
  { id: 'celina',   nome: 'Diretora Celina' },
  { id: 'marta',    nome: 'Dona Marta' },
  { id: 'igor',     nome: 'Igor' },
  { id: 'bruno',    nome: 'Prof. Bruno' }
];
const culpado = 'vera';

module.exports = { ambientes, rodadas, textos, suspeitos, culpado };
