import { CREATE_ELEMENT_VNODE } from './runtimeHelpers'

export const enum NodeType {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION,
}

export function createVNodeCall(context, tag, props, children) {
  context.helper(CREATE_ELEMENT_VNODE)
  return {
    type: NodeType.ELEMENT,
    tag,
    props,
    children,
  }
}