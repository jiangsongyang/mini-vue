import { NodeType } from './ast'

export function isText(node) {
  return node.type === NodeType.TEXT || node.type === NodeType.INTERPOLATION
}