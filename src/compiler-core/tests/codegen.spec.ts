import { codegen } from '../src/codegen'
import { baseParse } from '../src/parser'
import { transform } from '../src/transform'
import { transformElement } from '../src/transforms/transformElement'
import { transformExpression } from '../src/transforms/transformExpression'
import { transformText } from '../src/transforms/transformText'

describe('codegen', () => {
  test('text', () => {
    const template = 'hi'
    const ast = baseParse(template)
    transform(ast)
    const code = codegen(ast)
    expect(code).toMatchSnapshot()
  })
  test('interpolation', () => {
    const template = '{{message}}'
    const ast = baseParse(template)
    transform(ast, {
      nodeTransforms: [transformExpression],
    })
    const code = codegen(ast)
    expect(code).toMatchSnapshot()
  })
  test('simple element', () => {
    const template = '<div></div>'
    const ast = baseParse(template)
    transform(ast, {
      nodeTransforms: [transformElement],
    })
    const code = codegen(ast)
    expect(code).toMatchSnapshot()
  })
  test('union 3 type', () => {
    const template = '<div>hi,{{message}}</div>'
    const ast = baseParse(template)
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    })
    const code = codegen(ast)
    expect(code).toMatchSnapshot()
  })
})