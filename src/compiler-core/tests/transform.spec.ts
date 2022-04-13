import { transform } from '../src/transform'
import { baseParse } from '../src/parser'
import { NodeType } from '../src/ast'

describe('transform', () => {
  it('happy path', () => {
    const ast = baseParse(`<div>hi , {{message}}</div>`)

    const plugin = (node: any) => {
      if (node.type === NodeType.TEXT) {
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
