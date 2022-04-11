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

import { NodeTypes } from "./ast";

enum TagTypes {
  START,
  END,
}

type Context = {
  source: string;
};

// parser
export function baseParser(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

// 创建 root
function createRoot(children) {
  return {
    children,
  };
}

function createParserContext(content: string): any {
  return {
    source: content,
  };
}

// 解析 children
function parseChildren(context: Context) {
  const nodes = [];
  let node;
  const s = context.source;
  // 如果是 ```插值表达式```
  if (s.startsWith("{{")) {
    node = parseInterpolation(context);
  }
  // 如果是 ```元素 ```
  else if (s[0] === "<") {
    // 匹配 a-z 忽略大小写
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  }
  // 如果不是插值 又不是 元素
  if (!node) {
    node = parseText(context);
  }

  nodes.push(node);
  return nodes;
}

// 处理插值表达式
// HOW
// {{ messaage }}
// 匹配第二个 ``` { ```
// 和第一个   ``` } ```
// 可以拿到索引 索引的差的范围
// 就是所匹配的字符串的范围
function parseInterpolation(context: Context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const closeIndex = context.source.indexOf("}}", openDelimiter.length);
  // 从头开始推进
  // 将 {{ 推掉
  advanceBy(context, openDelimiter.length);

  // 拿到 插值表达式 中间的内容的范围
  const rawContentLength = closeIndex - openDelimiter.length;
  // 截取出插值表达式的内容
  const rawContent = parseTextData(context, rawContentLength);
  // 处理空格
  // {{ message }}
  const content = rawContent.trim();
  // 需要继续 推进
  // 防止插值表达式后面还有内容
  // {{ message }}<div>...</div>
  advanceBy(context, closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

// 推进
function advanceBy(context: Context, length: number) {
  context.source = context.source.slice(length);
}

// 解析元素
function parseElement(context: Context) {
  // 解析 开始标签 <div>
  const element = parseTag(context, TagTypes.START);
  // 解析 结束标签 </div>
  parseTag(context, TagTypes.END);
  return element;
}

// 解析 tag
// HOW
// 解析 tag
// 删除处理完成的代码 ( 推进 )
function parseTag(context: Context, type: TagTypes) {
  // 匹配 tag
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];

  // 推进
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagTypes.END) return;
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}

function parseText(context: Context) {
  const content = parseTextData(context, context.source.length);
  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context: Context, length: number) {
  // 1 . 获取 content
  const content = context.source.slice(0, length);
  // 2 . 推进
  advanceBy(context, length);

  return content;
}
