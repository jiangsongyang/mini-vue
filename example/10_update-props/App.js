import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(1);
    const add = () => {
      console.log("add methods run");
      count.value++;
    };

    const props = ref({
      foo: "foo",
      bar: "bar",
    });

    const propsOnChangeDemo1 = () => {
      props.value.foo = "new foo";
      props.value.bar = "new bar";
    };
    const propsOnChangeDemo2 = () => {
      props.value.foo = undefined;
    };
    const propsOnChangeDemo3 = () => {
      props.value = {
        foo: "foo",
      };
    };

    return {
      count,
      add,
      props,
      propsOnChangeDemo1,
      propsOnChangeDemo2,
      propsOnChangeDemo3,
    };
  },

  render() {
    return h(
      "div",
      {
        ...this.props,
      },
      [
        h("div", {}, `count is : ${this.count}`),
        h(
          "button",
          {
            onClick: this.add,
          },
          "button"
        ),
        h(
          "button",
          {
            onClick: this.propsOnChangeDemo1,
          },
          "button change props value"
        ),
        h(
          "button",
          {
            onClick: this.propsOnChangeDemo2,
          },
          "button change props value to undefined"
        ),
        h(
          "button",
          {
            onClick: this.propsOnChangeDemo3,
          },
          "button change delete props"
        ),
      ]
    );
  },
};
