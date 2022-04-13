import { codegen } from './codegen'
import { baseParse } from './parser'
import { transform } from './transform'
import { transformElement } from './transforms/transformElement'
import { transformExpression } from './transforms/transformExpression'
import { transformText } from './transforms/transformText'

export function baseCompile(template: string) {
  const ast = baseParse(template)
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText],
  })
  const code = codegen(ast)
  return {
    code,
  }
}