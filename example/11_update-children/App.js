import { h, ref } from "../../lib/guide-mini-vue.esm.js";

// // First type : old children is array , new children is text
// const nextChildren = "newChildren";
// const prevChildren = [h("div", {}, "A"), h("div", {}, "B")];

// export default {
//   name: "App",
//   setup() {
//     const isChange = ref(false);
//     window.isChange = isChange;
//     return {
//       isChange,
//     };
//   },

//   render() {
//     return this.isChange === true
//       ? h("div", {}, nextChildren)
//       : h("div", {}, prevChildren);
//   },
// };

// // Second type : old children is text , new children is text
// const nextChildren = "newChildren";
// const prevChildren = "oldChildren";

// export default {
//   name: "App",
//   setup() {
//     const isChange = ref(false);
//     window.isChange = isChange;
//     return {
//       isChange,
//     };
//   },

//   render() {
//     return this.isChange === true
//       ? h("div", {}, nextChildren)
//       : h("div", {}, prevChildren);
//   },
// };

// // thired type : old children is text , new children is array
// const prevChildren  = "oldChildren";
// const nextChildren = [h("div", {}, "A"), h("div", {}, "B")];

// export default {
//   name: "App",
//   setup() {
//     const isChange = ref(false);
//     window.isChange = isChange;
//     return {
//       isChange,
//     };
//   },

//   render() {
//     return this.isChange === true
//       ? h("div", {}, nextChildren)
//       : h("div", {}, prevChildren);
//   },
// };

// fouth type : old children is array , new children is array
// 双端对比

// // 左 -> 右
// // old : ( a , b ) , c
// // new : ( a , b ) , d , e
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
// ];

// // 右 -> 左
// // old : a , ( b , c )
// // new : d , e , ( b , c )
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];
// const nextChildren = [
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
// ];

// // 新的比老的长 - 左 -> 右
// // 创建
// // old : ( a , b )
// // new : ( a , b ) , c
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "D" }, "D"),
// ];

// // 新的比老的长 - 右 -> 左
// // 创建
// //  old : ( a , b )
// //  new : c , d , ( a , b )
// const prevChildren = [h("div", { key: "A" }, "A"), h("div", { key: "B" }, "B")];
// const nextChildren = [
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
// ];

// // 老的比新的长 - 左 -> 右
// // 删除老的
// //  old : ( a , b ) , c  , d
// //  new : ( a , b )
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "D" }, "D"),
// ];
// const nextChildren = [h("div", { key: "A" }, "A"), h("div", { key: "B" }, "B")];

// // 老的比新的长 - 左 -> 右
// // 删除老的
// //  old :  a , b , ( c  , d )
// //  new : ( c  , d )
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C" }, "C"),
//   h("div", { key: "D" }, "D"),
// ];
// const nextChildren = [h("div", { key: "C" }, "C"), h("div", { key: "D" }, "D")];

// // 乱序
// // 需要删除
// // old :  a , b , ( c  , d , e ) , f , g
// // new :  a , b , ( c ) , f , g
const prevChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C", id: "c-prev" }, "C"),
  h("div", { key: "D" }, "D"),
  h("div", { key: "E" }, "E"),
  h("div", { key: "F" }, "F"),
  h("div", { key: "G" }, "G"),
];
const nextChildren = [
  h("div", { key: "A" }, "A"),
  h("div", { key: "B" }, "B"),
  h("div", { key: "C", id: "c-next" }, "C"),
  h("div", { key: "F" }, "F"),
  h("div", { key: "G" }, "G"),
];

// // 需要追加
// //  old :  a , b , ( c ) , f , g
// //  old :  a , b , ( e  , c ) , f , g
// const prevChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "C", id: "c-prev" }, "C"),
//   h("div", { key: "D" }, "D"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];
// const nextChildren = [
//   h("div", { key: "A" }, "A"),
//   h("div", { key: "B" }, "B"),
//   h("div", { key: "E" }, "E"),
//   h("div", { key: "C", id: "c-next" }, "C"),
//   h("div", { key: "F" }, "F"),
//   h("div", { key: "G" }, "G"),
// ];

export default {
  name: "App",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;
    return {
      isChange,
    };
  },

  render() {
    return this.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
