import { isArr, isFun, isObj, ShapeFlags } from '../../shared'


/**
 *  插槽的原理
 *  1 : 默认插槽   =>   直接当成 vnode 去处理即可
 *  需要将 children 统一转换成数组 之后正常 patch
 * 
 *  2 : 具名插槽   =>   通过帮助方法 renderSlots 
 *  根据插槽名称形成对应的映射关系 之后正常 patch
 * 
 *  3 : 作用域插槽 =>   传入的子节点为函数类型 返回 renderSlots 通过函数的参数来传递状态
 *  需要将 children 中的 function child 转换成一个函数
 */

export const initSlots = (instance, children) => {
  const { shapeFlag } = instance.vnode
  if (shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalObjectSlots(instance, children)
  }
}

function normalObjectSlots(instance, children) {
  // 处理作用域插槽 和 具名插槽
  if (isObj(children)) {
    for (const key in children) {
      const child = children[key]
      // 作用域插槽需要包裹成 function
      if (isFun(child)) {
        instance.slots[key] = (v) => normalizeSlotsValue(child(v))
      } 
      // 具名插槽
      else {
        instance.slots[key] = normalizeSlotsValue(child)
      }
    }
  } 
  // 处理默认插槽
  else if (isArr(children)) {
    instance.slots = normalizeSlotsValue(children)
  }
}

// 将子节点转换成为数组
function normalizeSlotsValue(value: unknown) {
  return isArr(value) ? value : [value]
}
