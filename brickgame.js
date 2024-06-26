var canvas;
var context;
var totalScore = 0; // 전체 스코어

// 벽돌 정보
var brick = [];
var brickRow; // 벽돌 행 수
var brickColumn; // 벽돌 열 수
var brickWidth;
var brickHeight;
var brickGapX = 5; // 벽돌 사이의 가로 간격
var brickGapY = 5; // 벽돌 사이의 세로 간격
var isBrickMoving = false; // 벽돌 하강 여부
var brickVy = 0.1; // 벽돌이 내려오는 속도

// 패들
const pw = 100;
var paddleWidth = pw; // 너비
var paddleHeight = 10; // 높이
var paddleX = 0; // 초기 x 좌표
var paddleY = 520; // 초기 y 좌표 (캔버스 바닥에서 약간 위)

// 공 0526
var balls = []; // 공의 초기 위치와 속도
const ballR = 10;
var bullet = { x: 400, y: 0, r: 10, vX: 3, vY: 3 }; // 보스의 공격의 초기 위치와 속도
var isBulletMoving = false;
var ballTop;
var ballBottom;
var ballLeft;
var ballRight;

// 보스 정보
const bossSize = 60;
const bossVx = 1;
var bossBrick = {
  status: 0,
  x: 395,
  y: 0,
  width: bossSize,
  height: bossSize,
  vX: bossVx,
  isMoving: false,
};
var drawInterval; // 게임 화면 갱신 인터벌
var countdownInterval; // 카운트 인터벌

var isGameRunning = false; // 게임 실행 상태 추적 변수
var isGameAllClear = false;
var gameLevel;
var lives = 3; // 목숨 변수

// 이미지 설정
// 움직이는 배경 별 이미지
var starsImg = new Image();
starsImg.src = "img/bg/stars.jpg";
var starsStartY; // 이미지를 어느 위치부터 출발시킬지
var starsX = 0;
var starsY;
var starsVx = 1;
var starsVy = 1;

// 공 디자인
var bulletImg = new Image();
bulletImg.src = "img/ball/bullet.png";

// 벽돌 이미지
var brickImg = [];
brickImg[0] = new Image();
brickImg[1] = new Image();
brickImg[0].src = "img/brick/brick.png";
brickImg[1].src = "img/brick/brick.png";
var bossImg = new Image();

var redImg = new Image();
var redImg1 = new Image();
redImg.src = "img/brick/red.png";
redImg1.src = "img/brick/red1.png";

var blueImg = new Image();
var blueImg1 = new Image();
blueImg.src = "img/brick/blue.png";
blueImg1.src = "img/brick/blue1.png";

var greenImg = new Image();
var greenImg1 = new Image();
greenImg.src = "img/brick/green.png";
greenImg1.src = "img/brick/green1.png";

var yellowImg = new Image();
var yellowImg1 = new Image();
yellowImg.src = "img/brick/yellow.png";
yellowImg1.src = "img/brick/yellow1.png";
var isCountdownRunning = false; // 카운트다운 상태 변수 추가

//기타
var meltGameST;
var isGameFrozen = false;

