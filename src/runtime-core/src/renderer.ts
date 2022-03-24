import { createComponentInstance, setupComponent } from './component'
import { isArr, isOn, ShapeFlags } from '../../shared'
import { VNode, Fragment, Text } from './vnode'

export interface RendererNode {
  [key: string]: any
}

export interface RendererElement extends RendererNode {}

export function render(initialVNode: VNode, container: RendererElement) {
  // 调用 patch
  patch(initialVNode, container)
}

// NOTE
// 核心方法
function patch(vnode: VNode, container: RendererElement) {
  const { shapeFlag, type } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container)
      break
    case Text:
      processText(vnode, container)
      break

    default:
      // 判断节点类型
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // type === 'div' | 'p' | ...
        processElement(vnode, container)
      }
      // 如果是根组件
      else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
      }
  }
}

function processElement(vnode: VNode, container: RendererElement) {
  mountElement(vnode, container)
}

function mountElement(vnode: VNode, container: RendererElement) {
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

  const { type, props, children, shapeFlag } = vnode
  // 生成元素
  const el = (vnode.el = document.createElement(type))
  // 处理 props
  for (const prop in props) {
    const propValue = props[prop]
    // 绑定事件
    if (isOn(prop)) {
      const eventType = prop.slice(2).toLowerCase()
      el.addEventListener(eventType, propValue)
    } else {
      el.setAttribute(prop, propValue)
    }
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

function mountChild(vnode: any, container: RendererElement) {
  vnode.forEach((child: VNode) => patch(child, container))
}

function processComponent(vnode: VNode, container: RendererElement) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: VNode, container: RendererElement) {
  // 1 : 创建组件实例
  const instance = createComponentInstance(vnode)
  // 2 : 安装组件
  setupComponent(instance)
  // 3 : 开始 patch
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(
  instance: any,
  initialVNode: VNode,
  container: RendererElement
) {
  const { proxy } = instance
  // 开始执行 render function 生成根节点下的 虚拟节点树
  // NOTE
  // 这里通过 call 改变 render 函数中的 this 指向
  // 详情看
  // component.ts -> setupStatefulComponent -> instance.proxy = createContext(instance)
  const subTree = instance.render.call(proxy)
  // 转换 vnode -> 真实DOM
  patch(subTree, container)
  // 在 patch 完所有的 subTree 后 给当前节点增加 el
  initialVNode.el = subTree.el
}

// 处理 Fragment 类型的 VNode
// NOTE
// 思路 :
// 直接把对应的 vnode 挂载到 container 内
function processFragment(vnode: VNode, container: RendererElement) {
  mountChild(isArr(vnode) ? vnode : vnode.children, container)
}

// 处理 Text 类型的 VNode
// 这种类型是因为 生成 render 的时候 直接写了 string
// NOTE
// 思路 :
// 拿到 children ( 用户写入的字符串 )
// 创建节点 直接插入对应 container 内
function processText(vnode: VNode, container: RendererElement) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children as string))
  container.append(textNode)
}
