import { readonly } from '../src/reactive'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(original.foo).toBe(1)
  })

  it('readonly warning when call set', () => {
    console.warn = jest.fn()
    const user = readonly({ age: 10 })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
