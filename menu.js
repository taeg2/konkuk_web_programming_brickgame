var music = "";
var bgm = "";
var chooseColor = "green";
var mVol = 0;
var chMusic = new Audio();

var musicObj = {
  musicOO: "",

  //배경음악
  playMusic: function () {
    this.musicOO = new Audio(bgm);
    if (mVol == 0) {
      this.musicOO.volume = mVol;
    } else {
      this.musicOO.loop = true;
      if (bgm == "audio/MainMusic.mp3" || bgm == "audio/MainMusic2.mp3") {
        setTimeout(() => {
          this.musicOO.play();
        }, 10); // 3000 milliseconds = 3 seconds
      }
    }
  },

  //easy 난이도 배경음악
  playEasy: function () {
    this.musicOO = new Audio("audio/easyMusic.mp3");
    this.musicOO.volume = mVol;
    this.musicOO.loop = true;
    this.musicOO.play();
  },

  //normal 난이도 배경음악
  playNormal: function () {
    this.musicOO = new Audio("audio/normalMusic.mp3");
    this.musicOO.volume = mVol;
    this.musicOO.loop = true;
    this.musicOO.play();
  },

  //hard 난이도 배경음악
  playHard: function () {
    this.musicOO = new Audio("audio/hardMusic.mp3");
    this.musicOO.volume = mVol;
    this.musicOO.loop = true;
    this.musicOO.play();
  },

  //엔딩 음악
  playEnding: function () {
    this.musicOO = new Audio("audio/Ending.mp3");
    this.musicOO.volume = mVol;
    // this.musicOO.loop = true;
    this.musicOO.play();
  },

  //선택 시 효과음
  PlayChoose: function () {
    chMusic = new Audio("audio/chooseMp3.mp3");
    chMusic.volume = 0.8;
    if (mVol != 0) chMusic.play();
  },

  //게임 오버 음악
  playDeath: function () {
    // var musicO = new Audio("audio/GameOver.mp3");
    // musicO.loop = true;
    // musicO.play();
    this.musicOO = new Audio("audio/GameOver.mp3");
    this.musicOO.volume = mVol;
    this.musicOO.loop = true;
    this.musicOO.play();
  },

  hoverSound: function () {
    var hoverMusic = new Audio("audio/difHover.mp3");
    if (mVol != 0) hoverMusic.play();
  },

  //목숨 하나 잃을 때
  LifeMinusMusic: function () {
    var LifeMinusMusic = new Audio("audio/lifeMinus.mp3");
    if (mVol != 0) LifeMinusMusic.play();
  },

  //벽돌 효과음 0520 수정
  playBrick: function (e) {
    switch (e) {
      //일반 블럭 효과음
      case 0:
        var musicO = new Audio("audio/brick.mp3");
        if (mVol != 0) musicO.play();
        break;

      //공 분열
      case 1:
        var musicO = new Audio("audio/powerUp.mp3");
        if (mVol != 0) musicO.play();
        break;
      //확대
      case 2:
        var musicO = new Audio("audio/enlarge.mp3");
        if (mVol != 0) musicO.play();
        break;

      //빠르기
      case 3:
        var musicO = new Audio("audio/speed.mp3");
        if (mVol != 0) musicO.play();
        break;

      //특수 블럭
      case 4:
        var musicO = new Audio("audio/special.mp3");
        if (mVol != 0) musicO.play();
        break;

      default:
    }
  },

  //클리어 음악
  playClear: function () {
    this.musicOO = new Audio("audio/clear.mp3");
    this.musicOO.volume = mVol;
    this.musicOO.play();
  },

  //배경음악 정지
  stopMusic: function () {
    this.musicOO.pause();
    this.musicOO.currentTime = 0;
  },
  //배경음악 음소거
  muteMusic: function () {
    mVol = 0;
    this.musicOO.volume = mVol;
  },
  //배경음악 음소거 해제
  unmuteMusic: function () {
    mVol = 0.5;
    this.musicOO.volume = mVol;
  },
};

// 깜빡이게 하는 함수
function makeBlink(selector) {
  $(selector).each(function () {
    var ele = $(this);
    setInterval(function () {
      if (ele.css("visibility") == "hidden") {
        ele.css("visibility", "visible");
      } else {
        ele.css("visibility", "hidden");
      }
    }, 500);
  });
}

// 설정 메뉴
function setUpPage() {
  musicObj.PlayChoose();

  hideAll();
  $("#setUp").show();
  $("#backButton").show();

  var button1 = $("#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(1)");
  var button2 = $("#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(2)");
  var button3 = $("#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(3)");
  var button4 = $("#setUp .chooseDiv:nth-of-type(2) div.choose:nth-of-type(1)");
  var button5 = $("#setUp .chooseDiv:nth-of-type(2) div.choose:nth-of-type(2)");

  if (music == "1") {
    button1.css("background-color", "white");
    button2.css("background-color", "gray");
  } else if (music == "2") {
    button2.css("background-color", "gray");
    button2.css("background-color", "white");
  }

  if (chooseColor == "green") {
    button4.css("background-color", "white");
    button5.css("background-color", "gray");
  } else if (chooseColor == "blue") {
    button5.css("background-color", "white");
    button4.css("background-color", "gray");
  }

  button1.on("click", function () {
    if ($("#volume").attr("src") != "img/btn/mute.png") {
      music = "1";
      musicObj.stopMusic();
      bgm = "audio/MainMusic.mp3";
      musicObj.playMusic();
      button1.css("background-color", "white");
      button2.css("background-color", "gray");
    }
  });

  button2.on("click", function () {
    if ($("#volume").attr("src") != "img/btn/mute.png") {
      music = "2";
      musicObj.stopMusic();
      bgm = "audio/MainMusic2.mp3";
      musicObj.playMusic();
      button2.css("background-color", "white");
      button1.css("background-color", "gray");
    }
  });

  button3.on("click", function () {
    musicObj.stopMusic();
    musicObj.playMusic();
  });

  button4.on("click", function () {
    chooseColor = "green";
    musicObj.PlayChoose();
    button4.css("background-color", "white");
    button5.css("background-color", "gray");
  });

  button5.on("click", function () {
    chooseColor = "blue";
    musicObj.PlayChoose();
    button5.css("background-color", "white");
    button4.css("background-color", "gray");
  });
}

