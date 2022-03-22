import { Foo } from './Foo.js'
import { h } from '../../lib/guide-mini-vue.esm.js'

// .vue
// <template></template>
// render
export const App = {
  render() {
    window.self = this
    // 匿名插槽
    const Slot = h('p', 'this is slot')
    const app = h('div', {}, 'App')
    const foo = h(Foo, {}, Slot)
    // 具名插槽
    // const app = h('div', {}, 'App')
    // const foo = h(
    //   Foo,
    //   {},
    //   {
    //     header: h('div', {}, 'this is header'),
    //     footer: h('div', {}, 'this is footer'),
    //   }
    // )
    // 作用域插槽
    // const app = h('div', {}, 'App')
    // const foo = h(
    //   Foo,
    //   {},
    //   {
    //     header: ({age}) => h('div', {}, 'this is header' + age),
    //     footer: h('div', {}, 'this is footer'),
    //   }
    // )
    return h('div', [app, foo])
  },
  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
