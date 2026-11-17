import React from "react"
import { classes } from "./classes"

const Caret = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
)

const Disclosure = ({ summary, open = false, className, children }) => (
  <details className={classes("ks-disclosure group", className)} open={open}>
    <summary className="ks-disclosure-summary flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
      <span>{summary}</span>
      <span className="ks-disclosure-icon h-4 w-4 shrink-0 transition-transform group-open:rotate-180"><Caret /></span>
    </summary>
    <div className="ks-disclosure-body text-sm">{children}</div>
  </details>
)

export default Disclosure
