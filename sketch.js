let timer;
let startTime;
let leftTeam, rightTeam;
let leftField, rightField;
let isOneMinute = true;
let isOneMinutePass = false;

let a = [];

const RedField = "Red Field";
const BlueField = "Blue Field";

function setup() {
	$("input[name*='time-format']").click(updateTimeFormat);
	$("input[name*='field']").click(updateFieldColor);
	$("#prep-time").click(function () {
		isOneMinute = this.checked;
		isOneMinutePass = !isOneMinute;
		timer.setTime(isOneMinute ? 1 : 3);
		writeTimer(timer);
	});

	timer = new Timer();
	leftTeam = new Team();
	rightTeam = new Team();
	timer.setTimerCallback(writeTimer);
    timer.setTimerEndCallback(timerEnd);
	
	leftField = RedField;
	rightField = BlueField;

	reset();
}

function reset() {
	document.getElementById("start-btn").disabled = false;
	$(".timer-setting").removeClass("disappear");
    $("#history").empty();
    isOneMinutePass = !isOneMinute;
    // isOneMinute = $("#prep-time").prop("checked");
    timer.resetTimer();
    timer.setTime(isOneMinute ? 1 : 3);
	writeTimer(timer);
	leftTeam.reset();
	rightTeam.reset();
	updateMR1Btn("#left-field");
	updateMR2Btn("#left-field");
	updateRetryBtn("#left-field");
	updateScore("#left-field");
	updateRetryNumber("#left-field");
	updateViolationNumber("#left-field");
	updateMR1Btn("#right-field");
	updateMR2Btn("#right-field");
	updateRetryBtn("#right-field");
	updateScore("#right-field");
	updateRetryNumber("#right-field");
	updateViolationNumber("#right-field");
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
        startTime = new Date();
        // team.field = field;
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
        pushHistory();
	}
}

function retryBtnOnClick(fieldSelect) {
	if (timer.state != TimerState.START || !isOneMinutePass) return;
	if (fieldSelect == '#left-field') {
		leftTeam.toggleRetry();
	} else {
		rightTeam.toggleRetry();
	}
	updateRetryBtn(fieldSelect);
	updateRetryNumber(fieldSelect);
	updateHistory(fieldSelect);
}

function violationBtnOnClick(fieldSelect) {
	if (timer.state != TimerState.START || !isOneMinutePass) return;
	if (fieldSelect == '#left-field') {
		leftTeam.violation();
	} else {
		rightTeam.violation();
	}
	updateRetryBtn(fieldSelect);
	updateRetryNumber(fieldSelect);
	updateViolationNumber(fieldSelect);
	updateHistory(fieldSelect);
}

function undoBtnOnClick(fieldSelect) {
	if (timer.state != TimerState.START || !isOneMinutePass) return;
	fieldSelect == "#left-field" ? leftTeam.undo() : rightTeam.undo();
	updateMR1Btn(fieldSelect);
	updateMR2Btn(fieldSelect);
	updateRetryBtn(fieldSelect);
	updateScore(fieldSelect);
	updateRetryNumber(fieldSelect);
	updateViolationNumber(fieldSelect);
	if (fieldSelect == "#left-field") {
		$("#left-history tr:last").remove();
	} else {
		$("#right-history tr:last").remove();
	}
	// $(fieldSelect == "#left-field" ? "#left-history" : "#right-history" + " tr:last").remove();
	// $(".history").scrollTop(99999999);
}

function MR1Btn1OnClick(fieldSelect) {
	if (timer.state != TimerState.START || !isOneMinutePass) return;
	if (!(fieldSelect == "#left-field" ? leftTeam.completeTaskMR1(Shagai) : rightTeam.completeTaskMR1(Shagai))) return;
	updateMR1Btn(fieldSelect);
	updateMR2Btn(fieldSelect);
	updateScore(fieldSelect);
	updateHistory(fieldSelect);
}

function MR1Btn2OnClick(fieldSelect) {
	if (timer.state != TimerState.START || !isOneMinutePass) return;
	if (!(fieldSelect == "#left-field" ? leftTeam.completeTaskMR1(Camel) : rightTeam.completeTaskMR1(Camel))) return;
	updateMR2Btn(fieldSelect);
	updateScore(fieldSelect);
	updateHistory(fieldSelect);
}

