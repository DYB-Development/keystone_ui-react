import { mountAll, unmountAll } from "./registry.js"

export const startMounting = (page, createRoot) => {
  const draw = () => mountAll(page, createRoot)

  page.addEventListener("turbo:load", draw)
  page.addEventListener("turbo:frame-load", draw)
  page.addEventListener("turbo:before-cache", unmountAll)

  page.readyState === "loading" ? page.addEventListener("DOMContentLoaded", draw) : draw()
}
