import React from "react"

const Disclosure = ({ summary }) => (
  <details className="ks-disclosure group">
    <summary className="ks-disclosure-summary flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
      <span>{summary}</span>
    </summary>
  </details>
)

export default Disclosure
