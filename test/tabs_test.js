import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import Tabs from "../src/Tabs.jsx"

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

const buttons = (element) => {
  if (!React.isValidElement(element)) return []
  if (element.type === "button") return [ element ]

  return React.Children.toArray(element.props.children).flatMap(buttons)
}

test("calls back with the chosen tab's value when a tab is chosen", () => {
  const chosen = []
  const fixtures = buttons(Tabs({ tabs: TABS, value: "validation", onChange: (value) => chosen.push(value) }))[1]

  fixtures.props.onClick()

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
