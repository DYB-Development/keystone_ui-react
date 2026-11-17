import React from "react"
import { classes } from "./classes"

const RadioCard = ({ name, value, label, hint, className, ...rest }) => (
  <label className="inline-block cursor-pointer relative">
    <input type="radio" name={name} value={value} {...rest} className={classes("peer sr-only", className)} />
    <span className="ks-radio-card inline-flex flex-col cursor-pointer transition ks-radio-card-highlight">
      <span className="ks-radio-card-header flex items-start justify-between">
        <span className="ks-radio-card-label block">{label}</span>
      </span>
      {hint != null && <span className="ks-radio-card-hint block text-sm">{hint}</span>}
    </span>
  </label>
)

export default RadioCard
