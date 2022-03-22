import { Foo } from './Foo.js'
import { h } from '../../lib/guide-mini-vue.esm.js'

// .vue
// <template></template>
// render
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        onClick() {
          console.log('click', this)
        },
      },
      // test string child
      // `hi - ${this.msg}`
      // test array child
      [ h('div', {}, [h(Foo, { count: 1 })])]
    )
  },
  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
