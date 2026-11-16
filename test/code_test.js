import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Code from "../src/Code.jsx"

const render = (props) => renderToStaticMarkup(React.createElement(Code, props))

test("shows its content in keystone's code block", () => {
  assert.match(render({ children: "{brief: Brief}" }), /<pre class="ks-code-block[^"]*"><code[^>]*>\{brief: Brief\}<\/code><\/pre>/)
})

test("shows its caption above the code", () => {
  assert.match(render({ caption: "output_schema", children: "{headline: string}" }), /^<div class="ks-code overflow-hidden"><div class="ks-code-caption font-mono text-xs">output_schema<\/div><pre/)
})
