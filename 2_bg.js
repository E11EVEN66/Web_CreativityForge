var canvas, bgColor;
let lastTime = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("position", "fixed");
  canvas.style("z-index", "-1");
  canvas.style("top", "0");
  canvas.style("left", "0");
  colorMode(HSB, 360, 100, 100);
  bgColor = color(0, 0, 100);
  background(bgColor);
}

function draw() {
  let currentTime = millis();
  if (currentTime - lastTime > 100) {
    background(bgColor);
    drawShape();
    lastTime = currentTime;
  }
}

function drawShape() {
  const time = millis() / 30000;
  const dynamicRadius = max(width, height) * 1.2;

  let x = width / 2 + dynamicRadius * cos(time * TWO_PI);
  let y = height / 2 + dynamicRadius * sin(time * TWO_PI);

  const grd = [];
  let alpha = 0.6 + 0.4 * sin(time * TWO_PI);

  grd[0] = drawingContext.createRadialGradient(x, y, 0, x, y, dynamicRadius);
  grd[0].addColorStop(0, `hsla(240, 100%, 64%, ${alpha})`);
  grd[0].addColorStop(1, `hsla(240, 100%, 64%, 0)`);

  grd[1] = drawingContext.createRadialGradient(
    width - x,
    height - y,
    0,
    width - x,
    height - y,
    dynamicRadius
  );
  grd[1].addColorStop(0, `hsla(278, 100%, 50%, ${alpha})`);
  grd[1].addColorStop(1, `hsla(278, 100%, 50%, 0)`);

  noStroke();
  for (let i = 0; i < grd.length; i++) {
    drawingContext.fillStyle = grd[i];
    rect(0, 0, width, height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
