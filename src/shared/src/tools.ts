export const TYPE_MAP = {
  string: '[object String]',
  number: '[object Number]',
  boolean: '[object Boolean]',
  null: '[object Null]',
  undefined: '[object Undefined]',
  object: '[object Object]',
  array: '[object Array]',
  function: '[object Function]',
  symbol: '[object Symbol]',
}

export const getTypeString = (tar: unknown) =>
  Object.prototype.toString.call(tar)

export const isStr = (tar: unknown) => getTypeString(tar) === TYPE_MAP.string

export const isNum = (tar: unknown) => getTypeString(tar) === TYPE_MAP.number

export const isBoolean = (tar: unknown) =>
  getTypeString(tar) === TYPE_MAP.boolean

export const isNull = (tar: unknown) => getTypeString(tar) === TYPE_MAP.null

export const isUndefined = (tar: unknown) =>
  getTypeString(tar) === TYPE_MAP.undefined

export const isDef = (tar: unknown) => getTypeString(tar) !== TYPE_MAP.undefined

export const isObj = (tar: unknown) => getTypeString(tar) === TYPE_MAP.object

export const isArr = (tar: unknown) => getTypeString(tar) === TYPE_MAP.array

export const isFun = (tar: unknown) => getTypeString(tar) === TYPE_MAP.function

export const extend = Object.assign

export const hasChanged = (val: unknown, newVal: unknown) =>
  !Object.is(val, newVal)

export const isElement = (target: any) => target.nodeType === 1

export const isOn = (target: string) => /^on[A-Z]/.test(target)

export const hasOwn = (value: any, key: string) =>
  Object.prototype.hasOwnProperty.call(value, key)

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

  export const toHandlerKey = (str: string) => (str ? `on${capitalize(str)}` : '')

const camelizeRE = /-(\w)/g

export const camelize = (str: string) =>
  str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
