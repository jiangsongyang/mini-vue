import { createVNode } from './vnode'
import { render } from './renderer'
import { isStr, isElement } from '../../shared'

// 入口函数
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 只能接受 真实DOM || string selector
      if (!isElement(rootContainer) && isStr(rootContainer)) {
        rootContainer = document.querySelector(rootContainer)
      } else {
        console.warn(
          'mount function only element nodes and selectors can be accepted'
        )
      }

      // NOTE
      // 先将组件转换成 vnode
      // 所有的逻辑操作 都是基于 vnode 的
      const vnode = createVNode(rootComponent)
      // 拿到 vnode 后 执行 render(vue内部实现的 render 方法, 不是 render 函数)
      render(vnode, rootContainer)
    },
  }
}
