import { NodeTypes } from "../ast";

export function transformExpression(node){
  if(node.type ===NodeTypes.INTERPOLATION){
    const rawContent = node.content.content
    node.content.content = '_ctx.' + rawContent
  }
}