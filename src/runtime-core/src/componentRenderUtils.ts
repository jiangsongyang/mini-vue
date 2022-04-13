export function renderComponentRoot(instance) {
  const { render, proxy } = instance
  const result = render.call(proxy, proxy)
  return result
}