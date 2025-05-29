// --- Variáveis Globais ---

// Configurações do Jogo
let larguraPista = 100; // Largura de cada "pista" marrom
let bordaSuperiorCenario = 60; // Altura da primeira listra verde (cenário)

// Trator 1 (Amarelo)
let trator1X;
let trator1Y;
let trator1Cor = 'yellow';
let trator1Teclas = { cima: 87, baixo: 83, esquerda: 65, direita: 68 }; // W, S, A, D
let trator1PistaYMin; // Limite superior da pista marrom do trator 1
let trator1PistaYMax; // Limite inferior da pista marrom do trator 1

// Trator 2 (Azul)
let trator2X;
let trator2Y;
let trator2Cor = 'blue';
let trator2Teclas = { cima: 38, baixo: 40, esquerda: 37, direita: 39 }; // Setas do teclado
let trator2PistaYMin;
let trator2PistaYMax;

// Trator 3 (Vermelho)
let trator3X;
let trator3Y;
let trator3Cor = 'red';
let trator3Teclas = { cima: 73, baixo: 75, esquerda: 74, direita: 76 }; // I, K, J, L
let trator3PistaYMin;
let trator3PistaYMax;

let tratorTamanho = 50; // Tamanho do emoji dos tratores
let velocidadeTrator = 4; // Velocidade de movimento dos tratores

// Variáveis para os quadrados de grama móveis
let pedacosDeGramaMoveis = [];
let quantidadeGramaMovel = 15; // Quantos quadrados de grama móveis teremos
let velocidadeGramaMovel = 1.5; // Velocidade com que os quadrados de grama se movem
let tamanhoGramaMovel = 40; // Tamanho dos quadrados de grama

// --- Configuração Inicial ---
function setup() {
  createCanvas(800, 500); // Aumentei a tela para caber 3 jogadores e a ação

  // Definir as pistas para cada trator
  // Pista 1 (Top): Abaixo da primeira listra verde, até a segunda
  trator1PistaYMin = bordaSuperiorCenario;
  trator1PistaYMax = bordaSuperiorCenario + larguraPista;

  // Pista 2 (Meio): Abaixo da segunda listra verde, até a terceira
  trator2PistaYMin = bordaSuperiorCenario + larguraPista + 60; // 60 é a altura da listra verde
  trator2PistaYMax = trator2PistaYMin + larguraPista;

  // Pista 3 (Baixo): Abaixo da terceira listra verde, até a quarta
  trator3PistaYMin = bordaSuperiorCenario + (larguraPista * 2) + (60 * 2);
  trator3PistaYMax = trator3PistaYMin + larguraPista;


  // Posições iniciais dos tratores nas suas respectivas pistas
  trator1X = width / 4;
  trator1Y = trator1PistaYMin + larguraPista / 2; // Centro da pista 1

  trator2X = width / 2;
  trator2Y = trator2PistaYMin + larguraPista / 2; // Centro da pista 2

  trator3X = (width / 4) * 3;
  trator3Y = trator3PistaYMin + larguraPista / 2; // Centro da pista 3

  // Cria os quadrados de grama que se movem
  for (let i = 0; i < quantidadeGramaMovel; i++) {
    let x = random(width + 50, width + 300); // Começa fora da tela, à direita
    let y = random(0, height - tamanhoGramaMovel); // Altura aleatória

    // Ajusta a posição Y da grama para que apareça APENAS nas pistas marrons
    let pistaAleatoria = floor(random(3)); // 0, 1 ou 2
    if (pistaAleatoria === 0) {
      y = random(trator1PistaYMin, trator1PistaYMax - tamanhoGramaMovel);
    } else if (pistaAleatoria === 1) {
      y = random(trator2PistaYMin, trator2PistaYMax - tamanhoGramaMovel);
    } else {
      y = random(trator3PistaYMin, trator3PistaYMax - tamanhoGramaMovel);
    }

    pedacosDeGramaMoveis.push({
      x: x,
      y: y,
      largura: tamanhoGramaMovel,
      altura: tamanhoGramaMovel
    });
  }

  // Configurações para o emoji do trator
  textSize(tratorTamanho);
  textAlign(CENTER, CENTER);
}

