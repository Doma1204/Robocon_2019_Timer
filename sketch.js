let timer;
let team;
let isOneMinute = true;

let a = [];

function setup() {
  timerText = document.getElementById("Timer");
  startStopText = document.getElementById("StartBtn")
  scoreText = document.getElementById("Score");
  logText = document.getElementById("logText");
  retryText = document.getElementById("retryBtn");

  startPauseBtn = document.getElementById("startPauseBtn");
  stopClearBtn = document.getElementById("stopClearBtn");

  MR1Btn1 = document.getElementById("MR1Btn1");
  MR1Btn2 = document.getElementById("MR1Btn2");
  MR1Btn3 = document.getElementById("MR1Btn3");
  MR2Btn = document.getElementById("MR2Btn");

  $("input[name*='time-format']").click(updateTimeFormat);
  $("input[name*='field']").click(updateFieldColor);
  $("#prep-time").click(function(){
    isOneMinute = this.checked;
    timer.setTime(isOneMinute ? 1 : 3);
    writeTimer(timer);
  });

  timer = new Timer();
  team = new Team();
  timer.setTime(1);
  timer.setTimerCallback(writeTimer);
  timer.setTimerEndCallback(timerEnd);

  reset();
}

function reset() {
  // $("#start-btn").attr("disabled", "false");
  document.getElementById("start-btn").disabled = false;
  $(".timer-setting").removeClass("disappear");
  $("#history").empty();
  timer.resetTimer();
  writeTimer(timer);
  team.reset();
  updateMR1Btn();
  updateMR2Btn();
  updateRetryBtn();
  updateScore();
  updateRetryNumber();
  updateViolationNumber();
}

function startPauseBtnOnClick() {
  if (timer.state == TimerState.START) {
    $("#start-btn").html("Start");
    timer.pauseTimer();
  } else {
    $("#start-btn").html("Pause");
    $("#reset-btn").html("Stop");
    timer.startTimer();
    $(".timer-setting").addClass("disappear");
  }
}

function stopClearBtnOnClick() {
  if (timer.state == TimerState.STOP) {
    reset();
  } else {
    $("#start-btn").attr("disabled", "true");
    $("#start-btn").html("Start");
    $("#reset-btn").html("Clear");
    timer.stopTimer();
  }
}

function retryBtnOnClick() {
  if (timer.state != TimerState.START || isOneMinute) return;
  team.toggleRetry();
  updateRetryBtn();
  updateRetryNumber();
  updateHistory();
}

function violationBtnOnClick() {
  if (timer.state != TimerState.START || isOneMinute) return;
  team.violation();
  updateRetryBtn();
  updateRetryNumber();
  updateViolationNumber();
  updateHistory();
}

function undoBtnOnClick() {
  if (timer.state != TimerState.START || isOneMinute) return;
  team.undo();
  updateMR1Btn();
  updateMR2Btn();
  updateRetryBtn();
  updateScore();
  updateRetryNumber();
  updateViolationNumber();
  $("#history tr:last").remove();
  $(".history").scrollTop(99999999);
}

function MR1Btn1OnClick() {
  if (timer.state != TimerState.START || isOneMinute) return;
  if (!team.completeTaskMR1(Shagai)) return;
  updateMR1Btn();
  updateMR2Btn();
  updateScore();
  updateHistory();
}

function MR1Btn2OnClick() {
  if (timer.state != TimerState.START || isOneMinute) return;
  if (!team.completeTaskMR1(Camel)) return;
  updateMR2Btn();
  updateScore();
  updateHistory();
}

function MR1Btn3OnClick() {
  if (timer.state != TimerState.START || isOneMinute) return;
  if (!team.completeTaskMR1(Horse)) return;
  updateMR2Btn();
  updateScore();
  updateHistory();
}

function MR2BtnOnClick() {
  if (timer.state != TimerState.START || isOneMinute) return;
  if (!team.completeTaskMR2()) return;
  updateMR1Btn();
  updateMR2Btn();
  updateScore();
  updateHistory();
}

