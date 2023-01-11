class Timeout {
  id
  handler
  start: number
  timeLeft: number
  time: number

  constructor(handler: TimerHandler, time: number) {
    this.handler = handler
    this.id = setTimeout(handler, time)
    this.start = Date.now()
    this.timeLeft = time
    this.time = time
  }

  clear() {
    clearTimeout(this.id)
  }

  pause() {
    const passed = Date.now() - this.start
    this.timeLeft = this.time - passed
    this.clear()
  }

  continue() {
    this.clear()
    this.id = setTimeout(this.handler, this.timeLeft)
    this.start = Date.now()
  }
}

export default Timeout
