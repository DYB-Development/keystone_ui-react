import { test } from "node:test"
import assert from "node:assert/strict"

test("takes React from the page rather than bundling its own", async () => {
  const pageReact = { useState: () => {}, createElement: () => {} }
  globalThis.React = pageReact

  const { useState } = await import("../src/react_on_page.js")

  assert.equal(useState, pageReact.useState)
})
