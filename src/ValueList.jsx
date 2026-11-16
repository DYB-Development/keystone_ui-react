import React from "react"
import { classes } from "./classes"

const ALIGN_CLASSES = { start: null, end: "ks-value-list-end" }

const COLUMNS_CLASSES = "grid grid-cols-1 sm:grid-cols-2 ks-grid-gap-sm"

const PAIR_CLASSES = "flex flex-col"

const PAIR_LABEL_CLASSES = "ks-value-list-label basis-auto text-xs"

const RightMark = () => (
  <svg aria-label="Right" role="img" className="ks-tone-success inline size-5 align-text-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
)

const shownValue = ({ value, fallback }) => String(value ?? "") === "" ? fallback : value

const ValueList = ({ rows, align = "start", columns = false }) => (
  <dl className={classes("ks-value-list", ALIGN_CLASSES[align], columns && COLUMNS_CLASSES)}>
    {rows.map((row, index) => (
      <div key={index} className={classes(columns ? PAIR_CLASSES : "ks-value-list-row", row.total && "ks-value-list-total")}>
        <dt className={columns ? PAIR_LABEL_CLASSES : "ks-value-list-label"}>{row.label}{row.note != null && <>{" "}<span className="ks-value-list-note">{row.note}</span></>}</dt>
        <dd className="ks-value-list-value">{shownValue(row)}{row.right && <>{" "}<RightMark /></>}</dd>
      </div>
    ))}
  </dl>
)

export default ValueList
