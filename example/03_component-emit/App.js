import { Foo } from './Foo.js'
import { h } from '../../lib/guide-mini-vue.esm.js'

// .vue
// <template></template>
// render
export const App = {
  render() {
    window.self = this
    return h(Foo, {
      count: 1,
      onAdd: (...arg) => {
        console.log(...arg, '1')
      },
      onAddFoo: (...arg) => {
        console.log(...arg, '2')
      },
    })
  },
  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
