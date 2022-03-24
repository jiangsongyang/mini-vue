import { h , getCurrentInstance} from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  name: 'Foo',
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    console.log(instance, 'Foo : instance')
  },
  render() {
    return h('div', 'this is foo')
  },
}
