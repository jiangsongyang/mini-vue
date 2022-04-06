import { createComponentInstance, setupComponent } from "./component";
import { isArr, isOn, ShapeFlags } from "../../shared";
import { VNode, Fragment, Text, isSameVNodeType } from "./vnode";
import { createAppApi } from "./createApp";
import { effect } from "../../reactivity";
import { shouldUpdateComponent } from "./componentUpdateUtils";

export interface RendererNode {
  [key: string]: any;
}

export interface RendererElement extends RendererNode {}

// 创建渲染者
// option 为 平台相关渲染器的方法
export function createRenderer(options) {
  console.log("渲染器传入的渲染器渲染方法为 : ", options);
  // 解构出来渲染方法
  const {
    patchProp,
    insert,
    patchProp: hostPatchProp,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;
  function render(initialVNode: VNode, container: RendererElement) {
    console.log("**********************************");
    console.log("----- runtime-core 内部 render 开始执行 -----");
    console.log("**********************************");
    console.log("initialVNode : ", initialVNode);

    // 调用 patch
    patch(null, initialVNode, container, null, null);
  }

  // NOTE
  // 核心方法
  // n1 : oldVNode
  // n2 : newVNode
  // container : 渲染的容器
  // parentComponent : 父组件
  function patch(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent,
    anchor
  ) {
    console.log("**********************************");
    console.log("----- 开始 patch -----");
    console.log("**********************************");

    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        console.log("当前 vnode 类型为 Fragment : ", n2, type);
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        console.log("当前 vnode 类型为 Text : ", n2, type);
        processText(n1, n2, container);
        break;
      default:
        // 判断节点类型
        if (shapeFlag & ShapeFlags.ELEMENT) {
          console.log("当前 shapeFlag 类型为 ELEMENT : ", n2, shapeFlag);
          // type === 'div' | 'p' | ...
          processElement(n1, n2, container, parentComponent, anchor);
        }
        // 如果是根组件
        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          console.log(
            "当前 shapeFlag 类型为 STATEFUL_COMPONENT : ",
            n2,
            shapeFlag
          );
          processComponent(n1, n2, container, parentComponent);
        }
    }
  }

  // --------------------------------------------------------------------------
  // 处理 element
  function processElement(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent,
    anchor
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  // 挂载 element
  function mountElement(
    vnode: VNode,
    container: RendererElement,
    parentComponent,
    anchor
  ) {
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

    const { type, props, children, shapeFlag } = vnode;
    // 生成元素
    const el = (vnode.el = document.createElement(type));
    console.log("创建的元素类型是 : ", type);

    // 处理 props
    for (const prop in props) {
      const propValue = props[prop];
      patchProp(el, prop, null, propValue);
    }
    console.log("处理 props 后的元素为 : ", el);

    // 处理子节点
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      console.log("当前子节点是一个数组", children, shapeFlag);
      mountChildren(children, el, parentComponent, anchor);
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      console.log("当前子节点是一个文本 内容是 : ", children, shapeFlag);
      el.textContent = children;
    }

    // 挂载
    console.log("插入到父级节点 :", container);
    insert(el, container, anchor);
  }

  // 挂载子节点
  function mountChildren(
    children,
    container: RendererElement,
    parentComponent,
    anchor
  ) {
    children.forEach((child: VNode) =>
      patch(null, child, container, parentComponent, anchor)
    );
  }

  // 处理更新元素
  function patchElement(
    n1: VNode,
    n2: VNode,
    container: RendererElement,
    parentComponent,
    anchor
  ) {
    console.log("开始更新 element");
    console.log("old el: ", n1);
    console.log("new el: ", n2);
    // 给 n2 添加 el 属性
    // 因为 :
    // 下次再进入更新时 n2 已经变成了 oldVNode , 也就是 n1
    const el = (n2.el = n1.el);

    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 1 . patch props
    patchProps(el, oldProps, newProps);

    // 2 . patch children
    patchChildren(n1, n2, el, parentComponent, anchor);
  }

  // 更新 props 有三种情况
  // 1 . 如果 n1 和 n2 props 都有值 ， 但是 value 不一样
  // example :
  //    old : <p id='a'></p>
  //    new : <p id='b'></p>
  // 这种情况用新的 props 替换旧的 props
  // 2 . 如果 n2 props 没有值 （ null ｜ undefined ），但是 n1 props 有值
  // example :
  //    old : <p id='a'></p>
  //    new : <p id='null | undefined'></p>
  // 这种情况需要删除属性
  // 3 . 如果 n2 props 没有这个属性了，但是 n1 props 有
  // example :
  //    old : <p id='a'></p>
  //    new : <p></p>
  // 这种情况需要删除属性
  function patchProps(el, oldProps, newProps) {
    // 1 && 2
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];
      if (prevProp !== newProps) {
        hostPatchProp(el, key, prevProp, nextProp);
      }
    }
    // 3
    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  }

  // 更新子节点有四种情况
  // 1 . 老节点中 子元素为 array ，新节点中 子元素为 text
  // 2 . 老节点中 子元素为 text ，新节点中 子元素为 text
  // 3 . 老节点中 子元素为 text ，新节点中 子元素为 array
  // 4 . 老节点中 子元素为 array ，新节点中 子元素为 array
  function patchChildren(
    n1: VNode,
    n2: VNode,
    container,
    parentComponent,
    anchor
  ) {
    const prevShapeFlag = n1.shapeFlag;
    const newShapeFlag = n2.shapeFlag;

    const c1 = n1.children;
    const c2 = n2.children;

    if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 老节点中 子元素为 array ，新节点中 子元素为 text
        // TODO :
        // 1 . 把老的节点里面的子元素清空
        unmountChildren(n1.children);
        // 2 . 设置新的 text , 插入
        hostSetElementText(container, c2);
      } else if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 老节点中 子元素为 text ，新节点中 子元素为 text
        // TODO :
        // 1 . 值不相等 直接替换
        if (c1 !== c2) {
          hostSetElementText(container, c2);
        }
      }
    } else if (newShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 老节点中 子元素为 text ，新节点中 子元素为 array
        // TODO :
        // 1 . 先把老节点中的文本清空
        hostSetElementText(container, "");
        // 2 . 把新节点中的子元素插入
        mountChildren(c2, container, parentComponent, anchor);
      } else if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 老节点中 子元素为 array ，新节点中 子元素为 array
        // TODO :
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  // 双端对比
  // 目的 :
  //     找出两个 array 中 乱序的部分
  // 思路 :
  //    使用三个指针 分别是
  //    新 children 头部指针
  //    新 children 尾部指针
  //    老 children 尾部指针
  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
    // c1 的长度
    const l1 = c1.length;
    // c2 的长度
    const l2 = c2.length;

    // 新 children 头部指针
    let i = 0;
    // 老 children 尾部指针
    let e1 = l1 - 1;
    // 新 children 尾部指针
    let e2 = l2 - 1;

    // 左 -> 右
    // old : ( a , b ) , c
    // new : ( a , b ) , d , e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      i++;
    }
    // 右 -> 左
    // old : a , ( b , c )
    // new : d , e , ( b , c )
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // 新的比老的长 - 左 -> 右
    // 创建
    // 将 c , d 向后插入
    // old : ( a , b )
    // new : ( a , b ) , c , d
    // &&
    // 新的比老的长 - 右 -> 左
    // 创建
    // 将 c , d 在前面插入
    // old : ( a , b )
    // new : c , d , ( a , b )
    if (i > e1 && i <= e2) {
      const nextPos = e2 + 1;
      // 找到 锚点
      const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
      while (i <= e2) {
        patch(null, c2[i], container, parentComponent, anchor);
        i++;
      }
    }
    // 老的比新的长 - 左 -> 右
    // 删除老的
    //  old : ( a , b ) , c  , d
    //  new : ( a , b )
    // &&
    // 老的比新的长 - 左 -> 右
    // 删除老的
    //  old :  a , b , ( c  , d )
    //  new : ( c  , d )
    else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    }
    // 乱序
    else {
      let s1 = i;
      let s2 = i;

      // 总共需要处理的节点次数总数
      const toBePatched = e2 - s2 + 1;
      // 当前处理过的节点的次数
      let patched = 0;

      // 创建索引映射
      const newIndexToOldIndexMap = new Array(toBePatched);
      // 初始化索引
      for (let i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0;
      }

      // 根据 i 和 e2 创建映射表
      // 映射 key 和 i
      // NOTE :
      // key 解决的问题 :
      // 如果在节点上标记了 key
      // vue 可以进行映射关系 就不用去新节点遍历查找老节点是否存在
      // 这样可以在时间复杂度从 O(n) 变成 O(1)
      const KeyToNewIndexMap = new Map();
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i];
        KeyToNewIndexMap.set(nextChild.key, i);
      }
      // 判断老的是否在新的中
      for (let i = s1; i <= e1; i++) {
        // 拿到 老的节点
        const prevChild = c1[i];

        // 优化逻辑
        // 如果 当前处理过的次数 大于等于 需要处理的次数
        // old :  a , b , ( c  , d , e ) , f , g
        // new :  a , b , ( c ) , f , g
        // 这种场景就是
        // 当前处理了两次 old c ， old d
        // 但是总共只需要一次 new c
        // 直接把 c 后面的节点删除就可以了
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
          continue;
        }

        // 老节点 在新节点列表中的索引
        let newIndex;

        // 如果用户声明了 key
        if (prevChild.key !== null || prevChild.key !== undefined) {
          // 先从映射表里找
          newIndex = KeyToNewIndexMap.get(prevChild.key);
        }
        // 如果用户没声明 key
        else {
          // 遍历
          for (let j = s2; j < e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        // 老节点在新节点列表中不存在的话
        if (newIndex === undefined) {
          hostRemove(prevChild.el);
        }
        // 如果存在的话
        // 处理移动
        // 就继续去 patch
        // 对该节点进行深度对比
        else {
          // i + 1 是因为防止 i 是 0
          // 0 在映射表里代表 没有被映射
          // 如果没有被映射 应该被创建
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          patch(prevChild, c2[newIndex], container, parentComponent, null);
          patched++;
        }
      }

      // 开始生成 最长递增子序列
      // old :  a , b , ( c , d , e ) , f , g
      // new :  a , b , ( e , c , d ) , f , g
      // 子序列为 [ 2 , 3 ]
      const increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
      // 子序列的指针
      let j = increasingNewIndexSequence.length - 1;
      // 倒序遍历
      // 防止移动目标节点后面的节点是不稳定的节点
      // 倒序处理可以保证 锚点是稳定的
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

        // 如果没有找到映射
        if (newIndexToOldIndexMap[i] === 0) {
          // 创建节点
          patch(null, nextChild, container, parentComponent, anchor);
        }
        // 如果找到映射
        else {
          // 如果当前的 i 不在最长递增子序列中
          if (i !== increasingNewIndexSequence[j]) {
            // 移动位置
            insert(nextChild.el, container, anchor);
          } else {
            j--;
          }
        }
      }
    }
  }

  function unmountChildren(children) {
    for (let index = 0; index < children.length; index++) {
      const el = children[index].el;
      hostRemove(el);
    }
  }

  // --------------------------------------------------------------------------
  // 处理组件
  function processComponent(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent
  ) {
    if (!n1) {
      // 初始化根组件
      console.log("创建组件 : ", n2);
      mountComponent(n2, container, parentComponent);
    } else {
      // 更新组件
      console.log("更新组件 : ", n1, n2);
      updateComponent(n1, n2);
    }
  }

  // 挂载组件
  function mountComponent(
    vnode: VNode,
    container: RendererElement,
    parentComponent
  ) {
    // 1 : 创建组件实例
    const instance = (vnode.component = createComponentInstance(
      vnode,
      parentComponent
    ));
    console.log("1 : 当前组件实例为 : ", instance);
    // 2 : 安装组件
    setupComponent(instance);
    console.log("2 : 安装完成组件实例为 : ", instance);
    // 3 : 开始 patch
    setupRenderEffect(instance, vnode, container);
  }

  // 更新组件
  // HOW ?
  // 更新组件 === 重新调用组件的 render functuon
  // 生成新的 vnode
  // 生成后 再次进行 patch
  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component);
    // 对比 props 判断是否需要更新
    if (shouldUpdateComponent(n1, n2)) {
      console.log("组件需要被更新 因为props发生了变化");
      // 下次要更新的虚拟节点
      instance.next = n2;
      console.log("当前实例对象为 : ", instance);
      // 因为 setupRenderEffect 会调用 effect
      // effect 会返回 runner
      // runner 执行就会调用 fn
      // 就会走一遍更新逻辑
      instance.update();
    } else {
      console.log("组件不需要被更新 因为props没有发生变化");
      // 同步 el 和 vnode
      n2.el = n1.el;
      n2.vnode = n2;
    }
  }

  // 组件处理的核心方法
  function setupRenderEffect(
    instance: any,
    initialVNode: VNode,
    container: RendererElement
  ) {
    instance.update = effect(() => {
      const { proxy } = instance;
      if (!instance.isMounted) {
        // 初始化
        // 开始执行 render function 生成根节点下的 虚拟节点树
        // NOTE
        // 这里通过 call 改变 render 函数中的 this 指向
        // 详情看
        // component.ts -> setupStatefulComponent -> instance.proxy = createContext(instance)
        console.log("开始调用 render :");
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log("调用组件实例的 render function 生成 vnode 树 :", subTree);
        // 转换 vnode -> 真实DOM
        patch(null, subTree, container, instance);
        // 在 patch 完所有的 subTree 后 给当前节点增加 el
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // 更新

        // -----------------------------
        // pre update
        //
        // 在更新之前
        // 如果是更新 component
        // 需要提前更新一下 组件的 props
        // 这里的
        // vnode 指向 更新之前的虚拟节点
        // next  指向 需要更新的虚拟节点
        const { next, vnode } = instance;

        if (next) {
          // 更新 el
          next.el = vnode.el;
          updateComponentPreRender(instance, next);
        }
        // -----------------------------

        const prevSubTree = instance.subTree;
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log("**********************************");
        console.log("开始更新");
        console.log("**********************************");
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  function updateComponentPreRender(instance, nextVnode) {
    // 更新 vnode
    instance.vnode = nextVnode;
    // reset state
    instance.next = null;
    // 更新组件的 props
    instance.props = nextVnode.props;
  }

  // 处理 Fragment 类型的 VNode
  // NOTE
  // 思路 :
  // 直接把对应的 vnode 挂载到 container 内
  function processFragment(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent,
    anchor
  ) {
    mountChildren(
      isArr(n2) ? n2 : n2.children,
      container,
      parentComponent,
      anchor
    );
  }

  // 处理 Text 类型的 VNode
  // 这种类型是因为 生成 render 的时候 直接写了 string
  // NOTE
  // 思路 :
  // 拿到 children ( 用户写入的字符串 )
  // 创建节点 直接插入对应 container 内
  function processText(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement
  ) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children as string));
    container.append(textNode);
  }

  // 返回 createAppApi
  // 提供给用户调用
  return {
    createApp: createAppApi(render),
  };
}

// 最长递增子序列
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
