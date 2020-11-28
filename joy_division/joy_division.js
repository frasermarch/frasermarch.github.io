// Daniel Shiffman
// http://codingtra.in
// https://youtu.be/IKB1hWWedMk
// https://thecodingtrain.com/CodingChallenges/011-perlinnoiseterrain.html

// Edited by SacrificeProductions

var cols, rows;
var rowScl = 20; // Y
var colScl = 10; // X
var w = 500;
var h = 1000;
var padding = 0.15;
var changeRegion = 0.2;

var baseAmp = 10;
var addAmpMax = 150;
var addAmpMin = 50;
var flying = 0;

var terrain = [];

var simplexNoise;

var sigmaSquare = 1;
var mu = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cols = w / colScl;
  rows = h / rowScl;
  simplexNoise = new OpenSimplexNoise(Date.now());
  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}

function draw() {
  flying -= 0.05;
  var yoff = flying;
  //   var addAmp = random(addAmpMin, addAmpMax);
  var addAmp = 100;
  for (var x = 0; x < cols; x++) {
    var xoff = 0;

    for (var y = 0; y < rows; y++) {
      // simplexNoise.noise2D

      if (x < padding * cols || x > (1 - padding) * cols) {
        var amp = baseAmp;
      } else if (x < (padding + changeRegion) * cols) {
        let dist = sig(
          map(x, padding * cols, (padding + changeRegion) * cols, -6, 6)
        );
        var amp = baseAmp + dist * addAmp;
      } else if (x > (1 - padding - changeRegion) * cols) {
        let dist = sig(
          map(
            x,
            (1 - padding - changeRegion) * cols,
            (1 - padding) * cols,
            -6,
            6
          )
        );
        var amp = baseAmp + (1 - dist) * addAmp;
      } else {
        var amp = baseAmp + addAmp;
      }
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, 0, amp);
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  background(0);
  translate(0, -100);
  rotateX(PI / 3.5);
  stroke(255, 255, 255);
  noFill();
  strokeWeight(1.5);
  translate(-w / 2, -h / 2);
  for (var x = 0; x < cols - 1; x++) {
    beginShape(LINES);
    for (var y = 0; y < rows; y++) {
      vertex(x * colScl, y * rowScl, terrain[x][y]);
      vertex((x + 1) * colScl, y * rowScl, terrain[x + 1][y]);
    }
    endShape();
  }
}

function normalDist(x) {
  return (
    (1 / (Math.sqrt(sigmaSquare) * Math.sqrt(TWO_PI))) *
    Math.exp((-0.5 * ((x - mu) / Math.sqrt(sigmaSquare))) ^ 2)
  );
}

function sig(x) {
  return 1 / (1 + exp(-x));
}
