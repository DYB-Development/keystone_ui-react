# keystone_ui-react

React setup for Rails engine gems that follow
[keystone_ui](https://github.com/DYB-Development/keystone_ui)'s design: a helper
that mounts a React UI on a page, a registry of the UIs an engine draws, and
React controls styled with keystone_ui-styles classes.

Host apps do not install this gem directly. An engine with a React UI depends on
it, and the host gets it with that engine.

## Requirements

- Rails 7.0 or later
- React 19 or later, in the engine that draws the UI
- [keystone_ui-styles](https://github.com/DYB-Development/keystone_ui-styles),
  which keystone_ui brings into the host's Tailwind build

## What an engine installs

Two things, from the same repo and the same version. The gem carries the mount
helper:

```ruby
spec.add_dependency "keystone_ui-react"
```

The npm package carries the controls and the registry, and is installed from the
git tag rather than from the npm registry:

```json
"dependencies": {
  "keystone_ui-react": "github:DYB-Development/keystone_ui-react#v0.1.0"
}
```

## One React on the page

The gem ships React already built, and the page loads it once however many
engines draw React UIs on it:

```erb
<%= javascript_include_tag "keystone_ui/react", defer: true %>
```

Each engine builds its own script without React in it, taking React and the DOM
client from the page instead:

```bash
esbuild app/javascript/alembic/page_builder.jsx --bundle --format=iife \
  --alias:react=keystone_ui-react/src/react_on_page.js \
  --alias:react-dom/client=keystone_ui-react/src/react_dom_on_page.js \
  --alias:react-dom=keystone_ui-react/src/react_dom_on_page.js \
  --alias:react/jsx-runtime=keystone_ui-react/src/jsx_runtime_on_page.js
```

The last alias is for packages an engine depends on that draw with React's
automatic runtime rather than with `createElement`.

The page loads the gem's script before any engine's script, since an engine's
script reads React off the page as it runs.

## Mounting a React UI

An engine registers each UI under a name and mounts every one the page carries:

```javascript
import { createRoot } from "react-dom/client"
import { register } from "keystone_ui-react/src/registry.js"
import { startMounting } from "keystone_ui-react/src/mounting.js"
import PageBuilder from "./page_builder/PageBuilder"

register("alembic/page-builder", PageBuilder)
startMounting(document, createRoot)
```

`startMounting` draws the UIs the page already carries, draws them again on a
Turbo visit, and takes them down before Turbo keeps a copy of the page, so a UI
appears whether its page was loaded fresh, reached by a link, or gone back to.

The view writes the element that UI mounts into, with the props it draws from:

```erb
<%= react_ui("alembic/page-builder", name: @page.name) %>
```

`react_ui` comes from `KeystoneUi::React::MountHelper`, which a controller adds
the way it adds any helper:

```ruby
require "keystone_ui/react/mount_helper"

class BuilderController < ApplicationController
  helper KeystoneUi::React::MountHelper
end
```

Anything else passed to `react_ui` lands on the element, so a UI can be given
classes or its own data attributes.

## Saving a person's choice

A view passes a person's saved value and save address for a key as props, such
as the ones keystone_ui-preferences gives a view:

```erb
<%= react_ui("app/months", keystone_component_preference("months")) %>
```

The UI draws from `value` and saves a new JSON object to `save_url` with
`savePreference`, which sends it with the page's CSRF token:

```javascript
import { savePreference } from "keystone_ui-react/src/preferences.js"

const saved = await savePreference(save_url, { hidden_columns: [ "pipeline" ] })
```

It resolves to `true` when the value is kept, and to `false` when the save
address refuses it or cannot be reached, in which case nothing was saved. A
visitor who is not signed in, or whose account does not let members choose, has
no save address, so the UI offers no save and `savePreference` sends nothing.
The page is not drawn again after a save, so the UI shows the new value from its
own state until the next page view.

## The controls

Each one takes keystone's classes and passes everything else through to the
element it draws:

`Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Input`, `Page`, `PageHeader`,
`Panel`, `RadioCard`, `Section`, `Select`, `Textarea`, and the form field text
`Label`, `Hint`, `FieldError` and `Required`.

```javascript
import Button from "keystone_ui-react/src/Button"

<Button variant="secondary" size="sm" onClick={save}>Save</Button>
```

`RadioCards` draws a group of radio cards, each a label with a hint line under
it, side by side in a row that wraps when the panel is too narrow. Only the card
whose value is `value` is chosen, and `onChange` gets each input's change event:

```javascript
import RadioCards from "keystone_ui-react/src/RadioCards"

<RadioCards
  name="alias"
  value={alias}
  onChange={(event) => setAlias(event.target.value)}
  options={[
    { value: "prod", label: "prod → v22", hint: "p 0.84 · n 1,920" },
    { value: "candidate", label: "candidate → v23", hint: "p 0.87 · n 240" }
  ]}
/>
```

`Tabs` draws the same tab row as keystone_ui's Rails tab switcher, then the
content of the tab whose value is `value` and no other. Choosing a tab calls
`onChange` with that tab's value. `align` is `"center"` (the default) or
`"start"`, and `shape` is left out or is `"pills"` or `"underline"`, as in the
Rails tab switcher. A tab's `count` is drawn after its label, in an info badge
in a row with no shape and as plain text in a shaped row. A number count shows
only when it is above zero, and a text count such as `"12/12"` shows as written.
On a phone the row stays on one line and scrolls sideways when the tabs do not
fit:

```javascript
import Tabs from "keystone_ui-react/src/Tabs"

<Tabs
  align="start"
  shape="underline"
  value={tab}
  onChange={setTab}
  tabs={[
    { value: "validation", label: "Validation", count: 1, content: <Issues /> },
    { value: "fixtures", label: "Fixtures", count: "12/12", content: <Fixtures /> },
    { value: "dry-run", label: "Dry-run", content: <DryRun /> }
  ]}
/>
```

`ValueList` draws the same list of labels and values as keystone_ui's Rails
value list. Each row has a `label` and a `value`, and may have a `note` shown
under the label, a `fallback` shown when the value is missing or empty, `total`
to draw it as a total row, and `right` to draw a right answer mark after the
value. `align: "end"` pushes each value to the right end of its row. `columns`
puts a small label above each value and lays the pairs in two columns, or one
on a phone, with a long value wrapping inside its own column:

```javascript
import ValueList from "keystone_ui-react/src/ValueList"

<ValueList
  columns
  rows={[
    { label: "Output format", value: "copy_block v3" },
    { label: "Timeout", value: "90s" },
    { label: "Context budget", value: "6k tokens · truncate" }
  ]}
/>
```

`Code` draws the same code block as keystone_ui's Rails code block, with an
optional `caption` above the code and an optional `language`. `Disclosure`
draws the same disclosure as keystone_ui's Rails disclosure: its `summary` is
the line a person clicks to open and close the content under it, and it starts
closed unless `open` is given:

```javascript
import Code from "keystone_ui-react/src/Code"
import Disclosure from "keystone_ui-react/src/Disclosure"

<Disclosure summary="output_schema" open>
  <Code caption="output_schema → copy_block v3">{"{headline: string≤60, body: string≤400}"}</Code>
</Disclosure>
```

They import nothing but React and each other, so an engine takes on no other
dependency by using them, and their look comes from keystone_ui-styles classes
on the page.

## Development

```bash
bundle install
npm install

bundle exec rake test   # the mount helper
npm test                # the controls, the registry and the save function
bin/rubocop
```

## Releasing

See [RELEASING.md](RELEASING.md). A release is not usable by an engine until its
git tag is on GitHub, because that tag is what the npm package resolves.

## License

MIT. See [MIT-LICENSE](MIT-LICENSE).