function MR1Btn3OnClick(fieldSelect) {
	if (timer.state != TimerState.START || !isOneMinutePass) return;
	if (!(fieldSelect == "#left-field" ? leftTeam.completeTaskMR1(Horse) : rightTeam.completeTaskMR1(Horse))) return;
	updateMR2Btn(fieldSelect);
	updateScore(fieldSelect);
	updateHistory(fieldSelect);
}

function MR2BtnOnClick(fieldSelect) {
	if (timer.state != TimerState.START || !isOneMinutePass) return;
	if (!(fieldSelect == "#left-field" ? leftTeam.completeTaskMR2() : rightTeam.completeTaskMR2())) return;
	updateMR1Btn(fieldSelect);
	updateMR2Btn(fieldSelect);
	updateScore(fieldSelect);
	updateHistory(fieldSelect);
}

function updateMR1Btn(fieldSelect) {
	if (fieldSelect == "#left-field" ? leftTeam.curTaskMR1 == Shagai : rightTeam.curTaskMR1 == Shagai) {
		$(fieldSelect + " " + "#MR1Btn2").removeClass("hide");
		$(fieldSelect + " " + "#MR1Btn3").removeClass("hide");
	} else {
		$(fieldSelect + " " + "#MR1Btn2").addClass("hide");
		$(fieldSelect + " " + "#MR1Btn3").addClass("hide");
	}

	$(fieldSelect + " " + "#MR1Btn1").html(fieldSelect == "#left-field" ? leftTeam.curTaskMR1 : rightTeam.curTaskMR1);
}

function updateMR2Btn(fieldSelect) {
	$(fieldSelect + " " + "#MR2Btn").html(fieldSelect == "#left-field" ? leftTeam.curTaskMR2 : rightTeam.curTaskMR2);
}

function updateScore(fieldSelect) {
	$(fieldSelect + " " + "#Score").html(fieldSelect == "#left-field" ? leftTeam.score : rightTeam.score);
}

function updateRetryBtn(fieldSelect) {
	$(fieldSelect + " " + "#retry-btn").html((fieldSelect == "#left-field" ? leftTeam.onRetry : rightTeam.onRetry) ? "End Retry" : "Start Retry");
}

function updateRetryNumber(fieldSelect) {
	$(fieldSelect + " " + "#retry-time").html(fieldSelect == "#left-field" ? leftTeam.numOfRetry : rightTeam.numOfRetry);
}
function updateViolationNumber(fieldSelect) {
	$(fieldSelect + " " + "#violation-time").html(fieldSelect == "#left-field" ? leftTeam.numOfViolation : rightTeam.numOfViolation);
}

function updateHistory(fieldSelect, oldEvent = undefined) {
	let team = fieldSelect == "#left-field" ? leftTeam : rightTeam;
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
	// $(fieldSelect == "#left-field" ? ".left-field" : ".right-field" + " " + "#history").append("<tr><th>" + event.timeString + "</th><th>" + eventString);
	$(fieldSelect == "#left-field" ? "#left-history" : "#right-history").append("<tr><th>" + event.timeString + "</th><th>" + eventString);
	// $(".history").scrollTop(99999999);
}

function updateTeamName(teamName) {
    $(".team-name").html(teamName);
    team.name = teamName;
}

function updateFieldColor() {
	if ($("input[name='field']:checked").val() == "red") {
        $("#left-field").removeClass("blue-field");
		$("#left-field").addClass("red-field");
        $("#right-field").removeClass("red-field");
		$("#right-field").addClass("blue-field");
		leftField = RedField;
		rightField = BlueField;
	} else {
        $("#left-field").removeClass("red-field");
		$("#left-field").addClass("blue-field");
        $("#right-field").removeClass("blue-field");
		$("#right-field").addClass("red-field");
		leftField = BlueField;
		rightField = RedField;
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
	if (!isOneMinutePass) {
		isOneMinutePass = true;
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
