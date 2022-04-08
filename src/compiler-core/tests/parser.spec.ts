import { baseParser } from "../src/parser";
import { NodeTypes } from "../src/ast";

describe("parser", () => {
  describe("interpolation", () => {
    it("simple interpolation", () => {
      const ast = baseParser("{{ msg }}");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "msg",
        },
      });
    });
  });

  describe("element", () => {
    it("simple element div", () => {
      const ast = baseParser("<div></div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
      });
    });
  });
});
