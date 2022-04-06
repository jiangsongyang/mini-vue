import { h, ref } from "../../lib/guide-mini-vue.esm.js";
import Child from "./Child.js";

export default {
  name: "App",
  setup() {
    const msg = ref("this is msg");
    const count = ref(0);
    window.msg = msg;

    const changeChildProps = () => {
      msg.value = "this is msg changed";
    };

    const changeCount = () => {
      count.value++;
    };

    return {
      msg,
      count,
      changeChildProps,
      changeCount,
    };
  },
  render() {
    return h("div", {}, [
      h("button", { onClick: this.changeChildProps }, "change Children porps"),
      h(Child, { msg: this.msg }),
      h(
        "button",
        {
          onClick: this.changeCount,
        },
        "change self count"
      ),
      h("p", {}, "count is :" + this.count),
    ]);
  },
};
