import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import RadioCards from "../src/RadioCards.jsx"

const OPTIONS = [
  { value: "prod", label: "prod → v22", hint: "p 0.84 · n 1,920" },
  { value: "candidate", label: "candidate → v23", hint: "p 0.87 · n 240" }
]

const render = (props) => renderToStaticMarkup(React.createElement(RadioCards, { name: "alias", options: OPTIONS, value: "candidate", onChange: () => {}, ...props }))

test("marks only the chosen card as chosen", () => {
  const chosen = [ ...render({}).matchAll(/<input[^>]*>/g) ].map(([ input ]) => input).filter((input) => input.includes("checked")).map((input) => input.match(/value="(\w+)"/)[1])

  assert.deepEqual(chosen, [ "candidate" ])
})
