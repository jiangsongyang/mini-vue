import { isFun, isObj } from '../../shared'

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
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
  console.log(instance , Component , 'instance');
  
  instance.render = Component.render
}
