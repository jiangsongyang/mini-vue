export const initProps = (instance, rawProps) => {
  // 初始化根组件时没有 props 会导致处理失效
  // 所以这里加上 || {}
  instance.props = rawProps || {}
}
