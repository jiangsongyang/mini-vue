import { createVNode } from "./vnode";
import { isStr, isElement } from "../../shared";

// 接受内部 render 方法
export function createAppApi(render) {
  // createApp(rootComponent).mount(el || selector)
  return function createApp(rootComponent) {
    // return mount 方法
    // 用于链式调用
    return {
      mount(rootContainer) {
        // 只能接受 真实DOM || string selector
        if (!isElement(rootContainer) && isStr(rootContainer)) {
          rootContainer = document.querySelector(rootContainer);
        } else {
          console.warn(
            "mount function only element nodes and selectors can be accepted"
          );
        }
        console.log('挂载目标为 : ', rootContainer);
        // NOTE
        // 先将组件转换成 vnode
        // 所有的逻辑操作 都是基于 vnode 的
        const vnode = createVNode(rootComponent);
        console.log('创建的根组件vnode : ', vnode);
        // 拿到 vnode 后 执行 render(vue内部实现的 render 方法, 不是 render 函数)
        render(vnode, rootContainer);
        console.log('render 方法执行完毕');
      },
    };
  };
}
