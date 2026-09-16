import React from "react"
import * as ReactDOM from "react-dom"
import * as ReactDOMClient from "react-dom/client"

globalThis.React = React
globalThis.ReactDOM = { ...ReactDOM, ...ReactDOMClient }
