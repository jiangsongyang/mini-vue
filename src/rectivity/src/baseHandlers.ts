import { track, trigger } from './effect'
import { reactive, readonly, REACTIVE_FLAGS } from './reactive'

import { unRef, isRef } from './ref'
import { isObj, isArr, extend } from '../../shared'

// common getter && setter
// use for
// reactive
const get = createGetter()
const set = createSetter()

// readonly getter && setter
// use for
// readonly
const readonlyGet = createGetter(true)

// shallowReadonly getter && setter
//
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadOnly: boolean = false, shallow = false) {
  return function get(target: object, key: string) {
    // 处理 isReadOnly 和 isReactive
    // 触发 getter 时 如果 key 为
    // IS_REACTIVE || IS_READONLY
    // 则提前 return
    if (key === REACTIVE_FLAGS.IS_REACTIVE) {
      return !isReadOnly
    } else if (key === REACTIVE_FLAGS.IS_READONLY) {
      return isReadOnly
    }

    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    // 判断 res 是否是 Object
    // 如果是嵌套的结构
    if (isObj(res) || isArr(res)) {
      return isReadOnly ? readonly(res) : reactive(res)
    }
    if (!isReadOnly) {
      // 需要进行依赖的收集
      track(target, key)
    }
    return res
  }
}

function createSetter(isReadOnly: boolean = false) {
  return function set(target: object, key: string | symbol, value: unknown) {
    const res = Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return res
  }
}

// 不可变的 proxy 处理器
export const mutableHandler = {
  get,
  set,
}

// readonly 的 proxy 处理器
export const readonlyHandlers = {
  get: readonlyGet,
  set(t: object, key: string) {
    // 给出警告
    console.warn(
      `key : ${key} set fail , because set target is a readonly object`
    )
    return true
  },
}

// shallowReadonly 的 proxy 处理器
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})

export const shallowUnwrapHandlers = {
  // 在 get 时调用 unRef 拆包
  get(target: any, key: string) {
    return unRef(Reflect.get(target, key))
  },
  set(target: any, key: string, value: any) {
    // 如果 set 的目标是 ref
    // 并且
    // set value 不是 ref
    // 就给目标 ref 直接 .value 赋值
    if (isRef(target[key]) && !isRef(value)) {
      return (target[key].value = value)
    } else {
      // 目标不是 ref
      // 或者
      // set value 是 ref
      return Reflect.set(target, key, value)
    }
  },
}