$(document).ready(function () {
  text = document.querySelector("#storyText");
  $("#lives").hide();

  volume.onclick = vControl;
  musicObj.playMusic();

  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");

  starsStartY = -canvas.height;
  starsY = starsStartY;
  makeBlink("#coin");
  makeBlink(".explain");
  updateLives();

  $(".dif").hover(function () {
    musicObj.hoverSound();
  });

  // 클릭 이벤트
  var volumeElement = document.getElementById("volume");
  volumeElement.onclick = vControl;

  $("#mainMenu div h1").eq(0).on("click", storyLine);
  $("#startButton").click(difficultyPage);
  $("#skipButton").click(function () {
    clearInterval(intervalId); // 타이핑 작업 중단
    $("#skipButton").hide();
    while (i < content.length) {
      let txt = content[i++];
      text.innerHTML += txt === "\n" ? "<br/>" : txt;
    }
    $("#startButton").show();
  });

  $("#mainMenu div h1").eq(1).on("click", setUpPage);
  $("#mainMenu div h1").eq(2).on("click", helpPage);
  $(".backToMain").on("click", backToMainMenu);
  $("#stopButton").on("click", function () {
    clearInterval(countdownInterval); //0526
    stopGame();
    resetAll();
  });

  $(".replay").on("click", function () {
    stage(gameLevel);
  });
  $(".nextStage").on("click", function () {
    console.log(`Start next stage`);
    stage(++gameLevel);
  });

  bossBrick.x = canvas.width / 2;

  $(".dif h1:contains('EARTH'), .dif img#easy").click(function () {
    stage(1);
  });
  $(".dif h1:contains('MOON'), .dif img#normal").click(function () {
    stage(2);
  });
  $(".dif h1:contains('SUN'), .dif img#hard").click(function () {
    stage(3);
  });

  $(document).mousemove(function (e) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;

    // 패들이 화면 밖으로 나가지 않도록 제한
    if (mouseX < paddleWidth / 2) {
      mouseX = paddleWidth / 2;
    } else if (mouseX > canvas.width - paddleWidth / 2) {
      mouseX = canvas.width - paddleWidth / 2;
    }

    // 이전 패들 위치 지우기
    context.clearRect(
      paddleX - paddleWidth / 2 - 1, // 조금 더 크게 지워줌
      paddleY,
      paddleWidth + 2,
      paddleHeight
    );
    if (isGameRunning) {
      context.fillStyle = "black";
      context.fillRect(
        paddleX - paddleWidth / 2 - 1,
        paddleY,
        paddleWidth + 2,
        paddleHeight
      );
    }
    paddleX = mouseX; // 마우스 위치에 따라 패들 이동
    // 새로운 패들 위치 그리기
    drawPaddle();
  });
});

function stage(n) {
  console.log(`Current stage:${n}`);
  gameLevel = n;
  setDifficulty(n); // 단계 설정
  reset();
  switch (n) {
    case 1:
      bossImg.src = "img/boss/boss1.png";
      musicObj.stopMusic();
      musicObj.playEasy();
      bossBrick.isMoving = false; // 보스 이동 상태 업데이트
      break;
    case 2:
      bossImg.src = "img/boss/boss2.png";
      bossBrick.isMoving = true;
      musicObj.stopMusic();
      musicObj.playNormal();
      break;
    case 3:
      bossImg.src = "img/boss/boss3.png";
      bossBrick.isMoving = true;
      isBulletMoving = true;
      musicObj.stopMusic();
      musicObj.playHard();
      break;
    default:
  }
  playPage();
  startCountdown(); // 게임 시작 전에 카운트다운 시작
}

function setDifficulty(level) {
  if (level === 1) {
    brickRow = 3;
    brickColumn = 6;
    balls = [{ x: 400, y: 300, r: ballR, vX: 3, vY: 3 }]; // 난이도 1의 초기 공 속도
  } else if (level === 2) {
    brickRow = 4;
    brickColumn = 7;
    balls = [{ x: 400, y: 300, r: ballR, vX: 4, vY: 4 }]; // 난이도 2의 초기 공 속도
  } else if (level === 3) {
    brickRow = 5;
    brickColumn = 8;
    balls = [{ x: 400, y: 300, r: ballR, vX: 5, vY: 5 }];
    bullet = {
      x: bossBrick.x + bossBrick.width / 2,
      y: bossBrick.y + bossBrick.height,
      r: 10,
      vX: 3,
      vY: 3,
    }; // 난이도 3의 초기 공과 보스 공격 속도
  }

  brickWidth = (canvas.width - brickGapX * (brickColumn + 1)) / brickColumn;
  brickHeight = (canvas.height / 4 - brickGapY * (brickRow + 1)) / brickRow + 5;
  // bossBrick.width = brickHeight;
  // bossBrick.height = brickHeight;
}

