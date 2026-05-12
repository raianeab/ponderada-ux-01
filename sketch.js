// Análise de Sensibilidade — Modelo de Crédito Banco Pan
// π_i = r·u − PD_i·LGD | r_min,i = (PD_i·LGD) / u | PD* = (r·u) / LGD

let sliderR, sliderU, sliderLGD;

const PD    = [0.018, 0.045, 0.027, 0.009];
const NOMES = ["C1", "C2", "C3", "C4"];

function setup() {
  let cnv = createCanvas(900, 420);
  cnv.parent("canvas-container");

  sliderR = createSlider(5, 400, 175, 1);
  sliderR.parent("canvas-container");
  sliderR.position(100, 178);
  sliderR.style("width", "240px");

  sliderU = createSlider(10, 100, 75, 1);
  sliderU.parent("canvas-container");
  sliderU.position(100, 248);
  sliderU.style("width", "240px");

  sliderLGD = createSlider(1, 100, 80, 1);
  sliderLGD.parent("canvas-container");
  sliderLGD.position(100, 318);
  sliderLGD.style("width", "240px");
}

function draw() {
  background(245);

  let r   = sliderR.value()   / 10000;
  let u   = sliderU.value()   / 100;
  let lgd = sliderLGD.value() / 100;

  // Borda geral
  push();
  noFill();
  stroke(0);
  strokeWeight(1.5);
  rect(20, 20, width - 40, height - 40);
  pop();

  // Título
  push();
  fill(0);
  noStroke();
  textFont("monospace");
  textSize(13);
  textAlign(CENTER, TOP);
  text("Análise de Sensibilidade — Modelo de Crédito Banco Pan", width / 2, 32);
  textSize(11);
  text("π_i = r·u − PD_i·LGD  |  r_min,i = (PD_i·LGD) / u  |  PD* = (r·u) / LGD", width / 2, 52);
  pop();

  // Linha sob título
  push();
  stroke(0);
  strokeWeight(1.5);
  line(20, 72, width - 20, 72);
  pop();

  // Caixa de controles
  push();
  noFill();
  stroke(0);
  strokeWeight(1.5);
  rect(50, 100, 310, 260, 6);
  pop();

  push();
  fill(0);
  noStroke();
  textFont("monospace");
  textSize(12);

  textAlign(LEFT, TOP);
  text("r — Taxa de interchange", 70, 145);
  textAlign(RIGHT, TOP);
  text(nf(r * 100, 1, 2) + "%", 340, 145);

  textAlign(LEFT, TOP);
  text("u — Utilização média", 70, 215);
  textAlign(RIGHT, TOP);
  text(nf(u * 100, 1, 0) + "%", 340, 215);

  textAlign(LEFT, TOP);
  text("LGD — Loss Given Default", 70, 285);
  textAlign(RIGHT, TOP);
  text(nf(lgd * 100, 1, 2) + "%", 340, 285);
  pop();

  // Gráfico de barras
  let chartX = 410;
  let chartY = 90;
  let chartW = 460;
  let chartH = 280;
  let baseY  = chartY + chartH;
  let barW   = 70;
  let gap    = (chartW - 4 * barW) / 5;

  let lucros = PD.map(pd => r * u - pd * lgd);
  let maxAbs = max(lucros.map(v => abs(v)));
  if (maxAbs === 0) maxAbs = 0.001;

  for (let i = 0; i < 4; i++) {
    let bx = chartX + gap + i * (barW + gap);
    let pi = lucros[i];
    let bh = map(abs(pi), 0, maxAbs, 10, chartH * 0.85);

    push();
    fill(pi >= 0 ? color(40, 160, 80) : color(200, 50, 50));
    noStroke();
    if (pi >= 0) {
      rect(bx, baseY - bh, barW, bh);
    } else {
      rect(bx, baseY, barW, bh);
    }

    fill(0);
    noStroke();
    textFont("monospace");
    textSize(12);
    textAlign(CENTER, TOP);
    text(NOMES[i], bx + barW / 2, baseY + 10);
    pop();
  }

  // Linha de base
  push();
  stroke(0);
  strokeWeight(1);
  line(chartX, baseY, chartX + chartW, baseY);
  pop();
}
