import { JSDOM } from "jsdom"
import { act } from "react"

const { window } = new JSDOM("<!doctype html><html><body></body></html>")

globalThis.window = window
globalThis.document = window.document
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const { createRoot } = await import("react-dom/client")

export const renderIntoDocument = async (element) => {
  const container = document.createElement("div")
  document.body.append(container)
  await act(async () => createRoot(container).render(element))

  return container
}

export const click = async (element) => {
  await act(async () => element.click())
}
