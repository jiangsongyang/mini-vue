import { reactive, readonly, isReactive, isProxy } from '../src/reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toEqual(1)
    expect(isProxy(observed)).toBeTruthy()
  })

  it('test isReactive', () => {
    const original = { foo: 1 }
    const obj = reactive(original)
    const readonlyObj = readonly(original)

    expect(isReactive(obj)).toBeTruthy()
    expect(isReactive(original)).not.toBeTruthy()
    expect(isReactive(readonlyObj)).not.toBeTruthy()
  })

  it('nested reactive', () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 2 }] }
    const observed = reactive(original)

    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
