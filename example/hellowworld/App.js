import { h } from '../../lib/guide-mini-vue.esm.js'

// .vue
// <template></template>
// render
export const App = {
  render() {
    return h('div', `hi ${this.msg}`)
  },
  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
