/**
 *
 *  transform 的核心职责
 *  就是对 parser 生成的 ast 树
 *  进行增删改查
 *
 */

export function transform(root, options) {
  const context = createTransformsContext(root, options)

  // 1 . 遍历 - 深度优先搜索
  traverseNode(root, context)
}

function traverseNode(node: any, context) {
  // 1 . 进行转换
  //     通过全局上下文 注册的 plugins
  //     使程序有稳定的执行逻辑
  //     定制化需求从外部传入
  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const nodeTransform = nodeTransforms[i]
    nodeTransform(node)
  }

  traverseChildren(node, context)
}

function traverseChildren(node, context) {
  const children = node.children

  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}

function createTransformsContext(root, options) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  }
  return context
}