import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Disclosure from "../src/Disclosure.jsx"

const render = (props) => renderToStaticMarkup(React.createElement(Disclosure, { summary: "input_schema", children: "Schema body", ...props }))

test("shows its summary on the line a person clicks to open it", () => {
  assert.match(render({}), /<summary class="ks-disclosure-summary[^"]*"><span>input_schema<\/span>/)
})

test("shows its content in the body under the summary", () => {
  assert.match(render({}), /<\/summary><div class="ks-disclosure-body text-sm">Schema body<\/div><\/details>$/)
})

test("starts closed unless it is told to start open", () => {
  assert.deepEqual([ render({}), render({ open: true }) ].map((html) => /^<details[^>]* open=""/.test(html)), [ false, true ])
})

test("draws a caret after its summary that turns over while it is open", () => {
  assert.match(render({}), /<span>input_schema<\/span><span class="ks-disclosure-icon h-4 w-4 shrink-0 transition-transform group-open:rotate-180"><svg[^>]*><path[^>]*d="M19 9l-7 7-7-7"/)
})
