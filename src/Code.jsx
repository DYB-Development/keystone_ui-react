import React from "react"

const Code = ({ children }) => (
  <div className="ks-code overflow-hidden">
    <pre className="ks-code-block overflow-x-auto font-mono text-sm leading-relaxed"><code>{children}</code></pre>
  </div>
)

export default Code
