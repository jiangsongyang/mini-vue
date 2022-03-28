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
const prevChildren  = "oldChildren";
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")];

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
