import React from "react"
import Badge from "./Badge"

const ROW_CLASSES = "ks-tab-bar flex flex-wrap justify-center max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:justify-start"

const TAB_CLASSES = "ks-tab text-sm transition max-sm:shrink-0 max-sm:whitespace-nowrap"

const shown = (count) => typeof count === "string" ? count !== "" : count > 0

const Tabs = ({ tabs, value, onChange }) => (
  <div>
    <div className={ROW_CLASSES}>
      {tabs.map((tab) => (
        <button key={tab.value} type="button" className={TAB_CLASSES} data-active={tab.value === value ? "" : undefined} onClick={() => onChange(tab.value)}>
          {tab.label}{shown(tab.count) && <>{" "}<Badge variant="info">{tab.count}</Badge></>}
        </button>
      ))}
    </div>
    {tabs.find((tab) => tab.value === value)?.content}
  </div>
)

export default Tabs
