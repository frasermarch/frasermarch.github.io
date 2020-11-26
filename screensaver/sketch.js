var fr = 30;

var inc = 0.05;
// angle increment
var zinc = 0.0001;
var zoff = 0;
// length increment
var ampOff = 0;
var ampInc = 0.02;

var lengthMin = 0;
var lengthMax = 8;

var scl = 20;
var cols, rows;
var noise;

var from, to;

var colourOptions = {
  roseanna: {
    from: "#ffafbd",
    to: "#ffc3a0",
  },
  purple: {
    from: "#cc2b5e",
    to: " #753a88",
  },
  tranquil: {
    from: "#eecda3",
    to: "#ef629f",
  },
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  frameRate(fr);
  from = color(colourOptions.roseanna.from);
  to = color(colourOptions.roseanna.to);
}

function draw() {
  background(0);
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * width;
      var angle = noise(xoff, yoff, zoff) * TWO_PI;
      var amp = map(noise(xoff, yoff, zoff), 0, 1, -5, 5);

      var sigAmp = sig(amp);
      var sigAmpLen = sigAmp * lengthMax;
      var len = sigAmpLen * scl;

      var v = p5.Vector.fromAngle(angle);
      xoff += inc;
      let colour = lerpColor(from, to, amp);
      colour.setAlpha(map(sigAmpLen, 0, lengthMax, -50, 300));
      stroke(colour);
      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      strokeWeight(sigAmpLen);

      line(0, 0, len, 0, 1);
      pop();
    }
    yoff += inc;
    zoff += zinc;
    ampOff += ampInc;
  }
}

function sig(x) {
  return 1 / (1 + exp(-x));
}
