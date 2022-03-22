import { h, renderSlots } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(props, { emit }) {},
  render() {
    // 匿名插槽
    const foo = h('div', 'this is foo')
    return h('div', {}, [foo, renderSlots(this.$slots)])
    // 具名插槽
    // const foo = h('div', 'this is foo')
    // return h('div', {}, [
    //   renderSlots(this.$slots, 'header'),
    //   foo,
    //   renderSlots(this.$slots, 'footer'),
    // ])
    // 作用域插槽
    // const age = 18
    // const foo = h('div', 'this is foo')
    // return h('div', {}, [
    //   renderSlots(this.$slots, 'header', {age}),
    //   foo,
    //   renderSlots(this.$slots, 'footer'),
    // ])
  },
}
