import { baseParser } from '../src/parser'
import { transform } from '../src/transform'
import { generate } from '../src/codegen'
import { transformExpression } from '../src/transforms/transformExpression'

describe('codegen', () => {
  it('string', () => {
    const ast = baseParser(`hi 1`)
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('interpolation', () => {
    const ast = baseParser(`{{message}}`)
    transform(ast, {
      nodeTransforms: [transformExpression],
    })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})
