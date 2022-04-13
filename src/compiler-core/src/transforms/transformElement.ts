import { createVNodeCall, NodeType } from '../ast'

export function transformElement(node, context) {
  if (node.type === NodeType.ELEMENT) {
    return () => {
      // 中间处理层，处理 props 和 tag
      const vnodeTag = `'${node.tag}'`
      const vnodeProps = node.props

      const { children } = node
      const vnodeChildren = children

      node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren
      )
    }
  }
}