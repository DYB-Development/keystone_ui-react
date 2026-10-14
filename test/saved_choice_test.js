import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { register, mountAll } from "../src/registry.js"
import { savePreference } from "../src/preferences.js"
import Button from "../src/Button.jsx"

const pageWithToken = (token, ...elements) => ({
  querySelector: (selector) => (selector === 'meta[name="csrf-token"]' ? { content: token } : null),
  querySelectorAll: () => elements
})

test("a mounted UI saves a new value from its saved one to its save address with the page's CSRF token", async () => {
  const requests = []
  const send = async (url, options) => {
    requests.push([ url, options ])
    return { ok: true }
  }
  const element = { dataset: { reactUi: "test/columns", props: JSON.stringify({ value: { hidden_columns: [ "pipeline" ] }, save_url: "/keystone_ui_preferences/months" }) } }
  const page = pageWithToken("token-123", element)
  const Columns = ({ value, save_url }) =>
    React.createElement(Button, { onClick: () => savePreference(save_url, { hidden_columns: [ ...value.hidden_columns, "outreach" ] }, page, send) }, "Hide outreach")
  register("test/columns", Columns)
  let drawn
  const createRoot = () => ({ render: (tree) => { drawn = tree.type(tree.props) }, unmount: () => {} })

  mountAll(page, createRoot)
  await drawn.props.onClick()

  assert.deepEqual(requests, [ [ "/keystone_ui_preferences/months", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": "token-123" },
    body: JSON.stringify({ hidden_columns: [ "pipeline", "outreach" ] })
  } ] ])
})