function reset() {
  brick = [];
  for (let i = 0; i < brickRow; i++) {
    brick[i] = [];
    for (let j = 0; j < brickColumn; j++) {
      brick[i][j] = {
        x: brickGapX + j * (brickWidth + brickGapX),
        y: brickGapY + (i + 1) * (brickHeight + brickGapY),
        status: 1,
        powerUp: false,
        enlarge: false,
        extendPaddle: false,
        freeze: false, // 특수 능력 추가
        img: brickImg[Math.floor(Math.random() * 2)],
      };
      if (Math.random() < 0.05) {
        brick[i][j].powerUp = true;
      }
      if (Math.random() < 0.05) {
        brick[i][j].enlarge = true;
      }
      if (Math.random() < 0.05) {
        brick[i][j].extendPaddle = true;
      }
      if (Math.random() < 0.05) {
        brick[i][j].freeze = true;
      }
    }
  }
  resetBalls();
  resetBullets();
  resetBoss();
  bossBrick.status = 1;
  paddleWidth = pw;
  lives = 3; // 목숨 초기화
  updateLives(); // 목숨 UI 초기화
  $("#lives").hide(); // 게임을 시작할 때까지 목숨 표시 숨김
}

var initialBallSpeed = { vX: 3, vY: 3 };

function resetBalls() {
  //0526
  console.log(`공 리스폰`);
  let minAngle = Math.PI / 6; // 30도
  let maxAngle = Math.PI / 2; // 90도
  let randomAngle = Math.random() * (maxAngle - minAngle) + minAngle; // 30도에서 90도 사이의 각도
  let speed = Math.sqrt(initialBallSpeed.vX ** 2 + initialBallSpeed.vY ** 2);
  let vX = Math.cos(randomAngle) * speed * (Math.random() < 0.5 ? -1 : 1); // x 방향 속도 랜덤
  let vY = -Math.abs(Math.sin(randomAngle) * speed); // y 방향은 항상 위쪽으로
  balls = [
    {
      x: paddleX, // 패들 중앙으로 설정
      y: paddleY - 10, // 패들 위에 위치
      r: ballR,
      vX: vX,
      vY: vY,
    },
  ];
}

function resetBullets() {
  let minAngleL = Math.atan(
    (canvas.height - bossBrick.height) / (bossBrick.x + bossBrick.width / 2)
  );
  let minAngleR = Math.atan(
    (canvas.height - bossBrick.height) /
      (canvas.width - (bossBrick.x + bossBrick.width / 2))
  );
  console.log(`총알의 왼쪽 최소각:${minAngleL}`);
  console.log(`총알의 오른쪽 최소각:${minAngleR}`);

  let bulletAngle =
    Math.random() * (Math.PI - minAngleR - minAngleL) + minAngleR;
  console.log(`총알의 각도:${bulletAngle}`);

  let speed = Math.sqrt(bullet.vX * bullet.vX + bullet.vY * bullet.vY);
  console.log(`총알 speed:${speed}`);
  bullet = {
    x: bossBrick.x + bossBrick.width / 2,
    y: bossBrick.y + bossBrick.height,
    r: 10,
    vX: Math.cos(bulletAngle) * speed,
    vY: Math.sin(bulletAngle) * speed,
  };
}

function resetBoss() {
  bossBrick.x = canvas.width / 2 - bossBrick.width / 2;
  bossBrick.y = 0;
  bossBrick.vX = bossVx;
  bossBrick.isMoving = false;
}

function draw() {
  if (!isGameRunning) {
    console(`그리기 거부`);
    return; // 게임이 중지되면 그리지 않음
  }
  context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
  drawStars();
  drawBricks();
  drawBoss();
  drawBall();
  if (gameLevel == 3) drawBullet();
  drawPaddle();
  drawScore(); // 스코어 그리기
}

let currentRedImg = redImg;
let currentBlueImg = blueImg;
let currentGreenImg = greenImg;
let currentYellowImg = yellowImg;

let toggle = true;

setInterval(() => {
  toggle = !toggle;
  currentRedImg = toggle ? redImg : redImg1;
  currentBlueImg = toggle ? blueImg : blueImg1;
  currentGreenImg = toggle ? greenImg : greenImg1;
  currentYellowImg = toggle ? yellowImg : yellowImg1;
}, 1000);

function drawStars() {
  context.drawImage(starsImg, starsX, starsY, canvas.width, canvas.height);
  context.drawImage(
    starsImg,
    starsX,
    starsY + canvas.height,
    canvas.width,
    canvas.height
  );
  calStars();
}

function calStars() {
  starsY += starsVy;
  if (starsY == 0) starsY = starsStartY;
}

