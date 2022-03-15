import { isFun } from '../../shared'

type EffectOption = { scheduler?: () => void }
// 依赖工厂
class ReactiveEffect {
  public _fn
  public _scheduler

  constructor(fn: () => void, option: EffectOption = {}) {
    const { scheduler } = option
    this._fn = isFun(fn) ? fn : () => {}
    this._scheduler = isFun(scheduler) ? scheduler : null
  }
  run() {
    // 将当前依赖保存到全局 用于收集
    activeEffect = this
    // 执行依赖
    // 执行的过程中 会触发数据劫持
    // 从而触发 trigger 来收集刚赋值的 activeEffect
    return this._fn()
  }
}
// 当前执行的 effect fn
let activeEffect: ReactiveEffect

// 全局的依赖收集对象
const targetMap = new Map()

// 收集依赖
export function track<T>(target: T, key: string) {
  // 数据结构为
  // targetMap -> depsMap -> dep
  // 全局的 targetMap 最外层的大管家
  // 里面包含 depsMap 用于存储依赖集合
  // deps 为所有的依赖的集合
  let depsMap = targetMap.get(target)
  // 初始化的时候没有 depsMap
  // 创建 depsMap
  if (!depsMap) {
    depsMap = new Map()
    // 追加到全局的 依赖收集对象中
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  // 初始化时没有 deps
  if (!dep) {
    // 声明一个空集合
    dep = new Set()
    // 追加到 depsMap 中
    depsMap.set(key, dep)
  }
  // 依赖收集
  dep.add(activeEffect)
}

// 触发依赖
export function trigger<T>(target: T, key: string) {
  // 在全局依赖中取出 depsMap
  const depsMap = targetMap.get(target)
  // 拿到依赖的集合
  const dep = depsMap.get(key)
  // 遍历集合 执行依赖
  for (const effect of dep) {
    if (effect._scheduler) {
      effect._scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn: () => void, option?: EffectOption) {
  // 创建 effect 对象
  const _effect = new ReactiveEffect(fn, option)
  // 执行传入的 fn
  _effect.run()
  // 返回 runner
  return _effect.run.bind(_effect)
}
