import { reactive } from '../src/reactive'
import { ref } from '../src/ref'
import { computed } from '../src/computed'

describe('computed', function () {
  it('happy path', () => {
    const user = reactive({ age: 1 })
    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })

  it('should compute lazily', () => {
    const value = reactive({ foo: 1 })
    const refValue = ref(1)
    const getter = jest.fn(() => value.foo + refValue.value)
    const cValue = computed(getter)

    // lazy test
    expect(getter).not.toHaveBeenCalled()
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not computed until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(3)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
