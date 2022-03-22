import {
  mutableHandler,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'
import { isObj } from '../../shared'

export interface Target {
  [REACTIVE_FLAGS.IS_REACTIVE]?: boolean
  [REACTIVE_FLAGS.IS_READONLY]?: boolean
}

export enum REACTIVE_FLAGS {
  IS_REACTIVE = '__V_REACTIVE',
  IS_READONLY = '__V_READONLY',
}

export function reactive<T extends Object>(raw: T) {
  return createActiveObject(raw, mutableHandler)
}

// readonly 只有 get
export function readonly<T extends Object>(raw: T) {
  return createActiveObject<T>(raw, readonlyHandlers)
}

function createActiveObject<T extends Object>(raw: T, baseHandlers: any) {
  if (!isObj(raw)) {
    console.warn(`target : ${raw} must be a object`)
  }
  return new Proxy(raw, baseHandlers)
}

export function shallowReadonly<T extends object>(raw: T) {
  return new Proxy(raw, shallowReadonlyHandlers)
}

// isReactive 和 isReadOnly
// 思路为 : 触发 getter 根据 handler 中的 isReadOnly 判断
export function isReactive(value: unknown): boolean {
  return !!(value as Target)[REACTIVE_FLAGS.IS_REACTIVE]
}

export function isReadOnly(value: unknown): boolean {
  return !!(value as Target)[REACTIVE_FLAGS.IS_READONLY]
}

export function isProxy(value: unknown): boolean {
  return isReadOnly(value) || isReactive(value)
}
