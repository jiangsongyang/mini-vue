import { isReadOnly, shallowReadonly, isReactive } from '../src/reactive'

describe('shallowReadonly', () => {
  it('should not make non-reactive property reactive', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadOnly(props)).toBeTruthy()
    expect(isReadOnly(props.n)).not.toBeTruthy()
  })

  it('readonly warning when call set', () => {
    console.warn = jest.fn()
    const user = shallowReadonly({ age: 10 })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
