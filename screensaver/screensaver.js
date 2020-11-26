var fr = null;

var inc = 0.03;
// angle increment
var zinc = 0.0002;
var zoff = 0;
// length increment
var ampOff = 0;
var ampInc = 0.04;

var lengthMax = 8;
var lenPercentage = 0.66;
var scl = 30;
var cols, rows;
var noise;

var cp1, cp2, cp3;
colourOption = 0;

var input_maxLength,
  input_angInc,
  input_lengthInc,
  input_spacialInc,
  inputLen,
  colourButton,
  input_scl;

var colourOptions = [
  {
    cp1: "#1a2a6c",
    cp2: "#b21f1f",
    cp3: "#fdbb2d",
  },
];

function setup() {
  var canv = createCanvas(windowWidth, windowHeight);
  canv.parent("canvas-container");
  cols = ceil(width / scl) + 1;
  rows = ceil(height / scl) + 1;
  frameRate(fr);
  cp1 = color(colourOptions[colourOption].cp1);
  cp2 = color(colourOptions[colourOption].cp2);
  cp3 = color(colourOptions[colourOption].cp3);

  input_maxLength = $("#max-length");
  input_maxLength.val(lengthMax);
  input_maxLength.on("change paste keyup", updateLength);

  input_angInc = $("#angInc");
  input_angInc.val(zinc);
  input_angInc.on("change paste keyup", updateAng);

  input_lengthInc = $("#lenInc");
  input_lengthInc.val(ampInc);
  input_lengthInc.on("change paste keyup", updateLenInc);

  input_spacialInc = $("#spacialInc");
  input_spacialInc.val(inc);
  input_spacialInc.on("change paste keyup", updateInc);

  inputLen = $("#len");
  inputLen.val(1 - lenPercentage);
  inputLen.on("change paste keyup", updateLen);

  input_scl = $("#scl");
  input_scl.val(scl);
  input_scl.on("change paste keyup", updateScl);

  colourButton = $("#colourButton");
  colourButton.on("click", function (e) {
    console.log(colourOption);
    console.log(colourOptions.length);
    if (colourOption == colourOptions.length - 1) {
      colourOption = 0;
    } else {
      colourOption++;
    }

    cp1 = color(colourOptions[colourOption].cp1);
    cp2 = color(colourOptions[colourOption].cp2);
    cp3 = color(colourOptions[colourOption].cp3);
  });
}

function draw() {
  background(0);
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * width;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
      var amp = map(noise(xoff, yoff, zoff), 0, 1, -5, 5);

      var sigAmp = sig(amp);
      var sigAmpLen = sigAmp * lengthMax;
      var len = sigAmpLen * scl;

      var v = p5.Vector.fromAngle(angle);
      if (amp < 0.5) {
        var colour = lerpColor(cp1, cp2, map(amp, 0, 0.5, 0, 1));
      } else {
        var colour = lerpColor(cp2, cp3, map(amp, 0.5, 1, 0, 1));
      }
      let alpha = map(sigAmpLen, 0, lengthMax, -50, 255);
      colour.setAlpha(alpha);

      stroke(colour);

      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      strokeWeight(sigAmpLen);
      // (2 * len) / 3
      line(lenPercentage * len, 0, len, 0);
      pop();

      xoff += inc;
    }
    yoff += inc;
    zoff += zinc;
    ampOff += ampInc;
  }
}

function sig(x) {
  return 1 / (1 + exp(-x));
}
function updateLength() {
  lengthMax = input_maxLength.val();
}
function updateAng() {
  zinc = Number.parseFloat(input_angInc.val(), 10);
}

function updateLenInc() {
  ampInc = Number.parseFloat(input_lengthInc.val(), 10);
}
function updateInc() {
  inc = Number.parseFloat(input_spacialInc.val(), 10);
}
function updateLen() {
  lenPercentage = 1 - inputLen.val();
}
function updateScl() {
  scl = input_scl.val();
  cols = ceil(width / scl) + 1;
  rows = ceil(height / scl) + 1;
}
