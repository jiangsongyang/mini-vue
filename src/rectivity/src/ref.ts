import { trackEffects, triggerEffects, isTracking } from '../src/effect'
import { reactive } from '../src/reactive'
import { hasChanged, isObj } from '../../shared'

// ref 的构造类
// 劫持这个 class 的
// get value 和 set value
class RefImpl {
  // 依赖集合
  public dep
  // get return 的值
  private _value
  // 因为 如果传入对象
  // _value 在 初始化时已经被处理成 proxy 了
  // 所以需要 _rawValue 来保存原始值 用于更新对比
  public _rawValue
  public __V_IS_REF: boolean = true
  constructor(value: any) {
    this._rawValue = value
    this._value = convert(value)
    this.dep = new Set()
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    // 防止 赋相同的值
    // 会导致重新 trigger
    if (!hasChanged(newValue, this._rawValue)) return
    // set
    this._value = convert(newValue)
    this._rawValue = newValue
    // trigger
    triggerEffects(this.dep)
  }
}

function convert(value: any) {
  return isObj(value) ? reactive(value) : value
}

// ref 函数入口
export function ref<T>(value: T) {
  return createRefImp(value)
}

function createRefImp<T>(value: T) {
  return new RefImpl(value)
}

function trackRefValue(ref: RefImpl) {
  // 如果可以收集依赖
  // 防止没调用 effect 直接 get
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

export function isRef(raw: any) {
  return !!raw.__V_IS_REF
}

export function unRef(raw: any) {
  return isRef(raw) ? raw._rawValue : raw
}

// 为什么在 <template> 中读取 ref 不需要 ref.value
// 就是因为在这个函数中劫持了 get
export function proxyRefs(objectWithRef: any) {
  return new Proxy(objectWithRef, {
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
  })
}
