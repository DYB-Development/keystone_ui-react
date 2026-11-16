import React from "react"

const Tabs = ({ tabs, value }) => (
  <div>
    <div className="ks-tab-bar">
      {tabs.map((tab) => (
        <button key={tab.value} type="button" className="ks-tab" data-active={tab.value === value ? "" : undefined}>{tab.label}</button>
      ))}
    </div>
  </div>
)

export default Tabs
