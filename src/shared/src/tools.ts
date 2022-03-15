export const isFun = (fn: unknown) =>
  Object.prototype.toString.call(fn) === '[object Function]'
