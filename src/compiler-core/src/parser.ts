import { NodeTypes } from "./ast";

type Context = {
  source: string;
};

export function baseParser(content: string) {
  const context = createParserContext(content);

  return createRoot(parseChildren(context));
}

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

function parseChildren(context: Context) {
  const nodes = [];
  let node;
  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
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
  const rawContent = context.source.slice(0, rawContentLength);
  // 处理空格
  // {{ message }}
  const content = rawContent.trim();
  // 需要继续 推进
  // 防止插值表达式后面还有内容
  // {{ message }}<div>...</div>
  advanceBy(context, rawContentLength + closeDelimiter.length);

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
