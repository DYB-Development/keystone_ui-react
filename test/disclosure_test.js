import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Disclosure from "../src/Disclosure.jsx"

const render = (props) => renderToStaticMarkup(React.createElement(Disclosure, { summary: "input_schema", children: "Schema body", ...props }))

test("shows its summary on the line a person clicks to open it", () => {
  assert.match(render({}), /<summary class="ks-disclosure-summary[^"]*"><span>input_schema<\/span>/)
})
