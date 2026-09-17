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

## The controls

Each one takes keystone's classes and passes everything else through to the
element it draws:

`Alert`, `Badge`, `Button`, `Card`, `Checkbox`, `Input`, `Page`, `PageHeader`,
`Panel`, `Section`, `Select`, `Textarea`, and the form field text `Label`,
`Hint`, `FieldError` and `Required`.

```javascript
import Button from "keystone_ui-react/src/Button"

<Button variant="secondary" size="sm" onClick={save}>Save</Button>
```

They import nothing but React and each other, so an engine takes on no other
dependency by using them, and their look comes from keystone_ui-styles classes
on the page.

## Development

```bash
bundle install
npm install

bundle exec rake test   # the mount helper
npm test                # the controls and the registry
bin/rubocop
```

## Releasing

See [RELEASING.md](RELEASING.md). A release is not usable by an engine until its
git tag is on GitHub, because that tag is what the npm package resolves.

## License

MIT. See [MIT-LICENSE](MIT-LICENSE).
