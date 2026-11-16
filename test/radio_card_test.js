import { test } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import RadioCard from "../src/RadioCard.jsx"

const render = (props) => renderToStaticMarkup(React.createElement(RadioCard, { name: "alias", value: "prod", label: "prod → v22", ...props }))

test("shows its label in keystone's radio card label", () => {
  assert.match(render({}), /<span class="ks-radio-card-label block">prod → v22<\/span>/)
})

test("shows its hint on a line under its label", () => {
  assert.match(render({ hint: "p 0.84 · n 1,920" }), /<\/span><span class="ks-radio-card-hint block text-sm">p 0.84 · n 1,920<\/span><\/span><\/label>$/)
})
