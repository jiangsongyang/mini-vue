import { track, trigger } from './effect'
import { reactive, readonly, REACTIVE_FLAGS } from './reactive'
import { isObj, isArr } from '../../shared'

// common getter && setter
// use for
// reactive
const get = createGetter()
const set = createSetter()

// readonly getter && setter
// use for
// readonly
const readonlyGet = createGetter(true)

function createGetter(isReadOnly: boolean = false) {
  return function get(target: any, key: string) {
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
  return function set(target: any, key: string, value: unknown) {
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
export const readonlyHandler = {
  get: readonlyGet,
  set(t: any, key: string) {
    // 给出警告
    console.warn(
      `key : ${key} set fail , because set target is a readonly object`
    )
    return true
  },
}
