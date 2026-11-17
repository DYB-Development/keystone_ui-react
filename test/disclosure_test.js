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

test("adds a class it is given to its outer element", () => {
  assert.match(render({ className: "mt-4" }), /^<details class="ks-disclosure group mt-4">/)
})

const RAILS_MARKUP = `<details class="ks-disclosure group" open="">
  <summary class="ks-disclosure-summary flex cursor-pointer list-none items-center justify-between [&amp;::-webkit-details-marker]:hidden">
    <span>input_schema</span>
    <span class="ks-disclosure-icon h-4 w-4 shrink-0 transition-transform group-open:rotate-180"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>
</span>
  </summary>
  <div class="ks-disclosure-body text-sm">
    Schema body
  </div>
</details>
`

const sortedAttributes = (attributes) =>
  [ ...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g) ].map(([ , name, value = "" ]) => `${name}="${value}"`).sort().join(" ")

const normalized = (html) =>
  html.replace(/>\s+/g, ">").replace(/\s+</g, "<").trim().replace(/<([a-z]+)([^>]*?)\/?>/g, (_, tag, attributes) => `<${tag} ${sortedAttributes(attributes)}>`).replace(/<\/path>/g, "")

test("draws the markup of keystone_ui's Rails disclosure", () => {
  assert.equal(normalized(render({ open: true })), normalized(RAILS_MARKUP))
})
