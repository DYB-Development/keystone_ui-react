import { test } from "node:test"
import assert from "node:assert/strict"
import { register, mountAll, unmountAll } from "../src/registry.js"

const recordingRoots = () => {
  const rendered = []
  const createRoot = (element) => ({ render: (tree) => rendered.push({ element, tree }), unmount: () => {} })
  return { rendered, createRoot }
}

const pageWith = (...elements) => ({ querySelectorAll: () => elements })

const uiElement = (name, props) => ({ dataset: { reactUi: name, props: JSON.stringify(props) } })

test("renders a registered UI into its element with the props the element carries", () => {
  const Greeting = () => null
  register("test/greeting", Greeting)
  const { rendered, createRoot } = recordingRoots()

  mountAll(pageWith(uiElement("test/greeting", { name: "Ada" })), createRoot)

  assert.deepEqual(rendered.map(({ tree }) => [ tree.type, tree.props ]), [ [ Greeting, { name: "Ada" } ] ])
})

test("renders every UI on the page into its own element", () => {
  const Flow = () => null
  const Builder = () => null
  register("test/flow", Flow)
  register("test/builder", Builder)
  const flow = uiElement("test/flow", {})
  const builder = uiElement("test/builder", {})
  const { rendered, createRoot } = recordingRoots()

  mountAll(pageWith(flow, builder), createRoot)

  assert.deepEqual(rendered.map(({ element, tree }) => [ element, tree.type ]), [ [ flow, Flow ], [ builder, Builder ] ])
})

test("an element already drawn into is not drawn into a second time", () => {
  const Greeting = () => null
  register("test/greeting", Greeting)
  const element = uiElement("test/greeting", {})
  const { rendered, createRoot } = recordingRoots()

  mountAll(pageWith(element), createRoot)
  mountAll(pageWith(element), createRoot)

  assert.equal(rendered.length, 1)
})

test("taking the UIs down leaves the page without them", () => {
  const Greeting = () => null
  register("test/greeting", Greeting)
  const element = uiElement("test/greeting", {})
  const taken = []
  const createRoot = () => ({ render: () => {}, unmount: () => taken.push("down") })

  mountAll(pageWith(element), createRoot)
  unmountAll()

  assert.deepEqual(taken, [ "down" ])
})
