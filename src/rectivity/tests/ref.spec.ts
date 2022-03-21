import { effect } from '../src/effect'
import { ref, isRef, unRef , proxyRefs } from '../src/ref'
import { reactive } from '../src/reactive'

describe('ref', () => {
  it('happy path', () => {
    const a = ref(1)

    expect(a.value).toBe(1)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })

    expect(calls).toBe(1)
    expect(dummy).toBe(1)

    a.value = 2

    expect(calls).toBe(2)
    expect(dummy).toBe(2)

    // same value should not trigger
    a.value = 2

    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    })

    let dummy
    effect(() => {
      dummy = a.value.count
    })

    expect(dummy).toBe(1)

    a.value.count++

    expect(dummy).toBe(2)
  })

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({ age: 10 })

    expect(isRef(a)).toBeTruthy()
    expect(isRef(1)).not.toBeTruthy()
    expect(isRef(user)).not.toBeTruthy()
  })

  it('unRef', () => {
    const a = ref(1)

    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  it('proxyRefs', () => {
    const user = { age: ref(10), name: 'John' }
    const proxyUser = proxyRefs(user)

    // test getter
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe('John')

    // test setter
    proxyUser.age = 20
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    // test setter with ref value
    proxyUser.age = ref(10)
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)
  })
})
