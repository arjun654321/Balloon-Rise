let gameStarted; 
let fuelPickups = []; 
const FUEL_SPACING = 1800; 
const FUEL_MIN_HEIGHT = -300;
const FUEL_MAX_HEIGHT = -300;
let balloonX;
let balloonY;

let verticalVelocity; 
let horizontalVelocity; 

let fuel; 
let heating; 

let trees; 
let backgroundTrees; 


const mainAreaWidth = 400;
const mainAreaHeight = 375;
let horizontalPadding = (window.innerWidth - mainAreaWidth) / 2;
let verticalPadding = (window.innerHeight - mainAreaHeight) / 2;

const hill1BaseHeight = 80;
const hill1Speed = 0.2;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 50;
const hill2Speed = 0.2;
const hill2Amplitude = 15;
const hill2Stretch = 0.5;
const hill3BaseHeight = 15;
const hill3Speed = 1;
const hill3Amplitude = 10;
const hill3Stretch = 0.2;

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");




const introductionElement = document.getElementById("introduction");
const restartButton = document.getElementById("restart");


Math.sinus = function (degree) {
  return Math.sin((degree / 180) * Math.PI);
};


resetGame();


function resetGame() {
  gameStarted = false;
  heating = false;
  verticalVelocity = 5;
  horizontalVelocity = 5;
  balloonX = 0;
  balloonY = 0;
  fuel = 100;
  fuelPickups = [];

  introductionElement.style.opacity = 1;
  restartButton.style.display = "none";
  
  initFuelPickups(); 
  
  trees = [];
  for (let i = 1; i < window.innerWidth / 50; i++) generateTree();

  backgroundTrees = [];
  for (let i = 1; i < window.innerWidth / 30; i++) generateBackgroundTree();

  draw();
}
function generateFuelPickup(startX) {
  fuelPickups.push({
      x: startX || (balloonX + mainAreaWidth),
      y: FUEL_MIN_HEIGHT + Math.random() * (FUEL_MAX_HEIGHT - FUEL_MIN_HEIGHT),
      collected: false
  });
}
function createFuelPickup(startX) {
  return {
      x: startX,
      y: FUEL_MIN_HEIGHT + Math.random() * (FUEL_MAX_HEIGHT - FUEL_MIN_HEIGHT),
      collected: false
  };
}
function initFuelPickups() {
  fuelPickups = [];
  for (let i = 0; i < 3; i++) {
    const x = balloonX + mainAreaWidth + (i * FUEL_SPACING);
    const y = FUEL_MIN_HEIGHT + Math.random() * (FUEL_MAX_HEIGHT - FUEL_MIN_HEIGHT);
    fuelPickups.push({
      x: x,
      y: y,
      collected: false
    });
  }
}
function drawFuelPickup() {
  ctx.save();
  fuelPickups.forEach(pickup => {
      if (!pickup.collected) {
          
          ctx.fillStyle = '#ff0000';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          
          
          ctx.fillRect(pickup.x - 15, pickup.y - 20, 30, 35);
          
          
          ctx.fillRect(pickup.x - 8, pickup.y - 25, 16, 5);
          
          
          ctx.strokeStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(pickup.x, pickup.y);
          ctx.lineTo(pickup.x, pickup.y + 10);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(pickup.x - 5, pickup.y + 5);
          ctx.lineTo(pickup.x + 5, pickup.y + 5);
          ctx.stroke();
      }
  });
  ctx.restore();
}


function checkFuelPickups() {
  fuelPickups = fuelPickups.filter(pickup => {
    if (pickup.collected) return false;
    
   
    const basketLeft = balloonX - 30;
    const basketRight = balloonX + 30; 
    const basketTop = balloonY - 40;
    const basketBottom = balloonY;

  
    const balloonCenterX = balloonX;
    const balloonCenterY = balloonY - 160; 
    const balloonRadius = 80;

    const pickupLeft = pickup.x - 15;
    const pickupRight = pickup.x + 15;
    const pickupTop = pickup.y - 25; 
    const pickupBottom = pickup.y + 15;

    const basketCollision = !(
      basketLeft > pickupRight ||
      basketRight < pickupLeft ||
      basketTop > pickupBottom ||
      basketBottom < pickupTop
    );

  
    const dx = Math.abs(balloonCenterX - pickup.x);
    const dy = Math.abs(balloonCenterY - pickup.y);
    const balloonCollision = (dx * dx + dy * dy) <= (balloonRadius * balloonRadius);

    if (basketCollision || balloonCollision) {
      fuel = Math.min(fuel + 50, 100);
      pickup.collected = true;
      return false;
    }
    return true;
  });


  const lastPickupX = Math.max(...fuelPickups.map(p => p.x), balloonX);
  if (balloonX > lastPickupX - FUEL_SPACING) {
    generateFuelPickup(lastPickupX + FUEL_SPACING);
  }
}



