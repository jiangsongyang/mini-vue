import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(props) {
    console.log(props)
    // test  props is shallowReadonly
    props.a = 1
    props.count = 2
    console.log(props)
  },
  render() {
    return h('div', {}, 'this is Foo component : ' + this.count)
  },
}
