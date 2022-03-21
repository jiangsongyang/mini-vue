import { trackEffects, triggerEffects, isTracking, Dep } from '../src/effect'
import { reactive, isReactive } from '../src/reactive'
import { hasChanged, isObj } from '../../shared'
import { shallowUnwrapHandlers } from './baseHandlers'

export declare const RefSymbol: unique symbol
export interface Ref<T = any> {
  value: T
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true
  /**
   * @internal
   */
  _shallow?: boolean
}

// ref 的构造类
// 劫持这个 class 的
// get value 和 set value
class RefImpl<T> {
  // 依赖集合
  public dep: Dep
  // get return 的值
  private _value
  // 因为 如果传入对象
  // _value 在 初始化时已经被处理成 proxy 了
  // 所以需要 _rawValue 来保存原始值 用于更新对比
  public _rawValue
  public __V_IS_REF: boolean = true
  constructor(value: T) {
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

function trackRefValue(ref: RefImpl<unknown>) {
  // 如果可以收集依赖
  // 防止没调用 effect 直接 get
  if (isTracking()) {
    trackEffects(ref.dep as Dep)
  }
}

export function isRef(r: any): boolean {
  return !!r.__V_IS_REF
}

export function unRef(raw: any): boolean {
  return isRef(raw) ? raw._rawValue : raw
}

// 为什么在 <template> 中读取 ref 不需要 ref.value
// 就是因为在这个函数中劫持了 get
export function proxyRefs<T extends object>(objectWithRefs: T) {
  return isReactive(objectWithRefs)
    ? objectWithRefs
    : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}