function drawBricks() {
  for (let i = 0; i < brickRow; i++) {
    for (let j = 0; j < brickColumn; j++) {
      if (brick[i][j] && brick[i][j].status == 1) {
        if (brick[i][j].powerUp) {
          context.drawImage(
            currentRedImg,
            brick[i][j].x,
            brick[i][j].y,
            brickWidth,
            brickHeight
          );
        } else if (brick[i][j].enlarge) {
          context.drawImage(
            currentBlueImg,
            brick[i][j].x,
            brick[i][j].y,
            brickWidth,
            brickHeight
          );
        } else if (brick[i][j].extendPaddle) {
          context.drawImage(
            currentGreenImg,
            brick[i][j].x,
            brick[i][j].y,
            brickWidth,
            brickHeight
          );
        } else if (brick[i][j].freeze) {
          context.drawImage(
            currentYellowImg,
            brick[i][j].x,
            brick[i][j].y,
            brickWidth,
            brickHeight
          );
        } else {
          context.drawImage(
            brick[i][j].img,
            brick[i][j].x,
            brick[i][j].y,
            brickWidth,
            brickHeight
          );
        }
      }
    }
  }
  calBricks();
}

function calBricks() {
  if (!isGameRunning) return;
  if (isBrickMoving) {
    for (let i = 0; i < brickRow; i++) {
      for (let j = 0; j < brickColumn; j++) {
        brick[i][j].y += brickVy + gameLevel * 0.02;
        if (brick[i][j].status == 1 && brick[i][j].y + brickHeight >= paddleY) {
          //0526
          console.log(`벽돌에 깔림`);
          gameOver();
        }
      }
    }
  }
}

function drawBoss() {
  if (bossBrick.status == 1) {
    context.drawImage(
      bossImg,
      bossBrick.x,
      bossBrick.y,
      bossBrick.width,
      bossBrick.height
    );
    if (bossBrick.isMoving == true) calBoss();
  }
}

function calBoss() {
  bossBrick.x += bossBrick.vX;
  if (
    bossBrick.x + bossBrick.vX + bossBrick.width > canvas.width ||
    bossBrick.x + bossBrick.vX < 0
  ) {
    bossBrick.vX *= -1;
  }
}

function drawBall() {
  balls.forEach((ball) => {
    let gradient = context.createRadialGradient(
      ball.x,
      ball.y,
      ball.r * 0.1,
      ball.x,
      ball.y,
      ball.r
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.5, "lightyellow");
    gradient.addColorStop(1, "yellow");
    context.beginPath();
    context.arc(ball.x, ball.y, ball.r * 0.8, 0, 2 * Math.PI);
    context.fillStyle = gradient;
    context.fill();
    calculate(ball);
  });
}

function calculate(ball) {
  ball.x += ball.vX;
  ball.y += ball.vY;
  //0526
  ballTop = ball.y - ball.r;
  ballBottom = ball.y + ball.r;
  ballLeft = ball.x - ball.r;
  ballRight = ball.x + ball.r;

  checkBossCollision(ball);
  checkWallCollision(ball);
  checkPaddleCollision(ball);
  checkBrickCollision(ball);
}

function drawBullet() {
  let w = bulletImg.width / 8;
  let h = bulletImg.height / 8;
  context.drawImage(bulletImg, bullet.x - w / 2, bullet.y - h / 2, w, h);
  calBul();
}

function calBul() {
  if (isBulletMoving) {
    bullet.x += bullet.vX;
    bullet.y += bullet.vY;
  }
  checkBulFloorColl();
  checkBulPaddleColl();
}

function checkBulFloorColl() {
  if (
    //0526
    bullet.y + bullet.vY - bullet.r >
    canvas.height
  ) {
    console.log(`총알 추락`);
    resetBullets();
  }
}

function checkBulPaddleColl() {
  let l = paddleX - paddleWidth / 2;
  let r = paddleX + paddleWidth / 2;
  if (
    //0526
    bullet.x + bullet.vX + bullet.r >= l &&
    bullet.x + bullet.vX - bullet.r <= r &&
    bullet.y + bullet.vY + bullet.r >= paddleY &&
    bullet.y + bullet.vY - bullet.r <= paddleY
  ) {
    lives--; // 목숨을 하나 줄임
    musicObj.LifeMinusMusic();
    updateLives(); // 목숨 UI 업데이트
    console.log("총알 맞음!");
    resetBullets();
    if (lives === 0) {
      gameOver();
    }
  }
}

