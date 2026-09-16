import { test } from "node:test"
import assert from "node:assert/strict"

test("takes the React DOM client from the page rather than bundling its own", async () => {
  const pageClient = { createRoot: () => {}, createPortal: () => {} }
  globalThis.ReactDOM = pageClient

  const { createRoot } = await import("../src/react_dom_on_page.js")

  assert.equal(createRoot, pageClient.createRoot)
})

test("takes the rest of React DOM from the page as well", async () => {
  const pageDom = { createRoot: () => {}, createPortal: () => {} }
  globalThis.ReactDOM = pageDom

  const { createPortal } = await import("../src/react_dom_on_page.js?rest")

  assert.equal(createPortal, pageDom.createPortal)
})
