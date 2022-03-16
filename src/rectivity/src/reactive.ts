import { mutableHandler, readonlyHandler } from './baseHandlers'

export function reactive<T extends Object>(raw: T) {
  return createActiveObject(raw, mutableHandler)
}

// readonly 只有 get
export function readonly<T extends Object>(raw: T) {
  return createActiveObject<T>(raw, readonlyHandler)
}

function createActiveObject<T extends Object>(raw: T, baseHandlers: any) {
  return new Proxy(raw, baseHandlers)
}