function drawPaddle() {
  context.fillStyle = chooseColor;
  context.fillRect(
    paddleX - paddleWidth / 2,
    paddleY,
    paddleWidth,
    paddleHeight
  );
  // 카운트다운 중이 아닐 때만 비행기 이미지를 그림
  if (!isCountdownRunning) {
    let img = new Image();
    img.src = `img/user/${chooseColor}.png`;
    let imgWidth = 50;
    let imgHeight = 50;
    context.drawImage(
      img,
      paddleX - imgWidth / 2,
      paddleY + paddleHeight,
      imgWidth,
      imgHeight
    );
  }
  context.closePath();
}

function drawScore() {
  context.font = "16px Arial";
  context.fillStyle = "red";
  context.textAlign = "right";
  context.fillText("Score: " + totalScore, canvas.width - 10, 20); // 화면 오른쪽 상단에 스코어 표시
}

function checkBrickCollision(ball) {
  for (let i = 0; i < brickRow; i++) {
    for (let j = 0; j < brickColumn; j++) {
      if (brick[i][j] && brick[i][j].status == 1) {
        let b = brick[i][j];
        let brickTop = b.y;
        let brickBottom = b.y + brickHeight;
        let brickLeft = b.x;
        let brickRight = b.x + brickWidth;

        if (
          ballRight + ball.vX >= brickLeft &&
          ballLeft + ball.vX <= brickRight &&
          ballBottom + ball.vY >= brickTop &&
          ballTop + ball.vY <= brickBottom
        ) {
          brick[i][j].status = 0;
          console.log(`[${i}][${j}] 제거`);
          totalScore += 100; // 블록을 부술 때마다 100점 추가
          if (
            //밑변 충돌
            ball.x + ball.vX <= brickRight + ball.r / Math.sqrt(2) &&
            ball.x + ball.vX >= brickLeft - ball.r / Math.sqrt(2)
          ) {
            ball.vY = -ball.vY;
            console.log(`[${i}][${j}] 밑변 충돌`);
          } else if (
            //옆 충돌
            ball.x + ball.vX > brickRight + ball.r / Math.sqrt(2) ||
            ball.x + ball.vX < brickLeft - ball.r / Math.sqrt(2)
          ) {
            if (
              ballLeft + ball.vX <= brickRight &&
              ballRight + ball.vX >= brickLeft
            ) {
              ball.vX = -ball.vX;
              console.log(`[${i}][${j}] 옆 충돌`);
            } else {
              console.log(`벽돌 충돌 오류`);
            }
          } else {
            console.log(`벽돌 충돌 오류`);
          }
          //아이템 벽돌일 때
          if (b.powerUp) {
            //공 분열
            musicObj.playBrick(1);
            balls.push({
              x: ball.x,
              y: ball.y,
              r: ball.r,
              vX: ball.vX,
              vY: ball.vY,
            });
          } else if (b.enlarge) {
            //공 크기 증가
            musicObj.playBrick(2);
            balls.forEach((ball) => {
              ball.r *= 1.5;
            });
          } else if (b.extendPaddle) {
            musicObj.playBrick(3);
            enlargePaddle();
          } else if (b.freeze) {
            musicObj.playBrick(4);
            if (isGameFrozen) {
              clearTimeout(meltGameST);
            }
            freezeGame();
          } else musicObj.playBrick(0);
        }
      }
    }
  }
}

function updateLives() {
  var livesContainer = $("#lives");
  livesContainer.empty();
  for (var i = 0; i < lives; i++) {
    livesContainer.append('<img src="img/life.png" class="life" alt="Life">');
  }
}

function checkWallCollision(ball) {
  if (ballTop + ball.vY > canvas.height) {
    balls = balls.filter((b) => b !== ball);
    if (balls.length === 0) {
      lives--; // 목숨을 하나 줄임
      console.log("공 추락! 목숨 감소");
      updateLives(); // 목숨 UI 업데이트
      if (lives === 0) {
        gameOver();
      } else {
        setTimeout(resetBalls, 1000); // 남은 목숨이 있을 때는 공을 초기화
      }
    }
  }
  if (ballTop + ball.vY <= 0) {
    ball.vY = -ball.vY;
  }
  if (ballLeft + ball.vX <= 0 || ballRight + ball.vX >= canvas.width) {
    ball.vX = -ball.vX;
  }
}

