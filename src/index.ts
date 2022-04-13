// 项目入口文件

export * from './reactivity'
export * from './runtime-core'
export * from './runtime-dom'
export * from './shared'
import * as runtimeDom from './runtime-dom'
import { baseCompile } from './compiler-core/src'
import { registerCompiler } from './runtime-core'

function compileToFunction(template: string) {
  console.log('**********************************')
  console.log('----- 开始 compile -----')
  console.log('**********************************')
  const { code } = baseCompile(template)
  console.log('**********************************')
  console.log('----- 生成的 render 函数为-----')
  console.log({ code })
  console.log('**********************************')
  const render = new Function('Vue', code)(runtimeDom)
  return render
}

// 注册编译器
registerCompiler(compileToFunction)
