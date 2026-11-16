import React from "react"

const shownValue = ({ value, fallback }) => String(value ?? "") === "" ? fallback : value

const ValueList = ({ rows }) => (
  <dl className="ks-value-list">
    {rows.map((row, index) => (
      <div key={index} className="ks-value-list-row">
        <dt className="ks-value-list-label">{row.label}{row.note != null && <>{" "}<span className="ks-value-list-note">{row.note}</span></>}</dt>
        <dd className="ks-value-list-value">{shownValue(row)}</dd>
      </div>
    ))}
  </dl>
)

export default ValueList
