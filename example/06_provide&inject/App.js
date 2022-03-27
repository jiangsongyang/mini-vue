import {
  h,
  createTextVNode,
  provide,
  inject,
} from "../../lib/guide-mini-vue.esm.js";

// base test
const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooValue");
    provide("bar", "barValue");
  },
  render() {
    return h("div", {}, [createTextVNode("this is Provider"), h(ProviderTwo)]);
  },
};

// test more than tier
const ProviderTwo = {
  name: "ProviderTwo",
  setup() {},
  render() {
    return h("div", {}, [
      createTextVNode("this is ProviderTwo"),
      h(ProviderThree),
    ]);
  },
};

// test provide() from different tier
const ProviderThree = {
  name: "ProviderThree",
  setup() {
    provide("cool", "coolValue -- ProviderThree");
  },
  render() {
    return h("div", {}, [
      createTextVNode("this is ProviderThree"),
      h(ProviderFour),
    ]);
  },
};

// test same provide key
const ProviderFour = {
  name: "ProviderFour",
  setup() {
    const parentCool = inject("cool");
    provide("cool", "coolValue -- ProviderFour");
    return {
      parentCool,
    };
  },
  render() {
    return h("div", {}, [
      createTextVNode(`this is ProviderFour parentCool : ${this.parentCool}`),
      h(Consumer),
    ]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const cool = inject("cool");
    return {
      foo,
      bar,
      cool,
    };
  },
  render() {
    return h(
      "div",
      {},
      `this is Consumer - foo : ${this.foo} - bar : ${this.bar} - cool : ${this.cool}`
    );
  },
};

export const App = {
  name: "App",
  setup() {},
  render() {
    window.self = this;
    return h("div", {}, ["213", h(Provider)]);
  },
};

// const Provider = {
//   name: "Provider",
//   setup() {
//     provide("foo", "fooVal");
//     provide("bar", "barVal");
//   },
//   render() {
//     return h("div", {}, [h("p", {}, "Provider"), h(ProviderTwo)]);
//   },
// };

// const ProviderTwo = {
//   name: "ProviderTwo",
//   setup() {
//     provide("foo", "fooTwo");
//     const foo = inject("foo");
//     return {
//       foo,
//     };
//   },
//   render() {
//     return h("div", {}, [
//       h("p", {}, `ProviderTwo foo:${this.foo}`),
//       h(Consumer),
//     ]);
//   },
// };

// const Consumer = {
//   name: "Consumer",
//   setup() {
//     const foo = inject("foo");
//     const bar = inject("bar");
//     const baz = inject("baz", () => "bazDefault");
//     return {
//       foo,
//       bar,
//       baz,
//     };
//   },

//   render() {
//     return h("div", {}, `Consumer: - ${this.foo} - ${this.bar}-${this.baz}`);
//   },
// };

// export const App = {
//   name: "App",
//   setup() {},
//   render() {
//     return h("div", {}, [h("p", {}, "apiInject"), h(Provider)]);
//   },
// };
