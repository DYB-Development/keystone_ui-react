import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ValueList from "../src/ValueList.jsx"

const render = (props) => renderToStaticMarkup(React.createElement(ValueList, props))

const pairs = (html) =>
  [ ...html.matchAll(/<dt[^>]*>([^<]*)[\s\S]*?<dd[^>]*>([^<]*)/g) ].map(([ , label, value ]) => [ label.trim(), value.trim() ])

test("shows each row's label and value as a row of keystone's value list", () => {
  assert.deepEqual(pairs(render({ rows: [ { label: "Rate", value: "$150.00" }, { label: "Timeout", value: "90s" } ] })), [ [ "Rate", "$150.00" ], [ "Timeout", "90s" ] ])
})

test("shows a row's note under its label", () => {
  assert.match(render({ rows: [ { label: "Rate", value: "$150.00", note: "per hour" } ] }), /<dt class="ks-value-list-label">Rate <span class="ks-value-list-note">per hour<\/span><\/dt>/)
})

test("shows a row's fallback when its value is missing or empty", () => {
  assert.deepEqual(pairs(render({ rows: [ { label: "Reviews", value: null, fallback: "N/A" }, { label: "Deploys", value: "", fallback: "N/A" } ] })).map(([ , value ]) => value), [ "N/A", "N/A" ])
})
