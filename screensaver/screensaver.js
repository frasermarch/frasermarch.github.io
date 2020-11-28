var fr = 40;

var inc = 0.03;
// angle increment
var zinc = 0.0002;
var zoff = 0;
// length increment
var ampOff = 0;
var ampInc = 0.04;

var lengthMax = 8;
var lenPercentage = 0.8;
var scl = 20;
var cols, rows;
var simplexNoise;
var alphaMin = 100;
var alphaMax = 255;
var cp1, cp2, cp3;
var colourOption = 0;
var sigmoidLimits = 5;
var input_maxLength,
  input_angInc,
  input_lengthInc,
  input_spacialInc,
  inputLen,
  colourButton,
  input_scl,
  input_alphaMin,
  input_alphaMax,
  input_sigLim,
  input_noiseType,
  input_meshOn;

var colourOptions = [
  {
    cp1: "#1a2a6c",
    cp2: "#b21f1f",
    cp3: "#fdbb2d",
  },
  {
    cp1: "#12c2e9",
    cp2: "#c471ed",
    cp3: "#f64f59",
  },
  {
    cp1: "#8A2387",
    cp2: "#E94057",
    cp3: "#F27121",
  },
];

var noiseType = "perlin";
var meshOn = "";

var mesh = [];
function setup() {
  var canv = createCanvas(windowWidth, windowHeight);
  canv.parent("canvas-container");
  cols = ceil(width / scl) + 1;
  rows = ceil(height / scl) + 1;
  frameRate(fr);
  for (var x = 0; x < cols; x++) {
    mesh[x] = [];
    for (var y = 0; y < rows; y++) {
      mesh[x][y] = 0; //specify a default value for now
    }
  }
  simplexNoise = new OpenSimplexNoise(Date.now());

  cp1 = color(colourOptions[colourOption].cp1);
  cp2 = color(colourOptions[colourOption].cp2);
  cp3 = color(colourOptions[colourOption].cp3);

  input_noiseType = $(".noise-type");
  input_noiseType.on("change", function (e) {
    noiseType = $(".noise-type:checked").val();
  });

  input_meshOn = $("#mesh-on");
  input_meshOn.on("change", function (e) {
    console.log($("#mesh-on:checked").val());
    meshOn = $("#mesh-on:checked").val();
  });

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

  input_alphaMin = $("#alphaMin");
  input_alphaMin.val(alphaMin);
  input_alphaMin.on("change paste keyup", function () {
    alphaMin = parseInt($(this).val());
  });

  input_alphaMax = $("#alphaMax");
  input_alphaMax.val(alphaMax);
  input_alphaMax.on("change paste keyup", function () {
    alphaMax = parseInt($(this).val());
  });

  input_sigLim = $("#sigLim");
  input_sigLim.val(sigmoidLimits);
  input_sigLim.on("change paste keyup", function () {
    sigmoidLimits = parseInt($(this).val());
  });

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
      if (noiseType == "simplex") {
        var angle = simplexNoise.noise3D(xoff, yoff, zoff) * TWO_PI * 2;
        var amp = map(
          simplexNoise.noise3D(xoff, yoff, zoff),
          0,
          1,
          -sigmoidLimits,
          sigmoidLimits
        );
      } else if (noiseType == "perlin") {
        var angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
        var amp = map(
          noise(xoff, yoff, zoff),
          0,
          1,
          -sigmoidLimits,
          sigmoidLimits
        );
      }

      var sigAmp = sig(amp);
      var sigAmpLen = sigAmp * lengthMax;
      var len = sigAmpLen * scl;

      var v = p5.Vector.fromAngle(angle);
      if (amp < 0.5) {
        var colour = lerpColor(cp1, cp2, map(amp, 0, 0.5, 0, 1));
      } else {
        var colour = lerpColor(cp2, cp3, map(amp, 0.5, 1, 0, 1));
      }
      let alpha = map(sigAmpLen, 0, lengthMax, alphaMin, alphaMax);
      colour.setAlpha(alpha);

      stroke(colour);
      push();
      if (meshOn != "on") {
        translate(x * scl, y * scl);
        rotate(v.heading());
        strokeWeight(sigAmpLen);
        line(lenPercentage * len, 0, len, 0);
      } else {
        v.setMag(len);
        let xbase = x * scl;
        let ybase = y * scl;
        let xPos = xbase + v.x;
        let yPos = ybase + v.y;
        mesh[x][y] = [xPos, yPos];
        strokeWeight(2);
        if (y == 0 || y == rows) {
          // LEFT OR RIGHT
          if (x != 0 && x != cols) {
            // NOT AT THE ENDS
            line(
              mesh[x][y][0],
              mesh[x][y][1],
              mesh[x - 1][y][0],
              mesh[x - 1][y][1]
            );
          }
        } else if (x == 0 || x == cols) {
          // TOP OR BOTTOM
          if (y != 0 && y != cols) {
            line(
              mesh[x][y][0],
              mesh[x][y][1],
              mesh[x][y - 1][0],
              mesh[x][y - 1][1]
            );
          }
        } else {
          // MIDDLE
          line(
            mesh[x][y][0],
            mesh[x][y][1],
            mesh[x][y - 1][0],
            mesh[x][y - 1][1]
          );
          line(
            mesh[x][y][0],
            mesh[x][y][1],
            mesh[x - 1][y][0],
            mesh[x - 1][y][1]
          );
          line(
            mesh[x][y][0],
            mesh[x][y][1],
            mesh[x - 1][y - 1][0],
            mesh[x - 1][y - 1][1]
          );
        }
      }
      pop();
      xoff += inc;
    }
    if (mesh == "on") {
      endShape();
    }
    yoff += inc;
    zoff += zinc;
    ampOff += ampInc;
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = ceil(width / scl) + 1;
  rows = ceil(height / scl) + 1;

  for (var x = 0; x < cols; x++) {
    mesh[x] = [];
    for (var y = 0; y < rows; y++) {
      mesh[x][y] = 0; //specify a default value for now
    }
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
  for (var x = 0; x < cols; x++) {
    mesh[x] = [];
    for (var y = 0; y < rows; y++) {
      mesh[x][y] = 0; //specify a default value for now
    }
  }
}
