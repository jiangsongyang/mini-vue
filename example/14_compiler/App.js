import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../lib/guide-mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    const instance = getCurrentInstance();
    const count = ref(0);

    const onClick = () => {
      for (let index = 0; index < 100; index++) {
        console.log("update");
        count.value = index;
      }

      nextTick(() => {
        console.log(instance, "instanceinstanceinstance");
      });
    };

    return {
      onClick,
      count,
    };
  },
  render() {
    const button = h("button", { onClick: this.onClick }, "update");
    const p = h("p", {}, "count : " + this.count);
    return h("div", {}, [p, button]);
  },
};
