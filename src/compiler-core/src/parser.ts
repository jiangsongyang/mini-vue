import { NodeType } from './ast'

const enum TagType {
  START,
  END,
}

export function baseParse(content: string) {
  const context = createContext(content)
  return createRoot(parseChildren(context, []))
}

function createContext(content: string) {
  return {
    source: content,
  }
}

function createRoot(children) {
  return {
    children,
    type: NodeType.ROOT,
  }
}

function parseChildren(context: { source: string }, ancestors): any {
  const nodes: any = []
  while (!isEnd(context, ancestors)) {
    let node
    const s = context.source
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (s.startsWith('<') && /[a-z]/i.test(s[1])) {
      node = parseElement(context, ancestors)
    }
    if (!node) {
      node = parseText(context)
    }
    nodes.push(node)
  }
  return nodes
}

function isEnd(context: { source: string }, ancestors) {
  const s = context.source
  // 2. 遇到结束标签
  if (s.startsWith('</')) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i].tag
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }
  // 1. source 有值
  return !s
}

function parseInterpolation(context: { source: string }) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  // 将字符串截取为 message}}
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  )
  // 让后将字符串前面的 {{ 舍弃掉，我们将其称之为【推进】
  advanceBy(context, openDelimiter.length)
  // 获取到 {{}} 中间值的长度
  const rawContentLength = closeIndex - openDelimiter.length
  // 并将中间这个值获取出来
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()
  // 继续【推进】
  advanceBy(context, rawContentLength + closeDelimiter.length)
  return {
    type: NodeType.INTERPOLATION,
    content: {
      type: NodeType.SIMPLE_EXPRESSION,
      content: content,
    },
  }
}

function advanceBy(context, length: number) {
  context.source = context.source.slice(length)
}

function parseElement(context: { source: string }, ancestors): any {
  const element: any = parseTag(context, TagType.START)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.END)
  } else {
    throw new Error(`unclosed tag ${element.tag}`)
  }
  return element
}

function parseTag(context: { source: string }, type: TagType) {
  // i 忽略大小写, ([a-z]*) 作为一个分组
  const match = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = match![1]
  advanceBy(context, match![0].length + 1)
  if (type === TagType.END) return
  return {
    type: NodeType.ELEMENT,
    tag,
  }
}

function parseText(context: { source: string }): any {
  const s = context.source
  const endTokens = ['<', '{{']
  let endIndex = s.length
  for (let i = 0; i < endTokens.length; i++) {
    const index = s.indexOf(endTokens[i])
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }
  const content = parseTextData(context, endIndex)
  advanceBy(context, content.length)
  return {
    type: NodeType.TEXT,
    content,
  }
}

function parseTextData(context: { source: string }, length) {
  return context.source.slice(0, length)
}

function startsWithEndTagOpen(source, tag) {
  const endTokenLength = '</'.length
  return source.slice(endTokenLength, tag.length + endTokenLength) === tag
}