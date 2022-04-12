import { baseParser } from '../src/parser'
import { transform } from '../src/transform'
import { generate } from '../src/codegen'

describe('codegen', () => {
  it('string', () => {
    const ast = baseParser(`hi 1`)
    transform(ast)
    
    const { code } = generate(ast)

    expect(code).toMatchSnapshot()
  })
})
