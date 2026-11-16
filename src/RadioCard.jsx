import React from "react"

const RadioCard = ({ name, value, label, ...rest }) => (
  <label className="inline-block cursor-pointer relative">
    <input type="radio" name={name} value={value} {...rest} className="peer sr-only" />
    <span className="ks-radio-card inline-flex flex-col cursor-pointer transition ks-radio-card-highlight">
      <span className="ks-radio-card-header flex items-start justify-between">
        <span className="ks-radio-card-label block">{label}</span>
      </span>
    </span>
  </label>
)

export default RadioCard
