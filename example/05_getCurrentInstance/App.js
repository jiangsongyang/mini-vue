import { Foo } from './Foo.js'
import { h, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'

// .vue
// <template></template>
// render
export const App = {
  name: 'App',
  render() {
    window.self = this
    return h('div', {}, h(Foo))
  },
  setup() {
    const instance = getCurrentInstance()
    console.log(instance, 'App : instance')
    return {
      msg: 'mini-vue',
    }
  },
}
