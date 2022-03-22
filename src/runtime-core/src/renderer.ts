import { createComponentInstance, setupComponent } from './component'
import { isStr, isObj, isArr, ShapeFlags } from '../../shared'
import { VNode } from './vnode'

export interface RendererNode {
  [key: string]: any
}

export interface RendererElement extends RendererNode {}

export function render(initialVNode: VNode, container: RendererElement) {
  // 调用 patch
  patch(initialVNode, container)
}

function patch(VNode: VNode, container: RendererElement) {
  const { shapeFlag } = VNode
  // 判断节点类型
  if (shapeFlag & ShapeFlags.ELEMENT) {
    // type === 'div' | 'p' | ...
    processElement(VNode, container)
  }
  // 如果是根组件
  else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(VNode, container)
  }
}

function processElement(VNode: VNode, container: RendererElement) {
  mountElement(VNode, container)
}

function mountElement(VNode: VNode, container: RendererElement) {
  // 一个 element 核心的三要素
  // 1 : element type       => div | p | ...
  // 2 : element attributes => class | id | ...
  // 3 : element children   => string | array
  // NOTE
  // 1 和 2 都可以根据 vnode 的 type 和 props 生成
  // 如果
  // 3 是一个字符串 => 说明子节点是个字符串
  //   example :
  //      <p>this is string child</p>
  // 3 是一个数组   => 说明子节点是多个
  //   example :
  //      <p>
  //        <child1 />
  //        <child2 />
  //      </p>
  //   这种情况需要遍历去 patch 子节点

  const { type, props, children, shapeFlag } = VNode
  // 生成元素
  const el = (VNode.el = document.createElement(type))
  // 处理 props
  for (const prop in props) {
    const propValue = props[prop]
    el.setAttribute(prop, propValue)
  }
  // 处理子节点
  if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChild(children, el)
  } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  }
  // 挂载
  container.appendChild(el)
}

function mountChild(VNode: any, container: RendererElement) {
  VNode.forEach((child: VNode) => patch(child, container))
}

function processComponent(VNode: VNode, container: RendererElement) {
  mountComponent(VNode, container)
}

function mountComponent(VNode: VNode, container: RendererElement) {
  // 1 : 创建组件实例
  const instance = createComponentInstance(VNode)
  // 2 : 安装组件
  setupComponent(instance)
  setupRenderEffect(instance, VNode, container)
}

function setupRenderEffect(
  instance: any,
  initialVNode: VNode,
  container: RendererElement
) {
  const { proxy } = instance
  // 根节点下的 虚拟节点树
  const subTree = instance.render.call(proxy)
  // vnode -> patch element -> mount element
  patch(subTree, container)

  // 在 patch 完所有的 subTree 后 给当前节点增加 el
  initialVNode.el = subTree.el
}
