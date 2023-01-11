import Timeout from "./Timeout"

class Storie {
  storieContainer
  storieElements
  storieControls
  time
  index: number
  actualStorie: HTMLElement | null
  timeout: Timeout | null
  paused: boolean
  pausedTimeout: Timeout | null
  thumbItems: HTMLElement[] | null
  currentThumb: Element | null

  constructor(
    storieContainer: HTMLElement,
    storieElements: HTMLElement[],
    storieControls: HTMLElement,
    time: number = 1000
  ) {
    this.storieContainer = storieContainer
    this.storieControls = storieControls
    this.storieElements = storieElements
    this.time = time
    this.index = localStorage.getItem("activeSlide")
      ? Number(localStorage.getItem("activeSlide"))
      : 0
    this.actualStorie = null
    this.timeout = null
    this.paused = false
    this.pausedTimeout = null
    this.thumbItems = null
    this.currentThumb = null

    this.init()
  }

  hide(el: HTMLElement) {
    el.classList.remove("active")

    if (el instanceof HTMLVideoElement) {
      el.pause
      el.currentTime = 0
    }
  }

  show(i: number) {
    if (i !== undefined && i <= this.storieElements.length - 1 && !(i < 0)) {
      this.index = i
      this.actualStorie = this.storieElements[i]
      this.storieElements.forEach((storie) => this.hide(storie))
      this.actualStorie.classList.add("active")
      localStorage.setItem("activeSlide", String(this.index))

      if (this.thumbItems) {
        this.currentThumb = this.thumbItems[this.index].firstElementChild
        this.thumbItems.forEach((el) =>
          el.firstElementChild?.classList.remove("active")
        )
        if (this.currentThumb) {
          this.currentThumb.classList.add("active")
        }
      }

      if (this.actualStorie instanceof HTMLVideoElement) {
        this.autoVideo(this.actualStorie)
      } else {
        this.auto(this.time)
      }

      return true
    } else {
      throw new Error("index inválido")
    }
  }

  autoVideo(video: HTMLVideoElement) {
    video.muted = true
    video.play()
    let firstPlay = true
    if (firstPlay) {
      const duration = video.duration * 1000
      this.auto(duration)
      firstPlay = false
    }
  }

  private setControllers() {
    const nextBtn = document.createElement("button")
    const prevBtn = document.createElement("button")

    this.storieControls.appendChild(prevBtn)
    this.storieControls.appendChild(nextBtn)

    this.storieControls.addEventListener("pointerdown", () => this.pause())
    document.addEventListener("pointerup", () => this.continue())
    document.addEventListener("touchend", () => this.continue())

    nextBtn.addEventListener("pointerup", () => this.next())
    prevBtn.addEventListener("pointerup", () => this.prev())
  }

  private init() {
    this.setControllers()
    this.addThumbItems()
    this.show(this.index)
  }

  next() {
    if (this.paused) return

    if (this.index < this.storieElements.length - 1) {
      this.show(this.index + 1)
    } else {
      this.show(0)
    }
  }

  prev() {
    if (this.paused) return

    if (this.index > 0) {
      this.show(this.index - 1)
    } else {
      this.show(this.storieElements.length - 1)
    }
  }

  auto(time: number) {
    console.log(time)
    this.timeout?.clear()
    this.timeout = new Timeout(() => this.next(), time)
    if (this.currentThumb instanceof HTMLElement) {
      console.log(this.currentThumb)
      this.currentThumb.style.animationDuration = String(time) + "ms"
    }
  }

  pause() {
    document.body.classList.add("paused")

    this.pausedTimeout = new Timeout(() => {
      this.paused = true
      this.timeout?.pause()

      if (this.currentThumb instanceof HTMLElement) {
        this.currentThumb.style.animationPlayState = "paused"
      }

      if (this.actualStorie instanceof HTMLVideoElement)
        this.actualStorie.pause()
    }, 300)
  }

  continue() {
    document.body.classList.remove("paused")

    this.pausedTimeout?.clear()
    if (this.paused) {
      this.paused = false
      this.timeout?.continue()

      if (this.currentThumb instanceof HTMLElement) {
        this.currentThumb.style.animationPlayState = "running"
      }

      if (this.actualStorie instanceof HTMLVideoElement)
        this.actualStorie.play()
    }
  }

  private addThumbItems() {
    const thumbContainer = document.createElement("div")
    this.storieContainer.appendChild(thumbContainer).classList.add("load")

    for (let i = 0; i < this.storieElements.length; i++) {
      thumbContainer.innerHTML += "<span class='load-item'><span></span></span>"
    }

    this.thumbItems = Array.from(document.querySelectorAll(".load-item"))
  }
}

export default Storie
