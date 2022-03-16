import { reactive } from '../src/reactive'
import { effect, stop } from '../src/effect'

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

  it('test stop', () => {
    let dummy
    const obj = reactive({ foo: 10 })
    const runner = effect(() => {
      dummy = obj.foo
    })
    obj.foo = 11
    expect(dummy).toBe(11)
    stop(runner)
    obj.foo = 12
    expect(dummy).toBe(11)
    runner()
    expect(dummy).toBe(12)
  })

  it('onStop', () => {
    let dummy
    const obj = reactive({ foo: 10 })
    const onStop = jest.fn()
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop,
      }
    )
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