function updateMR1Btn() {
  if (team.curTaskMR1 == Shagai) {
    $("#MR1Btn2").removeClass("hide");
    $("#MR1Btn3").removeClass("hide");
  } else {
    $("#MR1Btn2").addClass("hide");
    $("#MR1Btn3").addClass("hide");
  }

  $("#MR1Btn1").html(team.curTaskMR1);
}

function updateMR2Btn() {
  $("#MR2Btn").html(team.curTaskMR2);
}

function updateScore() {
  $("#Score").html(team.score);
}

function updateRetryBtn() {
  $("#retry-btn").html(team.onRetry ? "End Retry" : "Start Retry");
}

function updateRetryNumber() {
  $("#retry-time").html(team.numOfRetry);
}
function updateViolationNumber() {
  $("#violation-time").html(team.numOfViolation);
}

function updateHistory(oldEvent = undefined) {
  let event = oldEvent == undefined ? team.event[team.event.length - 1] : oldEvent;
  let eventString;
  if (event.event == "Retry Start") {
    if (team.event.length >= 2 && team.event[team.event.length - 2].event == "Violation") {
      updateHistory(team.event[team.event.length - 2]);
    }
    eventString = "Retry Start";
  } else if (event.event == "Retry End") {
    let lastEvents = team.findAllEvent("Retry Start");
    let startTime = lastEvents[lastEvents.length - 1].time;
    let time = Math.round((event.time - startTime) / 100) / 10;
    eventString = event.event + " (Time taken: " + time + "s)";
  } else if (event.event.includes("Line")) {
    eventString = "Pass " + event.event;
  } else if (event.event == Shagai) {
    eventString = "Shagai Land";
  } else if (event.event == Camel || event.event == Horse) {
    eventString = "Shagai Land as " + event.event;
  } else {
    eventString = event.event;
  }
  eventString += " (Score: " + team.score + ")";
  $("#history").append("<tr><th>" + event.timeString + "</th><th>" + eventString);
  $(".history").scrollTop(99999999);
}

function updateTeamName(teamName) {
  $(".team-name").html(teamName);
}

function updateFieldColor() {
  if ($("input[name='field']:checked").val() == "red") {
    $(".blue-field").addClass("red-field");
    $(".blue-field").removeClass("blue-field");
  } else {
    $(".red-field").addClass("blue-field");
    $(".red-field").removeClass("red-field");
  }
}

function updateTimeFormat() {
  switch ($("input[name='time-format']:checked").val()) {
    case "MSm":
      timer.setStyle(TimerStyle.MSm);
      $("#timer-minute").removeClass("hide");
      $("#timer-millis").removeClass("hide");
      break;

    case "MS":
      timer.setStyle(TimerStyle.MS);
      $("#timer-minute").removeClass("hide");
      $("#timer-millis").addClass("hide");
      break;

    case "S":
      timer.setStyle(TimerStyle.S);
      $("#timer-minute").addClass("hide");
      $("#timer-millis").addClass("hide");
      break;
  }
  writeTimer(timer);
}

function writeTimer(timer) {
  let time = timer.getTime();
  switch (timer.style) {
    case TimerStyle.MSm:
    case TimerStyle.MS:
      $("#timer-minute").html(fillZero(time.minute, 2) + ":");
      $("#timer-second").html(fillZero(time.second, 2));
      $("#timer-millis").html("." + fillZero(time.millisecond, 3));
      break;

    case TimerStyle.S:
      $("#timer-second").html(fillZero(time.minute * 60 + time.second, 3));
      break;
  }
}

function timerEnd() {
  if (isOneMinute) {
    isOneMinute = false;
    timer.setTime(3);
    timer.startTimer();
    return;
  } else {
    timer.setTime($("#prep-time").prop("checked") ? 1 : 3);
  }
  $("#start-btn").attr("disabled", "true");
  $("#start-btn").html("Start");
  $("#reset-btn").html("Clear");
}

// function keyPressed(event) {
//   switch (event.keyCode) {
//     case 81: lap(); break; // Q
//     case 87: pass(); break; // W
//     case 69: Retry(); break; // E
//     case 82: Rongbay(); break; // R
//     case 83: startTimer(); break; // S
//     case 49: TZ1(); break; // 1
//     case 50: TZ2(); break; // 2
//     case 51: TZ3(); break; // 3
//     default: break;
//   }
// }
