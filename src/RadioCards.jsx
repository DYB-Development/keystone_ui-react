import React from "react"
import RadioCard from "./RadioCard"
import { classes } from "./classes"

const RadioCards = ({ name, options, value, onChange, className }) => (
  <div className={classes("flex flex-wrap ks-grid-gap-sm", className)}>
    {options.map((option) => (
      <RadioCard key={option.value} name={name} {...option} checked={option.value === value} onChange={() => onChange(option.value)} />
    ))}
  </div>
)

export default RadioCards
