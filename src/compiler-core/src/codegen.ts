import { NodeTypes } from './ast'

export function generate(ast) {
  const context = createCodegenContext()

  const { push } = context

  genFunctionPreanble(ast, context)

  const functionName = 'render'
  const args = ['_ctx , _cache']
  const signature = args.join(',')

  push(`function ${functionName}(${signature}) {`)
  push(`return`)
  genNode(ast.codegenNode, context)
  push('}')

  return {
    code: context.code,
  }
}

function genFunctionPreanble(ast, context) {
  const { push } = context
  const VueBegining = `Vue`

  const aliasHelper = (s: string) => `${s}: _${s}`

  if (ast.helpers.length > 0) {
    push(
      `const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBegining}`
    )
    push('\n')
  }
  push('return ')
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
  }
  return context
}

function genNode(node, context) {
  switch (node.type) {
    // text
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break

    default:
      break
  }
}

function genText(node, context) {
  const { push } = context
  push(` '${node.content}'`)
}

function genInterpolation(node, context) {
  const { push } = context
  push(` _toDisplayString(`)
  genNode(node.content, context)
  push(')')
}

function genExpression(node, context) {
  const { push } = context
  push(`${node.content}`)
}
