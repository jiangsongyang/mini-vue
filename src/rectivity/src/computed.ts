import { ReactiveEffect } from './effect'

// computed 特点
// 1 : 不触发 get value 不执行 getter function
// 2 :

class ComputedImpl {
  // 全局的开关
  // 根据 _dirty 来控制缓存
  private _dirty: boolean = true
  // getter function 的执行结果
  private _value: any
  // 需要借助这个实现
  // 依赖的收集 和 _dirty 状态的重置
  private _effect: any

  constructor(getter: any) {
    // NOTE
    // 这里需要借助 ReactiveEffect 这个类
    // 用来收集 getter 中的依赖
    // 如果触发了 setter 导致依赖更新
    // 就改变 _dirty 重新执行 getter 获取最新的值
    // 之后在 get value 的时候返回出去
    this._effect = new ReactiveEffect(getter, {
      scheduler: () => {
        if (!this._dirty) this._dirty = true
      },
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      // NOTE
      // 在 get value 时才调用 getter function
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter: any) {
  return new ComputedImpl(getter)
}
