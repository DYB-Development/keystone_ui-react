# Changelog

## [Unreleased]

### Added
- React controls matching keystone_ui's button, panel, section, page, page header, card, alert, badge, checkbox, input, select, textarea and form field text, styled with keystone_ui-styles classes.
- A registry an engine registers each React UI with under a name, and mounting that draws every registered UI on a page.
- A view helper that writes the element a React UI mounts into, carrying the UI's name and its props.
- A built script that puts React and the React DOM client on the page, so a page with several React engines loads React once, and modules an engine's build reads them back from.
