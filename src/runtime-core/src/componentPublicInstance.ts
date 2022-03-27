import { hasOwn } from '../../shared'

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
}

export const publicInstanceProxyHandler = {
  get({ _: instance }, key: string) {
    console.log('当前访问的 key 为: ', key);
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
