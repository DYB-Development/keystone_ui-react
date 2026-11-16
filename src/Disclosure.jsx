import React from "react"

const Disclosure = ({ summary, open = false, children }) => (
  <details className="ks-disclosure group" open={open}>
    <summary className="ks-disclosure-summary flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
      <span>{summary}</span>
    </summary>
    <div className="ks-disclosure-body text-sm">{children}</div>
  </details>
)

export default Disclosure
