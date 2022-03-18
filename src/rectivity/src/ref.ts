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