const content =
  "어느 날, 평화롭던 지구에 외계인이 침략한다.\n 악!!! 살려 주세요!!\n 그야말로 지구는 현재 혼돈 상태\n 지구를 구하기 위해 여러 나라가 힘쓰지만\n 그들을 제압하는 건 무리였고..\n그들을 제압하기 위해 KU 컴퓨터공학부 학생 4명이\n 특수한 무기를 개발하는데\n 과연 그들이 모두를 제압하고\n 지구를 외계인으로부터 구해 낼 수 있을까?";
var text;
var i;
var intervalId; // 변수 추가
//0524 수정:스킵 기능을 위해 content, text, i, intervalid 전역으로 변경
function storyLine() {
  i = 0;
  hideAll(); //0524 수정:일단 싹 다 숨긴다음 show 하기
  $("#storyLine").show();
  $("#storyText").empty(); // #storyText 내용 초기화

  $("#skipButton").show();
  function typing() {
    let txt = content[i++];
    text.innerHTML += txt === "\n" ? "<br/>" : txt;
    if (i >= content.length) {
      // 조건 수정
      clearInterval(intervalId); // 반복 멈춤
      $("#startButton").show();
      $("#skipButton").hide(); // 0524 수정:게임 시작 버튼 뜨면 스킵 버튼 숨기기
    }
  }

  intervalId = setInterval(typing, 80); // intervalId에 setInterval의 반환값 저장
}

//도움말 페이지
function helpPage() {
  //0520
  musicObj.PlayChoose();

  hideAll();
  $("#help").show();
  $("#backButton").show();
}

function mainPage() {
  musicObj.PlayChoose();
  musicObj.stopMusic();
  musicObj.playMusic();

  resetAll();
  totalScore = 0; // 점수 초기화 추가
  isCountdownRunning = false; // 카운트다운 상태 초기화 추가

  hideAll();
  $("#mainMenu").show();
}


//난이도 선택 페이지
function difficultyPage() {
  //0520
  musicObj.PlayChoose();

  hideAll();
  $("#difficulty").show();
  $("#backButton").show();
}

//인게임 화면
function playPage() {
  hideAll();
  $("#stopButton").show();
  $("canvas").show();
}

//게임 오버 화면
function gameOverPage() {
  
  musicObj.stopMusic();
  musicObj.playDeath();
  hideAll();
  $("#gameOver").fadeIn(1500).css({ display: "flex" });
  $(".backToMain").show();
  $("#backButton").hide();
  $("#stopButton").hide();
  
}

//게임 클리어 화면
function gameClearPage() {
  musicObj.stopMusic();
  musicObj.playClear();
  $(".backToMain").show();
  $("#backButton").hide();
  $("#stopButton").hide();
}

// 05 25 추가된 부분 gameAllClearPage 추가함
function gameAllClear() {
  hideAll();

  $("#gameAllClear").show();
  $("#gameAllClearText").empty(); // #storyText 내용 초기화
  const content = "건국대 학생들의 노력 덕분에 지구를 지켜낼 수 있었습니다. \n 당신들은 지구의 영웅입니다.\n 감사합니다!!";
  const text = document.querySelector("#gameAllClearText");
  let i = 0;
  var loop;

  function typing() {
    let txt = content[i++];
    text.innerHTML += txt === "\n" ? "<br/>" : txt;
    if (i >= content.length) {
      $("#allClearMenu").show();
      clearInterval(loop);
    }
  }
  loop = setInterval(typing, 80);
  // 캔버스의 위치와 크기 계산
  var canvas = document.getElementById("myCanvas");
  var rect = canvas.getBoundingClientRect();
}

function loadAllClearPage() {
  hideAll();
  gameClearPage();
  $("#sunClear").show();
}
// 05 25 추가된 부분 여기까지

//페이지 모두 숨기기
function hideAll() {
  //0524 수정:클래스에 속하는 것들은 클래스 단위로 처리
  $("#gameAllClear").hide();
  $(".menu").hide();
  $(".backToMain").hide();
  $("canvas").hide();
  //0524 수정:목숨 표시, 시작 버튼 숨기기 추가
  $("#lives").hide();
  $("#startButton").hide();
  $("#skipButton").hide();
}

function vControl() {
  var soundButton = $(
    "#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(3)"
  );
  //음소거 해제
  if ($("#volume").attr("src") == "img/btn/mute.png") {
    $("#volume").attr("src", "img/btn/sound.png");
    soundButton.css("background-color", "white");
    musicObj.unmuteMusic();
  }
  //음소거
  else if ($("#volume").attr("src") == "img/btn/sound.png") {
    $("#volume").attr("src", "img/btn/mute.png");
    soundButton.css("background-color", "white");
    musicObj.muteMusic();
  }
}
