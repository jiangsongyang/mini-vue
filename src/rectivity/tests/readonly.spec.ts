import { readonly, reactive, isReadOnly } from '../src/reactive'

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

  it('test isReadOnly', () => {
    const original = { foo: 1 }
    const obj = reactive(original)
    const readonlyObj = readonly(original)

    expect(isReadOnly(readonlyObj)).toBeTruthy()
    expect(isReadOnly(original)).not.toBeTruthy()
    expect(isReadOnly(obj)).not.toBeTruthy()
  })

  it('should make nested values readonly', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(isReadOnly(original)).not.toBeTruthy()
    expect(isReadOnly(wrapped)).toBeTruthy()
    expect(isReadOnly(original.bar)).not.toBeTruthy()
    expect(isReadOnly(wrapped.bar)).toBeTruthy()
  })
})
