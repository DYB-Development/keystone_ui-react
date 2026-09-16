# Changelog

## [Unreleased]

### Fixed
- A package an engine depends on that imports React DOM itself, rather than its client, now reads the page's React DOM too, so the engine's script no longer carries a copy of React DOM.

## [0.1.1] - 2026-09-16

### Added
- A module an engine's build reads React's automatic JSX runtime back from, so a package that draws with that runtime rather than with `createElement` uses the page's React too.

## [0.1.0] - 2026-09-16

### Added
- React controls matching keystone_ui's button, panel, section, page, page header, card, alert, badge, checkbox, input, select, textarea and form field text, styled with keystone_ui-styles classes.
- A registry an engine registers each React UI with under a name, and mounting that draws every registered UI on a page.
- A view helper that writes the element a React UI mounts into, carrying the UI's name and its props.
- A built script that puts React and the React DOM client on the page, so a page with several React engines loads React once, and modules an engine's build reads them back from.