function generateBackgroundTree() {
  const minimumGap = 30;
  const maximumGap = 150;

  
  const lastTree = backgroundTrees[backgroundTrees.length - 1];
  let furthestX = lastTree ? lastTree.x : 0;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));

  const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
  const color = treeColors[Math.floor(Math.random() * 3)];

  backgroundTrees.push({ x, color });
}

function generateTree() {
  const minimumGap = 50; 
  const maximumGap = 600; 

  const x = trees.length
    ? trees[trees.length - 1].x +
      minimumGap +
      Math.floor(Math.random() * (maximumGap - minimumGap))
    : 400;

  const h = 60 + Math.random() * 80; 

  const r1 = 32 + Math.random() * 16; 
  const r2 = 32 + Math.random() * 16;
  const r3 = 32 + Math.random() * 16;
  const r4 = 32 + Math.random() * 16;
  const r5 = 32 + Math.random() * 16;
  const r6 = 32 + Math.random() * 16;
  const r7 = 32 + Math.random() * 16;

  const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
  const color = treeColors[Math.floor(Math.random() * 3)];

  trees.push({ x, h, r1, r2, r3, r4, r5, r6, r7, color });
}

resetGame();


window.addEventListener("keydown", function (event) {
  if (event.key == " ") {
    event.preventDefault();
    resetGame();
    return;
  }
});

