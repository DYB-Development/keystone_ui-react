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

const RAILS_MARKUP = `<label class="inline-block cursor-pointer relative">
  <input type="radio" name="alias" value="prod" checked class="peer sr-only">
  <span class="ks-radio-card inline-flex flex-col cursor-pointer transition ks-radio-card-highlight">
      <span class="ks-radio-card-header flex items-start justify-between">
        <span class="ks-radio-card-label block">prod → v22</span>
      </span>
        <span class="ks-radio-card-hint block text-sm">p 0.84 · n 1,920</span>
  </span>
</label>`

const sortedAttributes = (attributes) =>
  [ ...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g) ].map(([ , name, value = "" ]) => `${name}="${value}"`).sort().join(" ")

const normalized = (html) =>
  html.replace(/>\s+</g, "><").trim().replace(/<([a-z]+)([^>]*?)\/?>/g, (_, tag, attributes) => `<${tag} ${sortedAttributes(attributes)}>`)

test("draws the markup of keystone_ui's Rails radio card", () => {
  assert.equal(normalized(render({ hint: "p 0.84 · n 1,920", defaultChecked: true })), normalized(RAILS_MARKUP))
})
