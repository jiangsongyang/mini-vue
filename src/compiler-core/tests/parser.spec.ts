import { baseParse } from "../src/parser";
import { NodeType } from "../src/ast";

describe("parser", () => {
  describe("interpolation", () => {
    it("simple interpolation", () => {
      const ast = baseParse("{{ msg }}");
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.INTERPOLATION,
        content: {
          type: NodeType.SIMPLE_EXPRESSION,
          content: "msg",
        },
      });
    });
  });

  describe("element", () => {
    it("simple element div", () => {
      const ast = baseParse("<div></div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: "div",
        children: [],
      });
    });
  });

  describe("text", () => {
    it("simple text", () => {
      const ast = baseParse("some text");
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.TEXT,
        content: "some text",
      });
    });
  });

  describe("hello world", () => {
    it("common", () => {
      const ast = baseParse("<div>hi,{{ message }}</div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeType.TEXT,
            content: "hi,",
          },
          {
            type: NodeType.INTERPOLATION,
            content: {
              type: NodeType.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });

    it("nested element", () => {
      const ast = baseParse("<div><p>hi,</p>{{ message }}</div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeType.ELEMENT,
            tag: "p",
            children: [{ type: NodeType.TEXT, content: "hi," }],
          },
          {
            type: NodeType.INTERPOLATION,
            content: {
              type: NodeType.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });

    it("should throw error then lack end tag", () => {
      expect(() => {
        baseParse("<div><p></div>");
      }).toThrow('unclosed tag p');
    });
  });
});
