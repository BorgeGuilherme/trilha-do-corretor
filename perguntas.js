// As 30 questões da "Revisão para Avaliação Unificada" (FAMATEC).
// correta = índice da alternativa certa (0 = A, 1 = B, 2 = C, 3 = D).
// O jogo embaralha as alternativas no celular de cada aluno.
// Este arquivo NUNCA é enviado ao navegador.

module.exports = [
  {
    id: 1,
    texto: 'Na primeira prática do laboratório, dois computadores foram interligados diretamente, placa a placa, sem o uso de um Switch. Para garantir a comunicação em interfaces tradicionais sem conflito de sinais, utilizou-se um cabo Crossover, cuja característica de montagem é:',
    alternativas: [
      'Utilizar o padrão T568A nas duas pontas para dobrar a velocidade de transferência.',
      'Conectar o padrão T568A em uma extremidade e o padrão T568B na outra, invertendo os pares de transmissão (TX, pinos 1 e 2) com os de recepção (RX, pinos 3 e 6).',
      'Agrupar os fios por cores sólidas lado a lado, anulando a necessidade do trançamento interno.',
      'Deixar os pinos 4, 5, 7 e 8 desconectados do terminal RJ-45 para evitar interferência eletromagnética.'
    ],
    correta: 1
  },
  {
    id: 2,
    texto: 'Ao conectar os computadores na infraestrutura da FAMATEC por meio de um Switch, o foco passou a ser o Cabo Direto (Straight-through) seguindo a norma adotada pela instituição (T568A). Olhando o conector RJ-45 com a trava plástica para baixo e os contatos metálicos para cima, a sequência correta dos 4 primeiros pinos (da esquerda para a direita) no padrão T568A é:',
    alternativas: [
      'Branco-Laranja, Laranja, Branco-Verde, Azul.',
      'Branco-Verde, Verde, Branco-Laranja, Laranja.',
      'Branco-Verde, Verde, Branco-Laranja, Azul.',
      'Branco-Azul, Azul, Branco-Verde, Verde.'
    ],
    correta: 2,
    semEmbaralhar: false
  },
  {
    id: 3,
    texto: 'Na rede isolada montada com os IPs fixos 192.168.10.1 e 192.168.10.2 e máscara 255.255.255.0, os campos de Gateway Padrão e Servidor DNS foram deixados em branco. Apesar disso, o acesso às pastas compartilhadas e o teste de ping funcionaram perfeitamente porque:',
    alternativas: [
      'O protocolo ICMP traduz nomes de domínio e roteia pacotes para a internet sem precisar de Gateway.',
      'As máquinas pertenciam à mesma vizinhança lógica (192.168.10.x), não havendo necessidade de sair para uma rede externa (função do Gateway) nem de traduzir nomes de sites da web em números IP (função do DNS).',
      'O cabo Crossover cria um servidor DNS e um Gateway automático dentro da placa de rede do Windows.',
      'A máscara 255.255.255.0 bloqueia o uso de internet, funcionando apenas para compartilhamento de pastas locais.'
    ],
    correta: 1
  },
  {
    id: 4,
    texto: 'Durante a etapa de testes na bancada, um grupo executou o comando ping 192.168.10.2 a partir da máquina 192.168.10.1. O Prompt de Comando exibiu: "Resposta de 192.168.10.1: Host de destino inacessível" e, no resumo estatístico, apontou "Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de perda)", sem exibir o tempo em milissegundos (ms). Qual é o diagnóstico técnico correto?',
    alternativas: [
      'A conexão foi um sucesso absoluto, pois 0% de perda comprova que o cabo transmitiu todos os dados.',
      'O pacote chegou à máquina 2, mas o navegador de internet estava fechado no momento do teste.',
      'Ocorreu um falso positivo: a própria placa de rede local (192.168.10.1) gerou as respostas de erro informando que não conseguiu entregar os pacotes devido a uma falha física no cabo ou falta de rota até o destino.',
      'O endereço MAC da placa de rede foi apagado pelo comando ping.'
    ],
    correta: 2
  },
  {
    id: 5,
    texto: 'Ao migrar do cenário de cabo Crossover para a topologia com um Switch interligando as estações, qual é o papel exato desse equipamento na rede local (LAN)?',
    alternativas: [
      'Atuar na Camada 2 (Enlace), lendo o endereço físico (MAC) de cada placa de rede para encaminhar os quadros diretamente à porta de destino, sem gerar tráfego desnecessário nas demais portas.',
      'Atuar na Camada 3 (Rede), funcionando como uma agência dos correios que calcula rotas para a internet mundial (WAN).',
      'Traduzir endereços como www.famatec.com.br em endereços IP numéricos da faixa 192.168.7.xxx.',
      'Alterar o endereço MAC de fábrica dos computadores sempre que um cabo direto é conectado.'
    ],
    correta: 0
  },
  {
    id: 6,
    texto: 'Na conexão com a rede da FAMATEC (faixa 192.168.7.xxx), utilizou-se uma máquina com IP dinâmico (automático) e outra com IP fixo (manual). Para descobrir todos os detalhes recebidos pela máquina automática — incluindo o endereço físico (MAC), o servidor DHCP que emprestou o IP, o Gateway e os servidores DNS —, o comando exato a ser digitado no terminal é:',
    alternativas: [
      'ping /all',
      'ipconfig',
      'ipconfig /all',
      'tracert 192.168.7.1'
    ],
    correta: 2
  },
  {
    id: 7,
    texto: 'Durante os seminários sobre falhas de IP fixo e dinâmico, discutiu-se o problema de misturar as duas configurações na mesma rede (como na rede 192.168.7.xxx da FAMATEC). Se um técnico configurar manualmente o IP fixo 192.168.7.50 em um computador, mas o servidor DHCP da instituição já tiver emprestado esse exato endereço para o notebook de outro aluno, ocorrerá:',
    alternativas: [
      'O erro de Split Pair (par dividido), queimando a porta do Switch.',
      'Um Conflito de IP, fazendo com que uma ou ambas as máquinas percam a comunicação na rede por possuírem a mesma identificação lógica na mesma sub-rede.',
      'O aumento automático da velocidade de internet para os dois computadores.',
      'A conversão automática da máscara de sub-rede para 0.0.0.0.'
    ],
    correta: 1
  },
  {
    id: 8,
    texto: 'Em uma das apresentações sobre DNS, simulou-se a seguinte falha na rede da FAMATEC: o computador possui o IP 192.168.7.25, máscara 255.255.255.0 e Gateway 192.168.7.1 corretos, mas o campo de Servidor DNS foi configurado com um endereço inexistente. Qual sintoma será observado pelo usuário e como diagnosticá-lo?',
    alternativas: [
      'O computador não conseguirá dar ping em nenhuma máquina da sala, nem mesmo pelo endereço IP.',
      'O LED da placa de rede apagará imediatamente, indicando cabo desconectado.',
      'O teste de ping para um IP externo (como 8.8.8.8 ou 1.1.1.1) terá sucesso, mas o navegador não conseguirá abrir sites digitando seus nomes (como google.com), pois falta o serviço que traduz nomes de domínio em endereços IP.',
      'O computador perderá o acesso às suas próprias pastas locais no Windows Explorer.'
    ],
    correta: 2
  },
  {
    id: 9,
    texto: 'Nos seminários sobre cabeamento estruturado (cabos UTP e conectores RJ-45), foi abordado o erro conhecido como Split Pair (par dividido) e o destrançamento excessivo dos fios fora do conector (além da medida padrão de 1,2 cm a 1,4 cm). Qual é a falha provocada por esse erro e qual a limitação do testador básico de continuidade (aquele de LEDs de 1 a 8) diante dele?',
    alternativas: [
      'O cabo fica vulnerável a ruídos eletromagnéticos e diafonia (crosstalk), causando perda de pacotes ou queda de velocidade; porém, se os fios estiverem na mesma posição nas duas pontas, o testador básico acenderá os LEDs normalmente (falso positivo), pois ele testa apenas a continuidade elétrica fio a fio.',
      'O testador básico emite um alarme sonoro indicando que a capa azul não entrou sob a trava do conector.',
      'O Split Pair impede a passagem de corrente contínua, fazendo com que nenhum LED acenda no testador.',
      'O erro afeta apenas redes Wi-Fi, não causando impacto em conexões via cabo UTP.'
    ],
    correta: 0
  },
  {
    id: 10,
    texto: 'Ao diagnosticar uma máquina que foi configurada para obter endereço IP automaticamente (via DHCP) na rede da FAMATEC, mas que não consegue navegar na internet nem acessar a rede 192.168.7.xxx, o aluno executa o ipconfig e nota que o computador assumiu o endereço IP 169.254.45.12 com máscara 255.255.0.0. Esse diagnóstico comprova que:',
    alternativas: [
      'O computador invadiu um servidor internacional de alta velocidade.',
      'A máquina não conseguiu se comunicar com o servidor DHCP da rede (por falha no cabo, porta do Switch travada ou serviço DHCP inoperante) e o próprio Windows atribuiu um endereço provisório de emergência (APIPA), sem saída para a internet.',
      'O servidor DNS alterou a faixa de IPs da FAMATEC para aumentar a segurança.',
      'O cabo utilizado é do tipo Crossover, que sempre converte IPs da classe C para 169.254.x.x.'
    ],
    correta: 1
  },
  {
    id: 11,
    texto: 'Nos vídeos sobre a "Logística de Dados", ao explicar como a informação atravessa a internet, utiliza-se a metáfora da "troca de envelopes" (encapsulamento). Quando um pacote de dados sai da FAMATEC e passa por múltiplos roteadores intermediários até chegar a um servidor global, o que acontece com os endereços contidos nos cabeçalhos?',
    alternativas: [
      'O endereço IP e o endereço MAC são reescritos e alterados em cada roteador do caminho.',
      'O endereço IP de destino original (a "carta interna") permanece intacto do começo ao fim, enquanto o endereço MAC (o "malote/envelope externo") é descartado e refeito a cada roteador para apontar para a próxima parada física.',
      'O endereço MAC permanece fixo do começo ao fim da viagem, enquanto o endereço IP muda a cada salto de rede.',
      'Tanto o IP quanto o MAC são removidos na primeira etapa, viajando apenas os dados brutos sem qualquer identificação até o destino.'
    ],
    correta: 1
  },
  {
    id: 12,
    texto: 'No vídeo sobre Cabeamento Estruturado (NBR 14565) e nas aulas práticas de bancada, destaca-se a regra técnica do "Macete dos 1,2 cm". Qual é a função essencial de aparar os fios condutores em exatos 1,2 cm a 1,4 cm de sobra a partir do corte da capa externa de PVC antes de inseri-los no plugue RJ-45?',
    alternativas: [
      'Garantir que os pares fiquem destrançados em mais de 25 mm dentro do conector para melhorar a recepção Wi-Fi.',
      'Permitir que a capa externa de PVC penetre na cavidade de retenção mecânica (strain relief), garantindo que a trava de plástico esmague a capa de proteção e não os finos condutores de cobre.',
      'Dobrar a velocidade de transmissão do cabo de 100 Mbps para 10 Gbps sem necessidade de aterramento.',
      'Isolar eletricamente os pinos 4 e 5 para evitar que o cabo funcione em portas PoE.'
    ],
    correta: 1
  },
  {
    id: 13,
    texto: 'Ao investigar a rota percorrida por um pacote de dados do laboratório até um servidor distante na internet, utiliza-se o comando tracert google.com. Essa ferramenta revela cada roteador intermediário (salto ou hop) graças à manipulação gradual de qual campo do cabeçalho do protocolo IP?',
    alternativas: [
      'Endereço MAC de origem.',
      'Campo TTL (Time-To-Live / Tempo de Vida), que é incrementado a cada disparo para forçar os roteadores do caminho a devolverem uma resposta de tempo esgotado.',
      'Campo de senha do servidor DNS.',
      'Campo de máscara de sub-rede estendida.'
    ],
    correta: 1
  },
  {
    id: 14,
    texto: 'Ao analisar a camada de transporte nos modelos de rede, compara-se o protocolo TCP (um envio com aviso de recebimento) ao protocolo UDP (um caminhão de entregas em alta velocidade). Em chamadas de vídeo ao vivo ou transmissões de jogos, quando ocorrem pequenas travadas na imagem sem que a transmissão pare, isso acontece porque essas aplicações utilizam o UDP, que se caracteriza por:',
    alternativas: [
      'Exigir confirmação de recebimento para cada pacote antes de enviar o próximo, garantindo zero perda de dados.',
      'Ser um protocolo não orientado à conexão e sem checagem/retransmissão de pacotes perdidos, priorizando a velocidade e a menor latência em tempo real.',
      'Criptografar automaticamente todas as mensagens com chaves de 256 bits antes do envio.',
      'Desativar o uso de endereços IP durante a transmissão de voz e vídeo.'
    ],
    correta: 1
  },
  {
    id: 15,
    texto: 'Durante as demonstrações com equipamentos reais na bancada, apresentou-se um Gateway IoT (como o APsystems ECU-R) utilizado no monitoramento de energia solar. Do ponto de vista da arquitetura de rede local (LAN), como esse equipamento de automação é reconhecido pela infraestrutura?',
    alternativas: [
      'Como um cabo passivo sem capacidade de processamento, incapaz de receber configurações lógicas.',
      'Como um host (dispositivo final) completo, possuindo placa de rede com endereço MAC físico e recebendo IP, máscara e gateway via DHCP.',
      'Como um substituto do servidor DNS raiz da internet.',
      'Como um equipamento exclusivo de Camada 7 que opera sem necessidade de meio físico ou sem fio.'
    ],
    correta: 1
  },
  {
    id: 16,
    texto: 'Durante a primeira aula prática, os alunos acessaram pastas compartilhadas de um computador no outro utilizando a rede local (192.168.10.1 e 192.168.10.2). Sob a ótica da Segurança da Informação, se uma pasta é compartilhada na rede com permissão de "Controle Total" ou "Leitura e Gravação" para o grupo "Todos" (Everyone) sem exigência de senha, quais pilares da segurança estão diretamente comprometidos?',
    alternativas: [
      'Apenas a velocidade de rotação do disco rígido.',
      'A Confidencialidade (qualquer usuário conectado ao Switch pode ler arquivos restritos) e a Integridade/Disponibilidade (qualquer pessoa ou vírus na rede pode alterar ou apagar os arquivos remotamente).',
      'O padrão de cores T568A do cabeamento estruturado.',
      'A capacidade do servidor DHCP de renovar endereços IP na rede.'
    ],
    correta: 1
  },
  {
    id: 17,
    texto: 'Dois computadores estão com o cabo perfeitamente crimpado, os IPs configurados na mesma faixa (192.168.10.1 e 192.168.10.2), mas o comando ping resulta em "Esgotado o tempo limite do pedido" e o acesso às pastas é bloqueado. Ao desativar temporariamente o Windows Defender Firewall (ou alterar o perfil da rede de "Público" para "Privado"), a comunicação passa a funcionar na hora. Isso ocorre porque o Firewall:',
    alternativas: [
      'É um antivírus que apaga os cabos virtuais da placa de rede.',
      'Atua como uma barreira de segurança que filtra o tráfego de rede e, por padrão em redes classificadas como "Públicas" (não confiáveis), bloqueia solicitações de eco ICMP (ping) e compartilhamento de arquivos para impedir que invasores na mesma rede descubram e ataquem a máquina.',
      'Muda automaticamente o endereço IP da máquina para outra sub-rede a cada 5 segundos.',
      'Só permite comunicação se o cabo utilizado for de fibra óptica.'
    ],
    correta: 1
  },
  {
    id: 18,
    texto: 'Nos seminários sobre o protocolo DHCP, vimos que o computador entra na rede solicitando uma configuração e aceita a resposta do servidor DHCP. Na Segurança da Informação, existe um ataque clássico em redes locais chamado Rogue DHCP (Servidor DHCP Falso/Pirata), que consiste em:',
    alternativas: [
      'Cortar o fio laranja do cabo UTP para impedir a recepção de dados.',
      'Um invasor conectar uma máquina ou roteador malicioso no Switch da rede para distribuir IPs antes do servidor oficial, entregando um Gateway Padrão falso e um DNS falso (o computador do próprio atacante) para interceptar todo o tráfego de internet dos usuários (Man-in-the-Middle).',
      'Desligar o monitor das estações de trabalho através do comando ipconfig.',
      'Criptografar a tabela de cores da norma T568B.'
    ],
    correta: 1
  },
  {
    id: 19,
    texto: 'O servidor DNS funciona como a "agenda telefônica" da internet, traduzindo nomes de sites em IPs. Se um criminoso cibernético realizar um ataque de DNS Spoofing (Envenenamento de DNS) no roteador da rede local ou alterar maliciosamente o DNS configurado na placa de rede da vítima, qual será o risco prático durante a navegação?',
    alternativas: [
      'O computador da vítima ficará sem energia elétrica imediatamente.',
      'Ao digitar o endereço correto de um banco ou sistema acadêmico no navegador, o DNS malicioso traduzirá esse nome para o endereço IP de um servidor falso idêntico controlado pelo golpista, roubando senhas e dados sem que o usuário perceba o erro na barra de endereços.',
      'O mouse e o teclado deixarão de funcionar no sistema operacional Windows.',
      'A placa de rede mudará de Gigabit Ethernet para Fast Ethernet.'
    ],
    correta: 1
  },
  {
    id: 20,
    texto: 'Ao executar o comando ipconfig /all, visualizamos tanto o Endereço IPv4 quanto o Endereço Físico (MAC). Embora o endereço MAC venha gravado de fábrica na placa de rede, administradores de segurança sabem que confiar apenas em "filtros de MAC" para liberar acesso à internet na rede 192.168.7.xxx é uma medida frágil porque:',
    alternativas: [
      'O endereço MAC desaparece toda vez que o computador é reiniciado.',
      'Através da técnica de MAC Spoofing, um usuário mal-intencionado pode descobrir o MAC de uma máquina autorizada na rede e clonar (mascarar) esse endereço via software nas propriedades do adaptador de rede do seu próprio computador, burlando o bloqueio.',
      'Todos os computadores do mesmo fabricante possuem exatamente o mesmo endereço MAC de fábrica.',
      'O Switch não consegue ler endereços MAC em cabos diretos.'
    ],
    correta: 1
  },
  {
    id: 21,
    texto: 'Durante a aula, uma máquina utilizou IP fixo (192.168.7.xxx) para se conectar à rede da FAMATEC e acessar a internet. Se um invasor conectado ao mesmo Switch decidir configurar manualmente em sua própria placa de rede o mesmo endereço IP do Gateway Padrão da rede (por exemplo, 192.168.7.1), qual pilar da Segurança da Informação daquela sala será imediatamente afetado?',
    alternativas: [
      'Disponibilidade (ataque de Negação de Serviço / DoS local), pois o conflito de IP com o roteador principal derrubará ou instabilizará a saída para a internet de todos os computadores daquela sub-rede.',
      'Autenticidade física dos conectores RJ-45.',
      'Legalidade do software de edição de texto instalado nos computadores.',
      'Nenhum pilar será afetado, pois o Switch bloqueia automaticamente qualquer IP terminado em .1.'
    ],
    correta: 0
  },
  {
    id: 22,
    texto: 'Sabendo que um computador configurado com IP fixo na faixa 192.168.7.xxx tem permissão para navegar na internet sem passar por uma tela de login por usuário (autenticação individual), qual é o principal risco de segurança física caso portas do Switch ou tomadas de rede RJ-45 fiquem ativas e desprotegidas em locais de livre circulação?',
    alternativas: [
      'Qualquer pessoa externa pode plugar um notebook próprio com um cabo direto, descobrir a faixa de IP (via DHCP ou analisando o tráfego), configurar um IP da rede 192.168.7.xxx e ter acesso direto aos recursos internos e à internet da instituição sem ser identificada.',
      'A tomada RJ-45 consumirá energia elétrica mesmo sem nenhum cabo conectado.',
      'O padrão T568A da parede se converterá sozinho em T568B.',
      'Os cabos UTP perderão o trançamento interno por exposição ao ar.'
    ],
    correta: 0
  },
  {
    id: 23,
    texto: 'Em redes mais antigas que utilizavam Hubs (concentradores), todos os pacotes enviados por uma máquina eram copiados para todas as portas, permitindo que qualquer pessoa capturasse senhas na rede com programas Sniffers (farejadores de pacotes). Ao utilizarmos um Switch em nossa aula prática, a segurança e a privacidade do tráfego local aumentaram porque:',
    alternativas: [
      'O Switch criptografa todas as pastas do Windows com senha de 128 bits.',
      'O Switch isola os domínios de colisão e entrega os quadros de dados exclusivamente para a porta onde está o endereço MAC de destino, impedindo que outras máquinas conectadas ao mesmo Switch recebam conversas alheias por padrão.',
      'O Switch bloqueia qualquer pacote que contenha arquivos de texto ou imagens.',
      'O Switch funciona apenas com cabos Crossover blindados.'
    ],
    correta: 1
  },
  {
    id: 24,
    texto: 'Imagine que uma das máquinas conectadas na prática com pastas compartilhadas abertas na rede 192.168.7.xxx seja infectada por um Ransomware (sequestrador de dados) após um usuário baixar um arquivo malicioso da internet. Qual será o comportamento dessa ameaça em relação à rede local?',
    alternativas: [
      'O vírus ficará restrito apenas ao navegador de internet, sem afetar arquivos do computador.',
      'Além de criptografar os arquivos da máquina infectada, o Ransomware procurará pastas compartilhadas abertas na rede local (192.168.7.xxx) e vulnerabilidades em máquinas vizinhas para criptografar os arquivos de outros computadores através do Switch.',
      'O vírus queimará fisicamente os contatos banhados a ouro do conector RJ-45.',
      'O vírus limpará a memória cache do servidor DNS do Google (8.8.8.8).'
    ],
    correta: 1
  },
  {
    id: 25,
    texto: 'O comando ping (baseado no protocolo ICMP) foi fundamental nas aulas para diagnosticar falhas nos cabos e nas configurações de IP. Contudo, muitos servidores na internet e roteadores corporativos são configurados pela equipe de Segurança da Informação para ignorar/bloquear respostas de ping vindas de fora. Essa prática de segurança tem como objetivo:',
    alternativas: [
      'Economizar a bateria da placa-mãe dos servidores.',
      'Evitar varreduras de reconhecimento (Ping Sweep, onde invasores mapeiam quais IPs estão ativos na rede para planejar ataques) e mitigar ataques de sobrecarga de tráfego por inundação de pacotes (ICMP Flood / DDoS).',
      'Impedir que os funcionários utilizem cabos no padrão T568A.',
      'Forçar os computadores a usarem apenas endereços IPv6.'
    ],
    correta: 1
  },
  {
    id: 26,
    texto: 'No vídeo "Segurança da Informação Descomplicada", a analogia do "Pescoço de Girafa" (Shoulder Surfing) ilustra uma ameaça comum no ambiente escolar e corporativo. Quando um indivíduo observa disfarçadamente a tela do smartphone de um colega para visualizar senhas ou dados bancários, qual pilar da Segurança da Informação é violado?',
    alternativas: [
      'Disponibilidade dos dados.',
      'Confidencialidade, pois ocorreu uma visualização e interceptação não autorizada de informação restrita.',
      'Integridade do sistema de arquivos.',
      'Não-repúdio dos logs de rede.'
    ],
    correta: 1
  },
  {
    id: 27,
    texto: 'Em um cenário onde um aluno realiza uma transferência via Pix de R$ 20,00 da sua bolsa de estudos, se um atacante conseguir interceptar o pacote de dados na rede e alterar o valor transmitido para R$ 0,02 sem autorização dos envolvidos, ocorre uma falha no pilar da:',
    alternativas: [
      'Confidencialidade apenas, pois o valor do Pix foi ocultado da rede.',
      'Integridade, pois o conteúdo original da mensagem sofreu uma modificação/mutação não autorizada durante o trânsito.',
      'Disponibilidade, pois o servidor do banco pegou fogo.',
      'Autenticidade do cabo RJ-45 utilizado na bancada.'
    ],
    correta: 1
  },
  {
    id: 28,
    texto: 'No vídeo "A Jornada do Pix", faz-se o contraste entre o backend do banco (um cofre de alta tecnologia) e a cerca de arame destruída no frontend humano. Essa metáfora alerta que investimentos milionários em cibersegurança tornam-se ineficazes quando a segurança é comprometida pelo seu elo mais fraco, que é:',
    alternativas: [
      'O uso de cabos UTP de Categoria 6A.',
      'O fator humano utilizando credenciais frágeis (como senhas simples do tipo "Iturama123") ou caindo em engenharia social.',
      'A velocidade do processador do servidor.',
      'O uso de roteadores Wi-Fi com antenas omnidirecionais.'
    ],
    correta: 1
  },
  {
    id: 29,
    texto: 'A analogia da "lagarta escondida na folha de cana que destrói a lavoura por dentro" é utilizada para explicar como certas ameaças digitais (Malwares) agem no sistema. Ao exibir um banner chamativo oferecendo um "jogo incrível totalmente grátis", o cibercriminoso utiliza a Engenharia Social para que:',
    alternativas: [
      'O próprio usuário conceda permissão e execute o arquivo malicioso em seu sistema.',
      'O roteador da operadora queime a porta WAN automaticamente.',
      'O cabo de rede perca o trançamento interno dos pares.',
      'A máscara de sub-rede da máquina seja alterada para 255.255.255.255.'
    ],
    correta: 0
  },
  {
    id: 30,
    texto: 'Na hora do intervalo (20:15h), um aluno tenta pagar o lanche com o Pix da sua bolsa do Trilhas do Futuro. Porém, o aplicativo do banco fica fora do ar e a operação não é concluída. Do ponto de vista técnico, a impossibilidade do usuário legítimo acessar o serviço no momento em que precisa representa uma quebra do pilar da:',
    alternativas: [
      'Confidencialidade.',
      'Disponibilidade.',
      'Criptografia Assimétrica.',
      'Ancoragem de Hardware.'
    ],
    correta: 1
  }
];
