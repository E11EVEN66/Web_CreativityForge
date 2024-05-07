//References to SamuelYAN's work

var seed = Math.random() * 1341;
var t;
var num, vNum;
var radius, mySize;
var sizes = [];

let colors = [];
let colors0 = ["#281914", "#1a1a1a", "#202020", "#242e30", "#8834f1"];
let colors7 = [
  "#fefefe",
  "#fffffb",
  "#fafdff",
  "#fef9fb",
  "#f7fcfe",
  "#8834f1",
];
let colors8 = [
  "#8c75ff",
  "#c553d2",
  "#2dfd60",
  "#2788f5",
  "#23054f",
  "#f21252",
  "#8834f1",
  "#c4dd92",
  "#184fd3",
  "#f9fee2",
];
let colors11 = [
  "#025159",
  "#3E848C",
  "#7AB8BF",
  "#C4EEF2",
  "#A67458",
  "#8834f1",
];
let colors12 = [
  "#10454F",
  "#506266",
  "#818274",
  "#A3AB78",
  "#BDE038",
  "#8834f1",
];
let colors13 = [
  "#D96690",
  "#F28DB2",
  "#F2C9E0",
  "#89C2D9",
  "#88E8F2",
  "#8834f1",
];

function lerpColor(a, b, amount) {
  const ah = parseInt(a.replace(/#/g, ""), 16),
    bh = parseInt(b.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + ((0x1000000 + (rr << 16)) | (rg << 8) | rb).toString(16).slice(1)
  );
}

function createGradientArray(colors) {
  let gradient = [];
  const start = colors[0];
  const end = colors[colors.length - 1];
  gradient.push(start);
  gradient.push(lerpColor(start, end, 0.33));
  gradient.push(lerpColor(start, end, 0.66));
  gradient.push(end);
  return gradient;
}

let gradientColors0 = createGradientArray(colors0);
let gradientColors7 = createGradientArray(colors7);
let gradientColors8 = createGradientArray(colors8);
let gradientColors11 = createGradientArray(colors11);
let gradientColors12 = createGradientArray(colors12);
let gradientColors13 = createGradientArray(colors13);

console.log("Gradient Colors 0:", gradientColors0);
console.log("Gradient Colors 7:", gradientColors7);
console.log("Gradient Colors 8:", gradientColors8);
console.log("Gradient Colors 11:", gradientColors11);
console.log("Gradient Colors 12:", gradientColors12);
console.log("Gradient Colors 13:", gradientColors13);

var color_setup1, color_setup2;
let color_bg;

function setup() {
  randomSeed(seed);

  mySize = min(windowWidth, windowHeight);
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "-1");

  color_setup1 = colors7;
  color_setup2 = random([
    colors8,
    colors11,
    colors8,
    colors12,
    colors8,
    colors13,
  ]);
  color_bg = "#202020";
  colors[0] = random(colors7);
  colors[1] = random(color_setup2);
  colors[2] = random(color_setup2);
  colors[3] = random(color_setup2);
  colors[4] = random(color_setup2);
  background(color_bg);

  num = 300;
  radius = mySize * 0.4;
  for (let a = 0; a < TAU; a += TAU / num) {
    sizes.push(random(0.2, 0.8));
  }

  t = 0;
}

function draw() {
  blendMode(BLEND);
  background("#202020");
  randomSeed(seed);
  push();
  translate(width / 2, height / 2);
  rotate(random(TAU) + t);
  for (let i = 0; i < num; i++) {
    let a = (TAU / num) * i + t;
    let x = (radius * sin(a - 0)) / random(2.0, 0.2);
    let y = (radius * cos(a + 0)) / random(0.2, 2.0);
    fill(random(colors));
    noStroke();
    let d = random(radius / 20, radius / 10);
    drawingContext.shadowColor = "#fffff40";
    drawingContext.shadowOffsetX = 2;
    drawingContext.shadowOffsetY = 2;
    drawingContext.shadowBlur = 10;
    let x_plus = 2 * random(-d, d);
    push();
    translate(x + x_plus, y + (d * cos(d)) / 1);
    rotate(random(TAU) + random(1, 5) * t);
    ellipse(0, 0, (d * cos(d)) / random(4, 6), (d * cos(d)) / random(4, 5));
    pop();
  }
  pop();
  t += random(0.001, 0.0015);
}
