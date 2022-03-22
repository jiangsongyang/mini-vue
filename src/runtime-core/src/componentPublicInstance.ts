import { hasOwn } from '../../shared'

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
}

export const publicInstanceProxyHandler = {
  get({ _: instance }, key: string) {
    const { setupResult, props } = instance
    if (hasOwn(setupResult, key)) {
      return setupResult[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) return publicGetter(instance)
  },
}
