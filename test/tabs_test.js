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
