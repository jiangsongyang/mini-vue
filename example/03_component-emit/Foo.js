import { h } from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
  setup(props, { emit }) {
    const count = props.count
    const emitAdd = () => {
      // 普通事件名称
      emit('add', { newValue: 2 })
      // 肉串事件名称
      emit('add-foo', { newValue: 3 })
    }
    return { emitAdd, count }
  },
  render() {
    const btn = h('button', { onClick: this.emitAdd }, 'emit add button')
    const foo = h('p', {}, 'count : ' + this.count)
    return h('div', {}, [foo, btn])
  },
}
