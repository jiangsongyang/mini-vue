import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(1);
    const add = () => {
      console.log('add methods run'); 
      count.value++;
    };
    return {
      count,
      add
    };
  },

  render() {
    return h("div", {}, [
      h("div", {}, `count is : ${this.count}`),
      h(
        "button",
        {
          onClick: this.add,
        },
        "button"
      ),
    ]);
  },
};
