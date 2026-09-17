import React from "react"

const registered = new Map()
const drawn = new Map()

export const register = (name, component) => registered.set(name, component)

export const unmountAll = () => {
  drawn.forEach((root) => root.unmount())
  drawn.clear()
}

export const mountAll = (page, createRoot) =>
  page.querySelectorAll("[data-react-ui]").forEach((element) => {
    if (drawn.has(element)) return

    const Component = registered.get(element.dataset.reactUi)
    const root = createRoot(element)
    drawn.set(element, root)
    root.render(React.createElement(Component, JSON.parse(element.dataset.props)))
  })
