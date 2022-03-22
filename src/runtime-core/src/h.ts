import { createVNode, isVNode, VNode } from './vnode'
import { isObj, isArr } from '../../shared'

// 向外暴露的 render 函数 API
// 目标是创建 VNode
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  // 处理函数入参
  const l = arguments.length
  if (l === 2) {
    if (isObj(propsOrChildren) && !isArr(propsOrChildren)) {
      // single vnode without props
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // props without children
      return createVNode(type, propsOrChildren)
    } else {
      // omit props
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
