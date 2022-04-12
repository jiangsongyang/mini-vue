/**
 *
 *  parse 的核心目的
 *  是为了生成 ast
 *
 *  有了 ast 之后
 *  就可以进行精细加工 transform
 *
 *  最后在生辰代码 codegen
 *
 */

import { NodeTypes } from './ast'

enum TagTypes {
  START,
  END,
}

type ParseTagRes = {
  type: NodeTypes
  tag: string
}

type Ancestors = ParseTagRes[]

type Context = {
  source: string
}

// parser
export function baseParser(content: string) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context, []))
}

// 创建 root
function createRoot(children) {
  return {
    children,
    type: NodeTypes.ROOT,
  }
}

function createParserContext(content: string): any {
  return {
    source: content,
  }
}

// 解析 children
function parseChildren(context: Context, ancestors: Ancestors) {
  const nodes = []
  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source
    // 如果是 ```插值表达式```
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    }
    // 如果是 ```元素 ```
    else if (s[0] === '<') {
      // 匹配 a-z 忽略大小写
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }
    // 如果不是插值 又不是 元素
    if (!node) {
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

// 什么时候需要停止解析 children
function isEnd(context: Context, ancestors: Ancestors) {
  // source 有值的时候
  // ||
  // 遇到结束标签的时候
  const s = context.source
  if (s.startsWith('</')) {
    // 倒着循环
    // 因为用的是 栈
    // 预期目标在栈顶
    // 所以倒着循环有助于大部分情况的效率提升
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag
      if (startsWithEndTagOpen(context.source, tag)) {
        return true
      }
    }
  }
  return !context.source.length
}

// 处理插值表达式
// HOW
// {{ messaage }}
// 匹配第二个 ``` { ```
// 和第一个   ``` } ```
// 可以拿到索引 索引的差的范围
// 就是所匹配的字符串的范围
function parseInterpolation(context: Context) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  const closeIndex = context.source.indexOf('}}', openDelimiter.length)
  // 从头开始推进
  // 将 {{ 推掉
  advanceBy(context, openDelimiter.length)

  // 拿到 插值表达式 中间的内容的范围
  const rawContentLength = closeIndex - openDelimiter.length
  // 截取出插值表达式的内容
  const rawContent = parseTextData(context, rawContentLength)
  // 处理空格
  // {{ message }}
  const content = rawContent.trim()
  // 需要继续 推进
  // 防止插值表达式后面还有内容
  // {{ message }}<div>...</div>
  advanceBy(context, closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  }
}

// 推进
function advanceBy(context: Context, length: number) {
  context.source = context.source.slice(length)
}

// 解析元素
function parseElement(context: Context, ancestors: Ancestors) {
  // 解析 开始标签 <div>
  const element: any = parseTag(context, TagTypes.START)
  // 收集到栈中
  ancestors.push(element)
  // 解析子元素
  element.children = parseChildren(context, ancestors)
  // 解析完 children
  // 弹出栈
  ancestors.pop()
  // 如果 element.tag === souce的类型
  // 说明都存在开闭标签
  // 可以正常解析 tag
  if (startsWithEndTagOpen(context.source, element.tag)) {
    // 解析 结束标签 </div>
    parseTag(context, TagTypes.END)
  } else {
    throw new Error(`unclosed tag ${element.tag}`)
  }
  return element
}

// 解析 tag
// HOW
// 解析 tag
// 删除处理完成的代码 ( 推进 )
function parseTag(context: Context, type: TagTypes) {
  // 匹配 tag
  const match: any = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match[1]

  // 推进
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagTypes.END) return
  return {
    type: NodeTypes.ELEMENT,
    tag,
  }
}

function parseText(context: Context) {
  // 处理
  // <> <p>this is text</p> {{ xxx }} </p>
  // 这种情况
  let endIndex = context.source.length
  let endTokens = ['<', '{{']
  for (let i = 0; i < endTokens.length; i++) {
    // 找 text 中有没有 {{ 或者 <
    const index = context.source.indexOf(endTokens[i])
    // 如果找到了
    // 且 index 小于 endIndex
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }

  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function parseTextData(context: Context, length: number) {
  // 1 . 获取 content
  const content = context.source.slice(0, length)
  // 2 . 推进
  advanceBy(context, length)

  return content
}

function startsWithEndTagOpen(source: string, tag: string) {
  return (
    source.startsWith('</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  )
}
