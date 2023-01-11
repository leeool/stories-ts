import Storie from "./storie"

export {}

const slide = document.querySelector<HTMLElement>("[data-ts=slide]")
const content = document.querySelectorAll<HTMLElement>(
  "[data-ts=slide-content] *"
)
const controls = document.querySelector<HTMLElement>("[data-ts=slide-controls]")

if (slide && content.length && controls) {
  const storie = new Storie(slide, Array.from(content), controls, 3000)
}
