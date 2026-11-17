import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import RadioCards from "../src/RadioCards.jsx"
import { renderIntoDocument, click } from "./support/document.js"

const OPTIONS = [
  { value: "prod", label: "prod → v22", hint: "p 0.84 · n 1,920" },
  { value: "candidate", label: "candidate → v23", hint: "p 0.87 · n 240" }
]

const render = (props) => renderToStaticMarkup(React.createElement(RadioCards, { name: "alias", options: OPTIONS, value: "candidate", onChange: () => {}, ...props }))

test("marks only the chosen card as chosen", () => {
  const chosen = [ ...render({}).matchAll(/<input[^>]*>/g) ].map(([ input ]) => input).filter((input) => input.includes("checked")).map((input) => input.match(/value="(\w+)"/)[1])

  assert.deepEqual(chosen, [ "candidate" ])
})

test("sets its cards side by side in one row", () => {
  assert.match(render({}), /^<div class="flex[ "]/)
})

test("wraps its cards onto their own rows when the row is too narrow", () => {
  assert.match(render({}), /^<div class="[^"]*\bflex-wrap\b/)
})

test("adds a class it is given to the group's outer element", () => {
  assert.match(render({ className: "mt-2" }), /^<div class="flex flex-wrap ks-grid-gap-sm mt-2">/)
})

test("calls back with the value of the card a person chooses", async () => {
  let received
  const page = await renderIntoDocument(React.createElement(RadioCards, { name: "alias", options: OPTIONS, value: "prod", onChange: (value) => { received = value } }))

  await click(page.querySelectorAll("input")[1])

  assert.ok(received === "candidate")
})

test("calls back with a numeric option value as a number", async () => {
  let received
  const options = [ { value: 1, label: "One" }, { value: 2, label: "Two" } ]
  const page = await renderIntoDocument(React.createElement(RadioCards, { name: "count", options, value: 1, onChange: (value) => { received = value } }))

  await click(page.querySelectorAll("input")[1])

  assert.ok(received === 2)
})
