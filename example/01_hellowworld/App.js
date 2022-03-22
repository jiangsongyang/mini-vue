import { h } from '../../lib/guide-mini-vue.esm.js'

// .vue
// <template></template>
// render
export const App = {
  render() {
    return h(
      'div',
      { id: 'root', class: ['red', 'blue'] },
      // test string child
      // `hi ${this.msg}`
      // test array child
      [
        h('p', {}, 'this is p tag'),
        h('p', {}, [h('div', {}, 'this is child div')]),
      ]
    )
  },
  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
