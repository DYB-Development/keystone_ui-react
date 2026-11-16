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

test("draws a row marked as the total as a total row", () => {
  assert.deepEqual([ ...render({ rows: [ { label: "Rate", value: "$150.00" }, { label: "Total billed", value: "$1,875.00", total: true } ] }).matchAll(/<div class="([^"]*)">/g) ].map(([ , names ]) => names), [ "ks-value-list-row", "ks-value-list-row ks-value-list-total" ])
})

test("draws a right answer mark after the value of a row marked right", () => {
  assert.deepEqual([ ...render({ rows: [ { label: "Capital of France", value: "Paris", right: true }, { label: "Capital of Peru", value: "Quito" } ] }).matchAll(/<dd[^>]*>([^<]*)(<svg[^>]*aria-label="([^"]*)")?/g) ].map(([ , value, , mark ]) => [ value, mark ]), [ [ "Paris ", "Right" ], [ "Quito", undefined ] ])
})
