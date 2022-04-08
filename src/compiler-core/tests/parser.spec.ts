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
});
