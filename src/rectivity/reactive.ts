import { track, trigger } from './effect'

export function reactive<T extends Object>(raw: T) {
  return new Proxy(raw, {
    get(target: T, key: string) {
      const res = Reflect.get(target, key)
      // 需要进行依赖的收集
      track(target, key)
      return res
    },
    set(target: T, key: string, value: unknown) {
      const res = Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return res
    },
  })
}
