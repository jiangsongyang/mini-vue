import { track, trigger } from './effect'

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
    const res = Reflect.get(target, key)
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
