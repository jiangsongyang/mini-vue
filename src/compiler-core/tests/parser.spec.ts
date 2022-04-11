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
        children: [],
      });
    });
  });

  describe("text", () => {
    it("simple text", () => {
      const ast = baseParser("some text");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: "some text",
      });
    });
  });

  describe("hello world", () => {
    it("common", () => {
      const ast = baseParser("<div>hi,{{ message }}</div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hi,",
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });

    it("nested element", () => {
      const ast = baseParser("<div><p>hi,</p>{{ message }}</div>");
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: "p",
            children: [{ type: NodeTypes.TEXT, content: "hi," }],
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "message",
            },
          },
        ],
      });
    });

    it("should throw error then lack end tag", () => {
      expect(() => {
        baseParser("<div><p></div>");
      }).toThrow('unclosed tag p');
    });
  });
});
