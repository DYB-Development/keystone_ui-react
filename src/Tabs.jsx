import React from "react"
import Badge from "./Badge"

const Tabs = ({ tabs, value, onChange }) => (
  <div>
    <div className="ks-tab-bar">
      {tabs.map((tab) => (
        <button key={tab.value} type="button" className="ks-tab" data-active={tab.value === value ? "" : undefined} onClick={() => onChange(tab.value)}>
          {tab.label}{tab.count != null && <>{" "}<Badge variant="info">{tab.count}</Badge></>}
        </button>
      ))}
    </div>
    {tabs.find((tab) => tab.value === value)?.content}
  </div>
)

export default Tabs
