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

const listClasses = (html) => html.match(/<dl class="([^"]*)"/)[1].split(" ")

test("aligned to the end, pushes each value to the right end of its row", () => {
  assert.deepEqual(listClasses(render({ rows: [], align: "end" })), [ "ks-value-list", "ks-value-list-end" ])
})

const COLUMN_ROWS = [ { label: "Output format", value: "copy_block v3" }, { label: "Timeout", value: "90s" } ]

test("in columns, stacks each label above its value", () => {
  assert.deepEqual([ ...render({ rows: COLUMN_ROWS, columns: true }).matchAll(/<div class="([^"]*)"><dt/g) ].map(([ , names ]) => names.split(" ").includes("flex-col")), [ true, true ])
})

test("in columns, draws each label in small text kept to the height of its text", () => {
  assert.deepEqual([ ...render({ rows: COLUMN_ROWS, columns: true }).matchAll(/<dt class="([^"]*)"/g) ].map(([ , names ]) => names), Array(2).fill("ks-value-list-label basis-auto text-xs"))
})

test("in columns, lays the pairs in one column on a phone and two on a wider screen", () => {
  assert.deepEqual(listClasses(render({ rows: COLUMN_ROWS, columns: true })).filter((name) => [ "grid", "grid-cols-1", "sm:grid-cols-2" ].includes(name)), [ "grid", "grid-cols-1", "sm:grid-cols-2" ])
})

const RAILS_MARKUP = `<dl class="ks-value-list ks-value-list-end">
    <div class="ks-value-list-row">
      <dt class="ks-value-list-label">
        Rate
        <span class="ks-value-list-note">per hour</span>
      </dt>
      <dd class="ks-value-list-value">
        $150.00
      </dd>
    </div>
    <div class="ks-value-list-row">
      <dt class="ks-value-list-label">
        Reviews
        
      </dt>
      <dd class="ks-value-list-value">
        N/A
      </dd>
    </div>
    <div class="ks-value-list-row">
      <dt class="ks-value-list-label">
        Capital of France
        
      </dt>
      <dd class="ks-value-list-value">
        Paris
          <svg aria-label="Right" role="img" class="ks-tone-success inline size-5 align-text-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd"></path></svg>
      </dd>
    </div>
    <div class="ks-value-list-row ks-value-list-total">
      <dt class="ks-value-list-label">
        Total billed
        
      </dt>
      <dd class="ks-value-list-value">
        $1,875.00
      </dd>
    </div>
</dl>
`

const sortedAttributes = (attributes) =>
  [ ...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g) ].map(([ , name, value = "" ]) => `${name}="${value}"`).sort().join(" ")

const normalized = (html) =>
  html.replace(/>\s+/g, ">").replace(/\s+</g, "<").trim().replace(/<([a-z]+)([^>]*?)\/?>/g, (_, tag, attributes) => `<${tag} ${sortedAttributes(attributes)}>`).replace(/<(path)([^>]*)><\/path>/g, "<$1$2>")

const RAILS_ROWS = [
  { label: "Rate", value: "$150.00", note: "per hour" },
  { label: "Reviews", value: null, fallback: "N/A" },
  { label: "Capital of France", value: "Paris", right: true },
  { label: "Total billed", value: "$1,875.00", total: true }
]

test("draws the markup of keystone_ui's Rails value list", () => {
  assert.equal(normalized(render({ rows: RAILS_ROWS, align: "end" })), normalized(RAILS_MARKUP))
})