function checkPaddleCollision(ball) {
  //0526
  let l = paddleX - paddleWidth / 2;
  let r = paddleX + paddleWidth / 2;
  let pTop = paddleY;
  let pBottom = paddleY + paddleHeight;

  // 공의 다음 위치를 계산
  let nextBallLeft = ball.x + ball.vX - ball.r;
  let nextBallRight = ball.x + ball.vX + ball.r;
  let nextBallTop = ball.y + ball.vY - ball.r;
  let nextBallBottom = ball.y + ball.vY + ball.r;

  // 공이 패들의 윗면에 맞았을 때 0526 - 3

  // 꼭짓점 충돌하는 상황은 분리 안 해 줘도 될까..?
  // if(
  //   ball.y + ball.vY <= pTop &&
  //   ball.y + ball.vY + ball.r >= pTop &&
  //   ball.x + ball.vX <= l &&
  //   ball.x + ball.vX + ball.r >= l &&
  // )
  if (
    nextBallRight >= l &&
    nextBallLeft <= r &&
    nextBallBottom >= pTop &&
    ball.y + ball.vY < (pBottom + pTop) / 2
  ) {
    let relativePosition = (ball.x - paddleX) / (paddleWidth / 2 + ball.r); // 0526-3
    let bounceAngle = relativePosition * (Math.PI / 3); // -60 ~ 60도 0526-3
    let speed = Math.sqrt(ball.vX * ball.vX + ball.vY * ball.vY);
    ball.vX = speed * Math.sin(bounceAngle);
    ball.vY = -speed * Math.cos(bounceAngle);
    ball.y = pTop - ball.r; // 공이 패들 위에 위치하도록 설정
    console.log(`공과 패들 윗면 충돌! 각도:${bounceAngle / Math.PI} * PI`);
    console.log(`패들(${paddleX.toFixed(2)},${paddleY.toFixed(2)})`);
    return;
  }

  // 공이 패들의 왼쪽 측면에 맞았을 때
  if (
    nextBallRight >= l &&
    ball.x + ball.vX < l &&
    ball.y + ball.vY > pTop &&
    ball.y + ball.vY < pBottom
  ) {
    ball.vX = -Math.abs(ball.vX);
    ball.x = l - ball.r; // 공이 패들 왼쪽에 위치하도록 설정
    return;
  }

  // 공이 패들의 오른쪽 측면에 맞았을 때
  if (
    nextBallLeft <= r &&
    ball.x + ball.vX > r &&
    ball.y + ball.vY > pTop &&
    ball.y + ball.vY < pBottom
  ) {
    ball.vX = Math.abs(ball.vX);
    ball.x = r + ball.r; // 공이 패들 오른쪽에 위치하도록 설정
    return;
  }
}

function updateScoreboard(playerName, finalScore) {
  var scoreList = document.getElementById("scoreList");
  var newScoreEntry = document.createElement("li");
  newScoreEntry.textContent = `${playerName}: ${finalScore}`;
  scoreList.appendChild(newScoreEntry);
}

function enlargePaddle() {
  var centerX = paddleX;
  paddleWidth *= 1.5;
  paddleX = centerX;
}

function checkBossCollision(ball) {
  if (bossBrick.status == 1) {
    let brickTop = bossBrick.y;
    let brickBottom = bossBrick.y + bossBrick.height;
    let brickLeft = bossBrick.x;
    let brickRight = bossBrick.x + bossBrick.width;

    if (
      ballRight + ball.vX >= brickLeft &&
      ballLeft + ball.vX <= brickRight &&
      ballBottom + ball.vY >= brickTop &&
      ballTop + ball.vY <= brickBottom
    ) {
      bossBrick.status = 0;
      totalScore += 1000; // 보스를 처치하면 1000점 추가
      reset();
      hideAll();
      switch (gameLevel) {
        case 1:
          $("#earthClear").fadeIn(1500).css({ display: "flex" });
          gameClear();
          break;
        case 2:
          $("#moonClear").fadeIn(1500).css({ display: "flex" });
          gameClear();
          break;
        case 3:
          $("#sunClear").fadeIn(1500).css({ display: "flex" });
          stopGame();
          isGameAllClear = true;
          showNameInputScreen();
          break;
        default:
      }
    }
  }
}

