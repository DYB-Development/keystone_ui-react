import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Tabs from "../src/Tabs.jsx"
import { renderIntoDocument, click } from "./support/document.js"

const TABS = [
  { value: "validation", label: "Validation", content: "Validation panel" },
  { value: "fixtures", label: "Fixtures", content: "Fixtures panel" }
]

const render = (props) => renderToStaticMarkup(React.createElement(Tabs, { tabs: TABS, value: "validation", onChange: () => {}, ...props }))

test("shows each tab's label on a keystone tab", () => {
  assert.deepEqual([ ...render({}).matchAll(/<button[^>]*class="ks-tab[ "][^>]*>([^<]*)/g) ].map(([ , label ]) => label), [ "Validation", "Fixtures" ])
})

test("marks only the chosen tab as the current tab", () => {
  assert.deepEqual([ ...render({ value: "fixtures" }).matchAll(/<button[^>]*data-active=""[^>]*>([^<]*)/g) ].map(([ , label ]) => label), [ "Fixtures" ])
})

test("calls back with the chosen tab's value when a tab is chosen", async () => {
  const chosen = []
  const page = await renderIntoDocument(React.createElement(Tabs, { tabs: TABS, value: "validation", onChange: (value) => chosen.push(value) }))

  await click([ ...page.querySelectorAll("button") ].find((button) => button.textContent === "Fixtures"))

  assert.deepEqual(chosen, [ "fixtures" ])
})

test("shows only the chosen tab's content", () => {
  assert.deepEqual([ "Validation panel", "Fixtures panel" ].filter((content) => render({ value: "fixtures" }).includes(content)), [ "Fixtures panel" ])
})

test("draws a tab's count in an info badge after its label", () => {
  assert.match(render({ tabs: [ { value: "validation", label: "Validation", count: 1 } ] }), /<button[^>]*>Validation <span class="ks-badge ks-badge-info">1<\/span><\/button>/)
})

test("draws no count for a tab whose count is zero", () => {
  assert.doesNotMatch(render({ tabs: [ { value: "validation", label: "Validation", count: 0 } ] }), /ks-badge/)
})

test("draws a count given as text exactly as written", () => {
  assert.match(render({ tabs: [ { value: "fixtures", label: "Fixtures", count: "0/12" } ] }), /<span class="ks-badge ks-badge-info">0\/12<\/span>/)
})

const rowClasses = (html) => html.match(/<div class="([^"]*\bks-tab-bar\b[^"]*)"/)[1].split(" ")

test("keeps the tab row on one line that scrolls sideways on a phone", () => {
  assert.deepEqual(rowClasses(render({})).filter((name) => [ "max-sm:flex-nowrap", "max-sm:overflow-x-auto" ].includes(name)), [ "max-sm:flex-nowrap", "max-sm:overflow-x-auto" ])
})

test("keeps each tab label on one line at its full width on a phone", () => {
  assert.deepEqual([ ...render({}).matchAll(/<button[^>]*class="([^"]*)"/g) ].map(([ , names ]) => names.split(" ").filter((name) => [ "max-sm:shrink-0", "max-sm:whitespace-nowrap" ].includes(name))), Array(2).fill([ "max-sm:shrink-0", "max-sm:whitespace-nowrap" ]))
})

test("aligned to the start, starts the tab row at the left edge on every width", () => {
  assert.deepEqual(rowClasses(render({ align: "start" })).filter((name) => [ "justify-start", "justify-center" ].includes(name)), [ "justify-start" ])
})

test("shaped as underlined tabs, carries the underlined row class", () => {
  assert.ok(rowClasses(render({ shape: "underline" })).includes("ks-tab-bar-underline"))
})

test("shaped as pills, carries the pill row class", () => {
  assert.ok(rowClasses(render({ shape: "pills" })).includes("ks-tab-bar-pills"))
})

test("in a shaped tab row, no tab carries its own text size so the shape sets it", () => {
  assert.deepEqual([ ...render({ shape: "underline" }).matchAll(/<button[^>]*class="([^"]*)"/g) ].map(([ , names ]) => names.split(" ").includes("text-sm")), [ false, false ])
})

test("in a shaped tab row, draws a count as plain text after the label rather than a badge", () => {
  assert.match(render({ shape: "underline", tabs: [ { value: "fixtures", label: "Fixtures", count: "12/12" } ] }), /<button[^>]*>Fixtures <span class="ks-tab-count">12\/12<\/span><\/button>/)
})

test("adds a class it is given to its outer element", () => {
  assert.match(render({ className: "mt-4" }), /^<div class="mt-4">/)
})

const RAILS_MARKUP = `<div data-controller="tab-switcher">
  <div class="ks-tab-bar flex flex-wrap justify-start max-sm:flex-nowrap max-sm:overflow-x-auto ks-tab-bar-underline">
      <button
        type="button"
        class="ks-tab transition max-sm:shrink-0 max-sm:whitespace-nowrap ks-tab-active"
        data-tab-switcher-target="tab"
        data-action="click->tab-switcher#select"
        data-index="0"
        data-active>Validation</button>
      <button
        type="button"
        class="ks-tab transition max-sm:shrink-0 max-sm:whitespace-nowrap ks-tab-active"
        data-tab-switcher-target="tab"
        data-action="click->tab-switcher#select"
        data-index="1"
        >Fixtures</button>
  </div>
</div>`

const STIMULUS_ATTRIBUTES = /\s(?:data-controller|data-tab-switcher-target|data-action|data-index)="[^"]*"/g

const sortedAttributes = (attributes) =>
  [ ...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g) ].map(([ , name, value = "" ]) => `${name}="${value}"`).sort().join(" ")

const normalized = (html) =>
  html.replace(STIMULUS_ATTRIBUTES, "").replace(/>\s+</g, "><").replace(/\s+>/g, ">").trim().replace(/<([a-z]+)([^>]*?)\/?>/g, (_, tag, attributes) => `<${tag} ${sortedAttributes(attributes)}>`)

test("draws the markup of keystone_ui's Rails tab switcher, less its Stimulus wiring", () => {
  const tabs = [ { value: "validation", label: "Validation" }, { value: "fixtures", label: "Fixtures" } ]

  assert.equal(normalized(render({ tabs, align: "start", shape: "underline" })), normalized(RAILS_MARKUP))
})
