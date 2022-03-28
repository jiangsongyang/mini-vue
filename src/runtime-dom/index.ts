import { createRenderer } from "../runtime-core";
import { isOn } from "../shared";

export function createElement(type: string) {
  return document.createElement(type);
}

export function patchProp(el, prop, prevValue, nextValue) {
  // 绑定事件
  if (isOn(prop)) {
    const eventType = prop.slice(2).toLowerCase();
    el.addEventListener(eventType, nextValue);
  } else {
    if (nextValue === undefined || nextValue === null) {
      el.removeAttribute(prop, nextValue);
    } else {
      el.setAttribute(prop, nextValue);
    }
  }
}

export function insert(el, container) {
  container.appendChild(el);
}

function createText(text) {
  return document.createTextNode(text);
}

function setText(node, text) {
  node.nodeValue = text;
}

function setElementText(el, text) {
  console.log("SetElementText", el, text);
  el.textContent = text;
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

// 自定义渲染器
// NOTE
// 这样做的好处是 :
// 不依赖于具体的方法实现 来操作节点
// 通过 ```渲染器``` 将对应平台的方法传入
// 即可实现对不同平台的节点操作
// 函数返回一个 渲染者 -- renderer
let renderer;
function ensureRenderer() {
  // 如果 renderer 有值的话，那么以后都不会初始化了
  return (
    renderer ||
    (renderer = createRenderer({
      createElement,
      createText,
      setText,
      setElementText,
      patchProp,
      insert,
      remove,
    }))
  );
}

// dom 平台的入口
export function createApp(...arg) {
  console.log("**********************************");
  console.log("----- 当前渲染器环境为 : runtime-dom -----");
  console.log("**********************************");
  console.log("根组件传入参数为 : ", ...arg);
  // 创建渲染器
  // 渲染器会返回 { createApp : runtime-core -> createAppApi }
  // 之后开始主流程
  return ensureRenderer().createApp(...arg);
}
