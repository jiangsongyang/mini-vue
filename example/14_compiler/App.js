import { ref } from '../../lib/guide-mini-vue.esm.js';

export default {
  setup() {
    const counter = (window.counter = ref(1))
    return {
      message: 'mini-vue',
      counter,
    }
  },
  template: `<div>hi, {{message}} counter: {{counter}}</div>`,
}