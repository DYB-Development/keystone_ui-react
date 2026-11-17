import React from "react"
import { classes } from "./classes"

const Code = ({ language, caption, className, children }) => (
  <div className={classes("ks-code overflow-hidden", className)}>
    {caption != null && <div className="ks-code-caption font-mono text-xs">{caption}</div>}
    <pre className="ks-code-block overflow-x-auto font-mono text-sm leading-relaxed"><code className={language == null ? "" : `language-${language}`}>{children}</code></pre>
  </div>
)

export default Code
