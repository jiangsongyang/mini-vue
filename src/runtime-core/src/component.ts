import { VNode } from './vnode'
import { publicInstanceProxyHandler } from './componentPublicInstance'
import { isFun, isObj } from '../../shared'

export type Data = Record<string, unknown>

export function createComponentInstance(vnode: VNode) {
  const component = {
    vnode,
    type: vnode.type,
    setupResult: {},
  }
  return component
}

export function setupComponent(instance) {
  // TODO :
  // 1 : initProps()
  // 2 : initSlots()

  // 初始化 有状态的 component
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type

  // ctx
  // 通过做代理
  // 在实例上增加 proxy
  // 在 render 的时候 call proxy 就可以实现在 render function 中访问 this.xxx
  // NOTE
  // 在这里只是做 添加操作
  // 真正执行 get 的时候 setupResult 已经拿到了
  instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandler)

  const { setup } = Component

  if (setup) {
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO :
  // setup result is render function
  if (isFun(setupResult)) {
  }
  // 如果是对象
  // 当做 state 处理
  else if (isObj(setupResult)) {
    instance.setupResult = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  instance.render = Component.render
}
