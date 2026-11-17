// Tema e comentário de cada questão (usados no telão, no celular e no relatório).

const temas = {
  cabo: 'Cabeamento e crimpagem',
  ip: 'Endereçamento IP, DHCP e DNS',
  cmd: 'Comandos de diagnóstico',
  equip: 'Equipamentos, camadas e protocolos',
  cid: 'Pilares da segurança (CID)',
  ataque: 'Ataques em rede',
  defesa: 'Firewall e segurança física',
  social: 'Malware e engenharia social'
};

const c = {
  1:  ['cabo',   'O crossover cruza os pares: uma ponta em T568A e a outra em T568B. Assim a transmissão de uma placa (pinos 1 e 2) chega na recepção da outra (pinos 3 e 6).'],
  2:  ['cabo',   'O T568A começa pelo verde: branco-verde, verde, branco-laranja, azul, branco-azul, laranja, branco-marrom, marrom. O T568B troca o verde pelo laranja.'],
  3:  ['ip',     'O gateway só serve para sair da rede local, e o DNS só para traduzir nomes. Na mesma rede (192.168.10.x) e usando números IP, nenhum dos dois faz falta.'],
  4:  ['cmd',    'Se a resposta vem do próprio IP de origem com "Host de destino inacessível", quem respondeu foi a sua placa. Os 0% de perda enganam: nada chegou ao destino.'],
  5:  ['equip',  'O switch trabalha na camada 2: aprende o MAC ligado em cada porta e entrega o quadro só na porta certa. Calcular rotas entre redes é papel do roteador (camada 3).'],
  6:  ['cmd',    'O ipconfig mostra o básico (IP, máscara e gateway). O ipconfig /all acrescenta o MAC, o servidor DHCP, os servidores DNS e o prazo da concessão.'],
  7:  ['ip',     'Dois equipamentos com o mesmo IP na mesma rede geram conflito, e um ou os dois ficam sem comunicação. Por isso IP fixo deve ficar fora da faixa que o DHCP distribui.'],
  8:  ['ip',     'Com o DNS errado, a rede funciona por número (ping 8.8.8.8 responde), mas nomes como google.com não são traduzidos. Testar ping por IP e por nome separa o problema.'],
  9:  ['cabo',   'O trançamento protege contra interferência e diafonia. O testador de LEDs só confere se cada fio chega ao pino certo, então um par dividido passa no teste e falha no uso.'],
  10: ['ip',     'Endereço 169.254.x.x é APIPA: o Windows não achou o servidor DHCP e se deu um IP provisório, sem internet. Verifique o cabo, a porta do switch e o serviço DHCP.'],
  11: ['equip',  'O IP de destino é o endereço final e não muda durante a viagem. O MAC vale só até a próxima parada, por isso cada roteador troca o "envelope externo".'],
  12: ['cabo',   'Deixar 1,2 a 1,4 cm de fio faz a capa de PVC entrar no conector e ser presa pela trava, protegendo os fios de cobre contra puxões. Fio comprido demais deixa a capa de fora.'],
  13: ['cmd',    'O tracert envia pacotes com TTL 1, 2, 3... Cada roteador desconta 1 e, quando o TTL zera, devolve um aviso de tempo esgotado. É assim que cada salto aparece.'],
  14: ['equip',  'O UDP não confirma recebimento nem reenvia o que se perdeu. Some um pedaço da imagem, mas a chamada não para. O TCP garante a entrega, mas é mais lento.'],
  15: ['equip',  'Todo equipamento com placa de rede, MAC e IP é um host: computador, câmera ou gateway solar. Ele recebe IP, máscara e gateway do DHCP como qualquer outro.'],
  16: ['cid',    'Pasta aberta para "Todos" sem senha deixa qualquer um ler (quebra a confidencialidade) e também alterar ou apagar (quebra a integridade e a disponibilidade).'],
  17: ['defesa', 'No perfil de rede Público, o firewall do Windows bloqueia ping e compartilhamento para proteger a máquina em redes desconhecidas. No perfil Privado essas regras são liberadas.'],
  18: ['ataque', 'No Rogue DHCP o atacante responde antes do servidor oficial e se coloca como gateway e DNS. Todo o tráfego passa por ele: é um ataque Man-in-the-Middle.'],
  19: ['ataque', 'Com o DNS envenenado, o endereço digitado está certo, mas leva a um IP falso. O site falso imita o verdadeiro para roubar senhas.'],
  20: ['ataque', 'O MAC vem de fábrica, mas o sistema deixa trocar o MAC que a placa anuncia. Basta copiar o MAC de uma máquina liberada para enganar o filtro (MAC Spoofing).'],
  21: ['cid',    'Usar o IP do gateway cria conflito com o roteador e derruba a internet de todos da sub-rede. É um ataque à disponibilidade (negação de serviço).'],
  22: ['defesa', 'Tomada de rede ativa em local aberto é porta de entrada: qualquer pessoa pluga um notebook e entra na rede sem se identificar. Portas sem uso devem ser desativadas.'],
  23: ['equip',  'O hub repete tudo para todas as portas, então qualquer máquina pode espionar. O switch entrega cada quadro só na porta do destino.'],
  24: ['social', 'O ransomware se espalha: além de criptografar a máquina infectada, procura pastas compartilhadas e computadores vulneráveis na mesma rede.'],
  25: ['ataque', 'Bloquear ping esconde quais IPs estão ativos (dificulta o Ping Sweep) e reduz o impacto de inundações de pacotes ICMP (Flood e DDoS).'],
  26: ['cid',    'Ver uma informação sem autorização quebra a confidencialidade. Nada foi alterado nem ficou fora do ar: a informação só foi exposta.'],
  27: ['cid',    'Alterar o conteúdo sem autorização quebra a integridade. A mensagem chegou, mas não é mais a original.'],
  28: ['social', 'O elo mais fraco é o fator humano: uma senha fraca ou um golpe de engenharia social anulam qualquer investimento em tecnologia.'],
  29: ['social', 'Na engenharia social, o golpista convence a vítima a executar o malware ela mesma. O "jogo grátis" é a isca.'],
  30: ['cid',    'O serviço existe, mas o usuário legítimo não consegue usar quando precisa: é uma falha de disponibilidade.']
};

const comentarios = {};
for (const [id, [tema, texto]] of Object.entries(c)) comentarios[id] = { tema: temas[tema], comentario: texto };

module.exports = { comentarios, temas };
