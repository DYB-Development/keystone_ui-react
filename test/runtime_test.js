import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"

const runtime = () => {
  const page = {}
  runInNewContext(readFileSync(new URL("../app/assets/javascripts/keystone_ui/react.js", import.meta.url), "utf8"), { window: page, globalThis: page, self: page, document: {} })

  return page
}

test("the script the page loads puts React on the page", () => {
  assert.equal(typeof runtime().React.useState, "function")
})
