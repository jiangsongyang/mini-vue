import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // 调用 patch
  patch(vnode, container)
}

function patch(vnode, container) {
  // 判断节点类型
  processComponent(vnode, container)
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  // 1 : 创建组件实例
  const instance = createComponentInstance(vnode)
  // 2 : 安装组件
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  // 根节点下的 虚拟节点树
  const subTree = instance.render()
  // vnode -> patch element -> mount element
  patch(subTree, container)
}
