import { test } from "node:test"
import assert from "node:assert/strict"
import { register } from "../src/registry.js"
import { startMounting } from "../src/mounting.js"

const fakePage = () => {
  const listeners = new Map()
  const elements = []

  return {
    readyState: "complete",
    elements,
    addEventListener: (name, listener) => listeners.set(name, listener),
    dispatch: (name) => listeners.get(name)?.(),
    listening: () => [ ...listeners.keys() ],
    querySelectorAll: () => elements
  }
}

const uiElement = (name) => ({ dataset: { reactUi: name, props: "{}" } })

test("draws the UIs a page already carries", () => {
  const drawn = []
  const page = fakePage()
  page.elements.push(uiElement("test/on-load"))
  register("test/on-load", () => null)

  startMounting(page, () => ({ render: () => drawn.push("drawn"), unmount: () => {} }))

  assert.deepEqual(drawn, [ "drawn" ])
})

test("draws the UIs of a page reached by a turbo visit", () => {
  const drawn = []
  const page = fakePage()
  register("test/on-visit", () => null)
  startMounting(page, () => ({ render: () => drawn.push("drawn"), unmount: () => {} }))

  page.elements.push(uiElement("test/on-visit"))
  page.dispatch("turbo:load")

  assert.deepEqual(drawn, [ "drawn" ])
})

test("takes the UIs down before turbo keeps a copy of the page", () => {
  const taken = []
  const page = fakePage()
  page.elements.push(uiElement("test/before-cache"))
  register("test/before-cache", () => null)
  startMounting(page, () => ({ render: () => {}, unmount: () => taken.push("down") }))

  page.dispatch("turbo:before-cache")

  assert.deepEqual(taken, [ "down" ])
})
