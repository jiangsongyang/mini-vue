import { reactive, readonly, isReactive } from '../src/reactive'
describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toEqual(1)
  })

  it('test isReactive', () => {
    const original = { foo: 1 }
    const obj = reactive(original)
    const readonlyObj = readonly(original)

    expect(isReactive(obj)).toBeTruthy()
    expect(isReactive(original)).not.toBeTruthy()
    expect(isReactive(readonlyObj)).not.toBeTruthy()
  })
})