function freezeGame() {
  isGameFrozen = true;
  console.log(`시간 정지`);

  bossBrick.vX = 0;
  isBulletMoving = false;
  isBrickMoving = false;

  meltGameST = setTimeout(() => {
    isGameFrozen = false;
    if (isGameRunning) {
      isBrickMoving = true;
      if (bossBrick.isMoving) {
        bossBrick.vX = bossVx;
        if (gameLevel == 3) {
          isBulletMoving = true;
          console.log(`보스 공격 재개`);
        }
      }
    }
  }, 3000);
}

function startGame() {
  isGameRunning = true;
  $("#lives").show(); // 게임 시작 시 목숨 표시
  context.clearRect(0, 0, canvas.width, canvas.height); // 게임 시작 시 캔버스 클리어
  drawInterval = setInterval(draw, 10);
  isBrickMoving = true;
}

function stopGame() {
  isGameRunning = false;
  console.log(`그리기 중지`);
  clearInterval(drawInterval);
  isBrickMoving = false;
  bossBrick.isMoving = false;
  bullet = {
    x: bossBrick.x + bossBrick.width / 2,
    y: bossBrick.y,
    r: 10,
    vX: 3,
    vY: 3,
  };
  balls = [{ x: 400, y: 300, r: ballR, vX: 3, vY: 3 }];
  context.clearRect(0, 0, canvas.width, canvas.height); // 게임 종료 시 캔버스 클리어
}

// 게임 오버 처리
function gameOver() {
  stopGame();
  isGameCleared = false;
  showNameInputScreen();
}

function gameClear() {
  stopGame();
  isGameCleared = true;
  // showNameInputScreen();
}

// 이름 입력 화면 표시
function showNameInputScreen() {
  hideAll();
  $("#nameInputScreen").show();
}

// 이름 입력 후 스코어보드 업데이트
function submitScore() {
  var playerName = document.getElementById("playerName").value;
  updateScoreboard(playerName, totalScore);
  $("#nameInputScreen").hide();

  // 현재 스코어 상태를 기준으로 다음 화면을 결정
  if (isGameAllClear) {
    gameAllClear(); // 전체 클리어 시 호출
  } else {
    if (isGameCleared) {
      gameClearPage();
    } else {
      gameOverPage();
    }
  }

  resetAll(); // 게임 상태를 초기화
}

function startCountdown() {
  var countdownElement = document.getElementById("countdown");
  countdownElement.style.display = "block";
  var count = 3;
  countdownElement.innerText = count;

  isCountdownRunning = true; // 카운트다운 시작

  // 카운트다운 동안 캔버스를 클리어
  context.clearRect(0, 0, canvas.width, canvas.height);
  countdownInterval = setInterval(function () {
    countdownElement.innerText = --count;
    //count--;0526
    if (count < 1) {
      //0526
      clearInterval(countdownInterval);
      balls[0].x = paddleX;
      countdownElement.style.display = "none";
      isCountdownRunning = false; // 카운트다운 종료
      startGame();
    }
  }, 1000);
}

// 변수 초기화 함수
function resetAll() {
  clearInterval(drawInterval); // 인터벌 중지
  totalScore = 0;

  lives = 3;
  balls = [];
  bullet = { x: 400, y: 0, r: 10, vX: 3, vY: 3 };

  console.log(`resetAll() 총알 초기화`);

  bossBrick = {
    status: 0,
    x: 395,
    y: 0,
    width: bossSize,
    height: bossSize,
    vX: bossVx,
    isMoving: false,
  };
  brick = [];
  isBrickMoving = false;
  brickVy = 0.1;
  paddleWidth = pw;
  paddleX = 0;
  paddleY = 520;
  isGameRunning = false;
  isGameAllClear = false;
  isCountdownRunning = false;
  $("#lives").hide();
  context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
}

// 메인 메뉴로 돌아가는 함수
function backToMainMenu() {
  resetAll();
  mainPage(); // 기존 메인 페이지로 돌아가는 함수 호출
}
