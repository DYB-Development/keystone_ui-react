import { test } from "node:test"
import assert from "node:assert/strict"

test("draws elements with the React the page carries", async () => {
  const drawn = []
  globalThis.React = { createElement: (type, props) => drawn.push([ type, props ]), Fragment: "fragment" }

  const { jsx } = await import("../src/jsx_runtime_on_page.js")
  jsx("div", { children: "Welcome" })

  assert.deepEqual(drawn, [ [ "div", { children: "Welcome" } ] ])
})
