import React from "react"

const Tabs = ({ tabs }) => (
  <div>
    <div className="ks-tab-bar">
      {tabs.map((tab) => (
        <button key={tab.value} type="button" className="ks-tab">{tab.label}</button>
      ))}
    </div>
  </div>
)

export default Tabs
