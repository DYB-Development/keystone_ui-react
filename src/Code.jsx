import React from "react"

const Code = ({ language, caption, children }) => (
  <div className="ks-code overflow-hidden">
    {caption != null && <div className="ks-code-caption font-mono text-xs">{caption}</div>}
    <pre className="ks-code-block overflow-x-auto font-mono text-sm leading-relaxed"><code className={language && `language-${language}`}>{children}</code></pre>
  </div>
)

export default Code