window.addEventListener("mousedown", function () {
  heating = true;

  if (!gameStarted) {
    introductionElement.style.opacity = 0;
    gameStarted = true;
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup", function () {
  heating = false;
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  horizontalPadding = (window.innerWidth - mainAreaWidth) / 2;
  verticalPadding = (window.innerHeight - mainAreaHeight) / 2;
  draw();
});


function animate() {
  if (!gameStarted) return;

  const velocityChangeWhileHeating = 0.4;
  const velocityChangeWhileCooling = 0.2;
  
  if (heating && fuel > 0) {
    if (verticalVelocity > -8) {
      
      verticalVelocity -= velocityChangeWhileHeating;
    }
    fuel -= 0.002 * -balloonY;
  } else if (verticalVelocity < 5) {
    
    verticalVelocity += velocityChangeWhileCooling;
  }

  balloonY += verticalVelocity; 
  if (balloonY > 0) balloonY = 0; 
  if (balloonY < 0) balloonX += horizontalVelocity; 

  
  if (trees[0].x - (balloonX - horizontalPadding) < -100) {
    trees.shift(); 
    generateTree(); 
  }

  
  if (
    backgroundTrees[0].x - (balloonX * hill1Speed - horizontalPadding) <
    -40
  ) {
    backgroundTrees.shift(); 
    generateBackgroundTree(); 
  }
  checkFuelPickups();
  draw(); 

  
  const hit = hitDetection();
    if (hit || (fuel <= 0 && balloonY >= 0 && fuelPickups.every(p => p.collected))) {
        restartButton.style.display = "block";
        return;
    }

  window.requestAnimationFrame(animate);
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  drawSky();

  ctx.save();
  ctx.translate(0, verticalPadding + mainAreaHeight);
  drawBackgroundHills();

  ctx.translate(horizontalPadding, 0);
  ctx.translate(-balloonX, 0);

  drawTrees();
  drawFuelPickup(); 
  drawBalloon(); 

  ctx.restore();

  drawHeader();
}

restartButton.addEventListener("click", function (event) {
  event.preventDefault();
  resetGame();
  restartButton.style.display = "none";
});

function drawCircle(cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function drawTrees() {
  trees.forEach(({ x, h, r1, r2, r3, r4, r5, r6, r7, color }) => {
    ctx.save();
    ctx.translate(x, 0);

    
    const trunkWidth = 40;
    ctx.fillStyle = "#885F37";
    ctx.beginPath();
    ctx.moveTo(-trunkWidth / 2, 0);
    ctx.quadraticCurveTo(-trunkWidth / 4, -h / 2, -trunkWidth / 2, -h);
    ctx.lineTo(trunkWidth / 2, -h);
    ctx.quadraticCurveTo(trunkWidth / 4, -h / 2, trunkWidth / 2, 0);
    ctx.closePath();
    ctx.fill();

    
    ctx.fillStyle = color;
    drawCircle(-20, -h - 15, r1);
    drawCircle(-30, -h - 25, r2);
    drawCircle(-20, -h - 35, r3);
    drawCircle(0, -h - 45, r4);
    drawCircle(20, -h - 35, r5);
    drawCircle(30, -h - 25, r6);
    drawCircle(20, -h - 15, r7);

    ctx.restore();
  });
}

function drawBalloon() {
  ctx.save();

  ctx.translate(balloonX, balloonY);

  
  ctx.fillStyle = "#DB504A";
  ctx.fillRect(-30, -40, 60, 10);
  ctx.fillStyle = "#EA9E8D";
  ctx.fillRect(-30, -30, 60, 30);

  
  ctx.strokeStyle = "#D62828";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-24, -40);
  ctx.lineTo(-24, -60);
  ctx.moveTo(24, -40);
  ctx.lineTo(24, -60);
  ctx.stroke();

  
  ctx.fillStyle = "#D62828";
  ctx.beginPath();
  ctx.moveTo(-30, -60);
  ctx.quadraticCurveTo(-80, -120, -80, -160);
  ctx.arc(0, -160, 80, Math.PI, 0, false);
  ctx.quadraticCurveTo(80, -120, 30, -60);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawHeader() {
  
  ctx.strokeStyle = fuel <= 30 ? "red" : "white";
  ctx.strokeRect(30, 30, 150, 30);
  ctx.fillStyle = fuel <= 30 ? "rgba(255,0,0,0.5)" : "rgba(150,150,200,0.5)";
  ctx.fillRect(30, 30, (150 * fuel) / 100, 30);

  
  const score = Math.floor(balloonX / 30);
  ctx.fillStyle = "black";
  ctx.font = "bold 32px Tahoma";
  ctx.textAlign = "end";
  ctx.textBaseline = "top";
  ctx.fillText(`${score} m`, window.innerWidth - 30, 30);
}

function drawSky() {
  var gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(0, "#AADBEA");
  gradient.addColorStop(1, "#FEF1E1");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawBackgroundHills() {
  
  drawHill(
    hill1BaseHeight,
    hill1Speed,
    hill1Amplitude,
    hill1Stretch,
    "#AAD155" 
  );
  drawHill(
    hill2BaseHeight,
    hill2Speed,
    hill2Amplitude,
    hill2Stretch,
    "#84B249" 
  );

  drawHill(
    hill3BaseHeight,
    hill3Speed,
    hill3Amplitude,
    hill3Stretch,
    "#26532B"
  );

  
  backgroundTrees.forEach((tree) => drawBackgroundTree(tree.x, tree.color));
}


function drawHill(baseHeight, speedMultiplier, amplitude, stretch, color) {
  ctx.beginPath();
  ctx.moveTo(0, window.innerHeight);
  ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
  for (let i = 0; i <= window.innerWidth; i++) {
    ctx.lineTo(i, getHillY(i, baseHeight, speedMultiplier, amplitude, stretch));
  }
  ctx.lineTo(window.innerWidth, window.innerHeight);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawBackgroundTree(x, color) {
  ctx.save();
  ctx.translate(
    (-balloonX * hill1Speed + x) * hill1Stretch,
    getTreeY(x, hill1BaseHeight, hill1Amplitude)
  );

  const treeTrunkHeight = 5;
  const treeTrunkWidth = 2;
  const treeCrownHeight = 25;
  const treeCrownWidth = 10;

  
  ctx.fillStyle = "#7D833C";
  ctx.fillRect(
    -treeTrunkWidth / 2,
    -treeTrunkHeight,
    treeTrunkWidth,
    treeTrunkHeight
  );

  
  ctx.beginPath();
  ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
  ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
  ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

function getHillY(x, baseHeight, speedMultiplier, amplitude, stretch) {
  const sineBaseY = -baseHeight;
  return (
    Math.sinus((balloonX * speedMultiplier + x) * stretch) * amplitude +
    sineBaseY
  );
}

function getTreeY(x, baseHeight, amplitude) {
  const sineBaseY = -baseHeight;
  return Math.sinus(x) * amplitude + sineBaseY;
}

function hitDetection() {
  const cartBottomLeft = { x: balloonX - 30, y: balloonY };
  const cartBottomRight = { x: balloonX + 30, y: balloonY };
  const cartTopRight = { x: balloonX + 30, y: balloonY - 40 };

  for (const { x, h, r1, r2, r3, r4, r5 } of trees) {
    const treeBottomLeft = { x: x - 20, y: -h - 15 };
    const treeLeft = { x: x - 30, y: -h - 25 };
    const treeTopLeft = { x: x - 20, y: -h - 35 };
    const treeTop = { x: x, y: -h - 45 };
    const treeTopRight = { x: x + 20, y: -h - 35 };

    if (getDistance(cartBottomLeft, treeBottomLeft) < r1) return true;
    if (getDistance(cartBottomRight, treeBottomLeft) < r1) return true;
    if (getDistance(cartTopRight, treeBottomLeft) < r1) return true;

    if (getDistance(cartBottomLeft, treeLeft) < r2) return true;
    if (getDistance(cartBottomRight, treeLeft) < r2) return true;
    if (getDistance(cartTopRight, treeLeft) < r2) return true;

    if (getDistance(cartBottomLeft, treeTopLeft) < r3) return true;
    if (getDistance(cartBottomRight, treeTopLeft) < r3) return true;
    if (getDistance(cartTopRight, treeTopLeft) < r3) return true;

    if (getDistance(cartBottomLeft, treeTop) < r4) return true;
    if (getDistance(cartBottomRight, treeTop) < r4) return true;
    if (getDistance(cartTopRight, treeTop) < r4) return true;

    if (getDistance(cartBottomLeft, treeTopRight) < r5) return true;
    if (getDistance(cartBottomRight, treeTopRight) < r5) return true;
    if (getDistance(cartTopRight, treeTopRight) < r5) return true;
  }
}

function getDistance(point1, point2) {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
}


