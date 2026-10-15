const csrfToken = (page) => page.querySelector('meta[name="csrf-token"]')?.content

export const savePreference = (saveUrl, value, page = document, send = fetch) => {
  if (!saveUrl) return Promise.resolve(false)

  return send(saveUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken(page) },
    body: JSON.stringify(value)
  }).then((response) => response.ok, () => false)
}
