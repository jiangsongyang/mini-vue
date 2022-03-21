import { createVNode } from './vnode'
import { render } from './renderer'
import { isStr } from '../../shared'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      if (isStr(rootContainer)) {
        rootContainer = document.querySelector(rootContainer)
      }

      // NOTE
      // 先将组件转换成 vnode
      // 所有的逻辑操作 都是基于 vnode 的
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    },
  }
}
