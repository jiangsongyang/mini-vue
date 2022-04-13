import { NodeType } from '../ast'

export function transformExpression(node) {
  if (node.type === NodeType.INTERPOLATION) {
    node.content = processExpression(node.content)
  }
}

function processExpression(node) {
  node.content = `_ctx.${node.content}`
  return node
}