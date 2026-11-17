const sortedAttributes = (attributes) =>
  [ ...attributes.matchAll(/([\w-]+)(?:="([^"]*)")?/g) ].map(([ , name, value = "" ]) => `${name}="${value}"`).sort().join(" ")

export const normalized = (html) =>
  html.replace(/>\s+/g, ">").replace(/\s+</g, "<").trim().replace(/<([a-z]+)([^>]*?)\/?>/g, (_, tag, attributes) => `<${tag} ${sortedAttributes(attributes)}>`).replace(/<\/path>/g, "")
