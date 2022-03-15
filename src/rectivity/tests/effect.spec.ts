import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 })
    let newAge
    effect(() => {
      newAge = user.age + 1
    })
    expect(newAge).toBe(11)
    // update test
    user.age++
    expect(newAge).toBe(12)
  })

  it('should return effect runner', () => {
    // effect(fn) -> function runner -> fn()
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'string'
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('string')
  })
})
