const TimerState = Object.freeze({ START: Symbol("START"), PAUSE: Symbol("PAUSE"), STOP: Symbol("STOP") });  // START, PAUSE, STOP
const TimerMode = Object.freeze({ CountUp: Symbol("CountUp"), CountDown: Symbol("CountDown") });  // CountUp, CountDown
const TimerStyle = Object.freeze({ MSm: Symbol("MSm"), MS: Symbol("MS"), S: Symbol("S") });  // MSm: "00:00:000", MS: "00;00", S: "000"

class Timer {
  constructor(minute = NaN, second = NaN, mode = TimerMode.CountDown, style = TimerStyle.MSm) {
    this.state = TimerState.STOP;
    this.setMode(mode);
    this.setStyle(style);
    this.currentTime = 0;
    this.lastTime = 0;
    this.setTime(minute, second);
    this.timerCallback = undefined;
    this.timerEndCallback = undefined;
    this.interval = undefined;
  }

  setTime(minute = NaN, second = NaN) {
    this.endTime = 0;

    if (minute)
      this.endTime += minute * 60000;
    if (second)
      this.endTime += second * 1000;
  }

  setMode(mode) {
    this.mode = mode;
  }

  setStyle(style) {
    this.style = style;
  }

  setTimerCallback(callback) {
    this.timerCallback = callback;
  }

  setTimerEndCallback(callback) {
    this.timerEndCallback = callback;
  }

  startTimer() {
    if (timer.state == TimerState.STOP && timer.endTime) {
      console.log("Start Timer");
      this.currentTime = 0;
      this.lastTime = new Date().getTime();
      this.state = TimerState.START;
      this.interval = setInterval(() => { this.countTimer() }, 1);
    } else if (this.state == TimerState.PAUSE) {
      this.state = TimerState.START;
      this.lastTime = new Date().getTime();
      this.interval = setInterval(() => { this.countTimer() }, 1);
    }
  }

  pauseTimer() {
    if (this.state == TimerState.START) {
      this.state = TimerState.PAUSE;
      clearInterval(this.interval);
    }
  }

  stopTimer() {
    this.state = TimerState.STOP;
    clearInterval(this.interval);
  }

  resetTimer() {
    this.state = TimerState.STOP;
    this.currentTime = 0;
    clearInterval(this.interval);
  }

  countTimer() {
    let currentTime = new Date().getTime();
    this.currentTime += currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (this.currentTime >= this.endTime) {
      this.currentTime = this.endTime;
      if (this.timerCallback)
        this.timerCallback(this);

      this.stopTimer();
      if (this.timerEndCallback)
        this.timerEndCallback(this);
      return;
    }

    if (this.timerCallback)
      this.timerCallback(this);
  }

  getRawTime() {
    return this.currentTime;
  }

  getTime(mode = undefined) {
    if (!mode)
      mode = this.mode;

    let timeCalculate = mode == TimerMode.CountUp ? this.currentTime : this.endTime - this.currentTime;
    let time = { minute: 0, second: 0, millisecond: 0 };
    time.millisecond = timeCalculate % 1000;
    time.second = Math.floor(timeCalculate / 1000);
    time.minute = Math.floor(time.second / 60);
    time.second -= time.minute * 60;

    return time;
  }

  getTimeString(mode = undefined, style = undefined) {
    let time = this.getTime(mode);
    if (!style)
      style = this.style;

    if (style == TimerStyle.MSm)
      return fillZero(time.minute, 2) + ":" + fillZero(time.second, 2) + "." + fillZero(time.millisecond, 3);
    else if (style == TimerStyle.MS)
      return fillZero(time.minute, 2) + ":" + fillZero(time.second, 2);
    else if (style == TimerStyle.S)
      return (time.minute * 60 + time.second).toString();
  }
}

function fillZero(number, padding) {
  return ("0".repeat(padding) + number).slice(-padding);
}
