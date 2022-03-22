import { isFun } from '../../../shared'
import { createVNode } from '../vnode'

// 帮助方法
// 在 render function 中调用这个方法
// 用来处理插槽
export function renderSlots(slots, name, props) {
  // 处理 具名插槽 和 作用域插槽
  const slot = slots[name]
  if (slot) {
    //作用域插槽
    if (isFun(slot)) {
      return createVNode('div', {}, slot(props))
    } 
    // 具名插槽
    else {
      return createVNode('div', {}, slot)
    }
  }
  // 匿名插槽
  else {
    return createVNode('div', {}, slots)
  }
}
