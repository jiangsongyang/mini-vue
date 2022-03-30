import { Ref } from "../../reactivity";
import { RendererNode, RendererElement } from "./renderer";
import { Data } from "./component";
import { ShapeFlags, isStr, isArr } from "../../shared";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export type VNodeTypes =
  | string
  | VNode
  | typeof Fragment
  | typeof Text
  | typeof Comment;

export type VNodeRef =
  | string
  | Ref
  | ((ref: object | null, refs: Record<string, any>) => void);

export type VNodeProps = {
  key?: string | number;
  ref?: VNodeRef;
};

type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void;

export type VNodeNormalizedChildren = string | VNodeArrayChildren | null;

export type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;

export type VNode<
  HostNode = RendererNode,
  HostElement = RendererElement,
  ExtraProps = { [key: string]: any }
> = {
  // 标记是否是 vnode
  __v_isVNode: true;
  // 该节点的类型
  type: any;
  // 该节点的属性
  props: (VNodeProps & ExtraProps) | null;
  // 该节点下的子节点
  children: VNodeNormalizedChildren;
  // vnode对应的真实DOM
  el: any;
  // 用于区分该 vnode 是什么形态
  shapeFlag: ShapeFlags;
  key: string | number | undefined;
};

export function createVNode(
  // type: VNodeTypes,
  // props: (Data & VNodeProps) | null = null,
  // children: VNodeNormalizedChildren
  type: VNodeTypes,
  props: (Data & VNodeProps) | null = null,
  children?: any
): VNode {
  // 初始化 创建 vnode
  const vnode: VNode = {
    __v_isVNode: true,
    type,
    props,
    children,
    el: null,
    key: props?.key,
    shapeFlag: getShapeFlag(type), // 先根据 type 初始化 shapeFlag
  };

  // 再根据子节点类型 修改 shapeFlag
  if (isStr(children)) {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (isArr(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  // 判断是不是一个 slot children
  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
    }
  }

  return vnode;
}

function getShapeFlag(type: VNodeTypes) {
  return isStr(type) ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}

export function isVNode(value: any): value is VNode {
  return value ? value.__v_isVNode === true : false;
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}

export function isSameVNodeType(n1: VNode, n2: VNode) {
  // type
  // key
  return n1.type === n2.type && n1.key === n2.key;
}
