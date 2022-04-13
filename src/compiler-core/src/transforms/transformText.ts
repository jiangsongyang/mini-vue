import { NodeType } from '../ast'
import { isText } from '../utils'

export function transformText(node) {
  return () => {
    const { children } = node
    if (children && children.length) {
      let currentContainer
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isText(child)) {
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j]
            if (isText(next)) {
              // 相邻的是 text 或者 interpolation，那么就变成联合类型
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeType.COMPOUND_EXPRESSION,
                  children: [child],
                }
              }
              // 在每个相邻的下一个之前加上一个 +
              currentContainer.children.push(' + ')
              currentContainer.children.push(next)
              // 遇到就删除
              children.splice(j, 1)
              // 修正索引，因为我们下一个循环就又 + 1 了。此时索引就不对了
              j -= 1
            } else {
              // 如果下一个不是 text 的了，那么就重置，并跳出循环
              currentContainer = undefined
              break
            }
          }
        }
      }
    }
  }
}