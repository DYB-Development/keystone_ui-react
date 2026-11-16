# Changelog

## [Unreleased]

## [0.5.0] - 2026-11-16

### Added
- A value list that draws the same markup as keystone_ui's Rails value list, with a note under a label, a fallback for a missing value, a total row, a right answer mark and values pushed to the right end of their rows.
- A columns option on the value list that puts a small label above each value and lays the pairs in two columns on a wider screen and one on a phone, with a long value wrapping inside its own column.
- A code block that draws the same markup as keystone_ui's Rails code block, with an optional caption above the code and an optional language.
- A disclosure that draws the same markup as keystone_ui's Rails disclosure, a summary line a person clicks to open and close the content under it, starting closed unless it is told to start open.

## [0.4.0] - 2026-11-16

### Added
- A tab row that draws the same markup as keystone_ui's Rails tab switcher drawn as buttons, with its start alignment, its pill and underlined shapes and a count after each tab's label. It marks the chosen tab, calls back with the tab a person chooses, shows only the chosen tab's content, and stays on one line that scrolls sideways on a phone.

## [0.3.0] - 2026-11-16

### Added
- A radio card that draws the same markup as keystone_ui's Rails radio card, a label with a hint line under it, and a group of radio cards that marks only the chosen card and sets the cards side by side in a row that wraps in a narrow panel.

## [0.2.0] - 2026-10-15

### Added
- A save function a React UI calls to save a person's new choice as a JSON object to the save address its view gave it, sending the page's CSRF token. It resolves to true when the value is kept and to false when the address refuses it or cannot be reached, and it sends nothing when the UI has no save address.

## [0.1.3] - 2026-09-16

### Fixed
- A React UI now appears on a page reached by a Turbo visit, not only on a page loaded fresh, and it is taken down before Turbo keeps a copy of the page so going back does not show a stale one. An engine gets this by starting mounting once, in place of drawing the UIs itself.

## [0.1.2] - 2026-09-16

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
