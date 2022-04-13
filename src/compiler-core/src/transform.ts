import { NodeType } from './ast'
import { HelperNameMapping, TO_DISPLAY_STRING } from './runtimeHelpers'

export function transform(root, options = {}) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  createRootCodegen(root)
  root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root) {
  const child = root.children[0]
  if (child.type === NodeType.ELEMENT) {
    root.codegenNode = child.codegenNode
  } else {
    root.codegenNode = root.children[0]
  }
}

function createTransformContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || {},
    helpers: new Map(),
    helper(name: string) {
      context.helpers.set(name, 1)
    },
  }
  return context
}

function traverseNode(node, context) {
  const { nodeTransforms } = context
  const exitFns: any[] = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    const exitFn = transform(node, context)
    if (exitFn) exitFns.push(exitFn)
  }
  switch (node.type) {
    case NodeType.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break
    case NodeType.ROOT:
    case NodeType.ELEMENT:
      traverseChildren(node, context)
      break
    default:
      break
  }
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

function traverseChildren(node, context) {
  const children = node.children
  for (let i = 0; i < children.length; i++) {
    traverseNode(children[i], context)
  }
}