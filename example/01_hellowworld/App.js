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
          console.log('click' , this)
        },
      },
      // test string child
      `hi - ${this.msg}`
      // test array child
      // [
      //   h('p', {}, 'this is p tag'),
      //   h('p', {}, [h('div', {}, 'this is child div')]),
      // ]
    )
  },
  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
