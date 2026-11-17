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

test("draws no caption when it is given none", () => {
  assert.doesNotMatch(render({ children: "{}" }), /ks-code-caption/)
})

test("marks its code with the language it is given", () => {
  assert.match(render({ language: "json", children: "{}" }), /<code class="language-json">/)
})

test("adds a class it is given to its outer element", () => {
  assert.match(render({ className: "mt-4", children: "{}" }), /^<div class="ks-code overflow-hidden mt-4">/)
})

const RAILS_MARKUP = `<div class="ks-code overflow-hidden">
    <div class="ks-code-caption font-mono text-xs">output_schema → copy_block v3</div>
  <pre class="ks-code-block overflow-x-auto font-mono text-sm leading-relaxed"><code class="">{headline: string≤60, cta: string≤30}</code></pre>
</div>
`

const sortedAttributes = (attributes) =>
  [ ...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g) ].map(([ , name, value = "" ]) => `${name}="${value}"`).sort().join(" ")

const normalized = (html) =>
  html.replace(/>\s+</g, "><").trim().replace(/<([a-z]+)([^>]*?)\/?>/g, (_, tag, attributes) => `<${tag} ${sortedAttributes(attributes)}>`)

test("draws the markup of keystone_ui's Rails code block", () => {
  assert.equal(normalized(render({ caption: "output_schema → copy_block v3", children: "{headline: string≤60, cta: string≤30}" })), normalized(RAILS_MARKUP))
})
