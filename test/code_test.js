import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Code from "../src/Code.jsx"

const render = (props) => renderToStaticMarkup(React.createElement(Code, props))

test("shows its content in keystone's code block", () => {
  assert.match(render({ children: "{brief: Brief}" }), /<pre class="ks-code-block[^"]*"><code[^>]*>\{brief: Brief\}<\/code><\/pre>/)
})
