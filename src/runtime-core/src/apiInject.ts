import { getCurrentInstance } from './component'

// 注册
export function provide<T>(key: string, value: T) {
  const currentInstance = getCurrentInstance()
  // NOTE
  // provide 只能在 setup 中使用
  if (currentInstance) {
    currentInstance.provides[key] = value
  } else {
    console.warn('provide only can be called in setup')
  }
}

// 消费
export function inject<T>(key: string, DefaultValue: T) {
  const currentInstance = getCurrentInstance()
  // NOTE
  // inject 只能在 setup 中使用
  if (currentInstance) {
    return currentInstance.parent.provides[key] || DefaultValue
  } else {
    console.warn('inject only can be called in setup')
    return false
  }
}

// NOTE :
// 如果父组件有 provides 就用父组件的
// 由于解析组件是自下向上的
// 所以就完成了 透传的效果
export function initProvides(parent) {
  const provides = parent // 如果存在父节点 ( 处理根组件的情况 )
    ? parent.provides // 如果父组件有 provides
      ? parent.provides // 就返回父组件的 provides
      : (parent.provides = {}) // 没有的话 就给父组件的 provides 注册成 {}
    : {}
  return provides
}