// --- Loop Principal do Jogo ---
function draw() {
  // Cor de fundo marrom (terra)
  background(139, 69, 19); // Marrom escuro para a terra

  // --- Desenha as listras verdes do cenário (grama fixa) ---
  fill("green");
  noStroke(); // Remove o contorno dos retângulos
  rect(0, 0, width, bordaSuperiorCenario); // Topo
  rect(0, bordaSuperiorCenario + larguraPista, width, 60); // Meio 1
  rect(0, bordaSuperiorCenario + (larguraPista * 2) + 60, width, 60); // Meio 2
  rect(0, height - bordaSuperiorCenario, width, bordaSuperiorCenario); // Fundo

  // --- Movimentação dos Tratores ---
  // A função moverTrator agora controla os limites das pistas
  let novoTrator1Y = moverTrator(trator1Teclas, trator1X, trator1Y, trator1PistaYMin, trator1PistaYMax);
  trator1Y = novoTrator1Y.y; // Atualiza a posição Y do trator 1
  trator1X = novoTrator1Y.x; // Atualiza a posição X do trator 1

  let novoTrator2Y = moverTrator(trator2Teclas, trator2X, trator2Y, trator2PistaYMin, trator2PistaYMax);
  trator2Y = novoTrator2Y.y;
  trator2X = novoTrator2Y.x;

  let novoTrator3Y = moverTrator(trator3Teclas, trator3X, trator3Y, trator3PistaYMin, trator3PistaYMax);
  trator3Y = novoTrator3Y.y;
  trator3X = novoTrator3Y.x;


  // --- Desenha e move os quadrados de grama móveis, verifica colisão ---
  // Iteramos de trás para frente para remover elementos sem problemas
  for (let i = pedacosDeGramaMoveis.length - 1; i >= 0; i--) {
    let grama = pedacosDeGramaMoveis[i];

    fill(100, 200, 100); // Uma cor de verde diferente para a grama que será "comida"
    rect(grama.x, grama.y, grama.largura, grama.altura); // Desenha o pedaço de grama

    // Movimenta a grama para a esquerda (em direção aos tratores)
    grama.x -= velocidadeGramaMovel;

    // Se o pedaço de grama sair da tela pela esquerda, reposiciona ele na direita
    if (grama.x + grama.largura < 0) {
      grama.x = random(width + 50, width + 300);
      // Garante que a nova grama apareça em uma das pistas marrons
      let pistaAleatoria = floor(random(3));
      if (pistaAleatoria === 0) {
        grama.y = random(trator1PistaYMin, trator1PistaYMax - tamanhoGramaMovel);
      } else if (pistaAleatoria === 1) {
        grama.y = random(trator2PistaYMin, trator2PistaYMax - tamanhoGramaMovel);
      } else {
        grama.y = random(trator3PistaYMin, trator3PistaYMax - tamanhoGramaMovel);
      }
    }

    // --- VERIFICAÇÃO DE COLISÃO para cada trator ---
    let trator1ColisaoX = trator1X - tratorTamanho / 2;
    let trator1ColisaoY = trator1Y - tratorTamanho / 2;
    if (detectarColisao(trator1ColisaoX, trator1ColisaoY, tratorTamanho, tratorTamanho,
                        grama.x, grama.y, grama.largura, grama.altura)) {
      removerEGerarGrama(i); // Remove e gera um novo pedaço
    }

    let trator2ColisaoX = trator2X - tratorTamanho / 2;
    let trator2ColisaoY = trator2Y - tratorTamanho / 2;
    if (detectarColisao(trator2ColisaoX, trator2ColisaoY, tratorTamanho, tratorTamanho,
                        grama.x, grama.y, grama.largura, grama.altura)) {
      removerEGerarGrama(i); // Remove e gera um novo pedaço
    }

    let trator3ColisaoX = trator3X - tratorTamanho / 2;
    let trator3ColisaoY = trator3Y - tratorTamanho / 2;
    if (detectarColisao(trator3ColisaoX, trator3ColisaoY, tratorTamanho, tratorTamanho,
                        grama.x, grama.y, grama.largura, grama.altura)) {
      removerEGerarGrama(i); // Remove e gera um novo pedaço
    }
  }

  // --- Desenha os Tratores ---
  // Trator 1
  fill(trator1Cor);
  text("🚜", trator1X, trator1Y);

  // Trator 2
  fill(trator2Cor);
  text("🚜", trator2X, trator2Y);

  // Trator 3
  fill(trator3Cor);
  text("🚜", trator3X, trator3Y);

  // --- Exibe instrução de teclas ---
  fill(255); // Cor branca para o texto
  textSize(18);
  text("P1: WASD", 80, 20);
  text("P2: Setas", width / 2, 20);
  text("P3: IJKL", width - 80, 20);
}

// --- Funções Auxiliares ---

// Função para mover um trator específico, respeitando os limites da pista
function moverTrator(teclas, currentX, currentY, pistaMinY, pistaMaxY) {
  let newX = currentX;
  let newY = currentY;

  if (keyIsDown(teclas.cima)) {
    newY -= velocidadeTrator;
  }
  if (keyIsDown(teclas.baixo)) {
    newY += velocidadeTrator;
  }
  if (keyIsDown(teclas.esquerda)) {
    newX -= velocidadeTrator;
  }
  if (keyIsDown(teclas.direita)) {
    newX += velocidadeTrator;
  }

  // Limitar o trator dentro da tela (horizontalmente)
  newX = constrain(newX, tratorTamanho / 2, width - tratorTamanho / 2);

  // Limitar o trator dentro da sua pista marrom (verticalmente)
  newY = constrain(newY, pistaMinY + tratorTamanho / 2, pistaMaxY - tratorTamanho / 2);

  return {x: newX, y: newY}; // Retorna as novas coordenadas
}


// Função para detectar colisão entre dois retângulos (AABB)
function detectarColisao(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 < x2 + w2 &&
          x1 + w1 > x2 &&
          y1 < y2 + h2 &&
          y1 + h1 > y2);
}

// Função para remover um pedaço de grama e gerar um novo
function removerEGerarGrama(index) {
  pedacosDeGramaMoveis.splice(index, 1); // Remove o pedaço de grama
  // Reposiciona um novo pedaço de grama na direita para manter a quantidade
  let novoX = random(width + 50, width + 300);
  let novoY; // Variável para a nova posição Y

  // Garante que a nova grama apareça em uma das pistas marrons
  let pistaAleatoria = floor(random(3));
  if (pistaAleatoria === 0) {
    novoY = random(trator1PistaYMin, trator1PistaYMax - tamanhoGramaMovel);
  } else if (pistaAleatoria === 1) {
    novoY = random(trator2PistaYMin, trator2PistaYMax - tamanhoGramaMovel);
  } else {
    novoY = random(trator3PistaYMin, trator3PistaYMax - tamanhoGramaMovel);
  }

  pedacosDeGramaMoveis.push({
    x: novoX,
    y: novoY,
    largura: tamanhoGramaMovel,
    altura: tamanhoGramaMovel
  });
}