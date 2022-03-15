import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

describe('scheduler', () => {
  // 1 : 通过 effect 的第二个参数给定一个 scheduler function
  // 2 : effect 初始化执行的时候 会执行传入的 fn
  // 3 : 当触发 set update 的时候 不会再次执行 fn 而是执行scheduler
  // 4 : 当执行 runner 的时候 会执行 fn
  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })
})
