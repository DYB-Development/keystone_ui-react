import { test } from "node:test"
import assert from "node:assert/strict"
import { savePreference } from "../src/preferences.js"

const page = { querySelector: () => ({ content: "token-123" }) }

const answering = (response) => async () => response

test("reports a save the save address keeps as saved", async () => {
  assert.equal(await savePreference("/keystone_ui_preferences/months", { hidden_columns: [] }, page, answering({ ok: true })), true)
})

test("reports a save the save address refuses as failed", async () => {
  assert.equal(await savePreference("/keystone_ui_preferences/months", [ "pipeline" ], page, answering({ ok: false, status: 422 })), false)
})
