import React from "react"
import RadioCard from "./RadioCard"

const RadioCards = ({ name, options, value, onChange }) => (
  <div className="flex flex-wrap ks-grid-gap-sm">
    {options.map((option) => (
      <RadioCard key={option.value} name={name} {...option} checked={option.value === value} onChange={onChange} />
    ))}
  </div>
)

export default RadioCards
