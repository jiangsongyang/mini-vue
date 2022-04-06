import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export default {
  name: "Child",
  setup(props, { emit }) {},
  render() {
    return h("div", {}, [
      h("div", {}, "child - props - msg : " + this.$props.msg),
    ]);
  },
};
