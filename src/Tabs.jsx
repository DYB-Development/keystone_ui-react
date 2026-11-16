import React from "react"

const Tabs = ({ tabs, value, onChange }) => (
  <div>
    <div className="ks-tab-bar">
      {tabs.map((tab) => (
        <button key={tab.value} type="button" className="ks-tab" data-active={tab.value === value ? "" : undefined} onClick={() => onChange(tab.value)}>{tab.label}</button>
      ))}
    </div>
  </div>
)

export default Tabs
