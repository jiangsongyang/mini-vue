const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
}

export const publicInstanceProxyHandler = {
  get({ _: instance }, key) {
    const { setupResult } = instance
    if (key in setupResult) {
      return setupResult[key]
    }
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) return publicGetter(instance)
  },
}
