import { transform } from '../src/transform'
import { baseParser } from '../src/parser'
import { NodeTypes } from '../src/ast'

describe('transform', () => {
  it('happy path', () => {
    const ast = baseParser(`<div>hi , {{message}}</div>`)

    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content + 'mini-vue'
      }
    }

    transform(ast, {
      nodeTransforms: [plugin],
    })
    const nodeText = ast.children[0].children[0]
    expect(nodeText.content).toBe('hi , mini-vue')
  })
})
