import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断是否是 ES2015 语法
 */
export function es2015(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  const ECMAScript2015Nodes = new Set([
    "ArrowFunctionExpression",
    "ClassDeclaration",
    "TemplateLiteral",
    "ArrayPattern",
    "ObjectPattern",
    "AssignmentPattern",
    "ForOfStatement",
    "ImportDeclaration",
    "Import",
    "ImportDeclaration",
    "ExportAllDeclaration",
    "ExportDeclaration",
    "ExportDefaultDeclaration",
    "ExportDefaultSpecifier",
    "ExportNamedDeclaration",
    "ExportNamespaceSpecifier",
    "ExportSpecifier",
    "ForOfStatement",
    "TemplateLiteral",
    "TaggedTemplateExpression",
    "MetaProperty",
    "BigIntLiteral",
    "SpreadElement",
    "RestElement",
  ]);

  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Binary
  const BINARY_NUMBER_REG_EXP = /^0b[01_]+$/;
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Octal
  const OCTAL_NUMBER_REG_EXP = /^0o[0-7_]+$/;

  return {
    // 遍历变量声明（如 let 和 const）
    VariableDeclaration(path) {
      if (path.node.kind === "let" || path.node.kind === "const") {
        found(path);
      }
    },
    FunctionDeclaration(path) {
      if (path.node.generator) {
        found(path);
      }
    },
    FunctionExpression(path) {
      if (path.node.generator) {
        found(path);
      }
    },
    RegExpLiteral(path) {
      const flags = path.node.flags;
      (flags.includes("u") || flags.includes("y")) && found(path);
    },
    NumericLiteral(path) {
      if (
        typeof path.node.extra?.raw === "string" &&
        (BINARY_NUMBER_REG_EXP.test(path.node.extra.raw) ||
          OCTAL_NUMBER_REG_EXP.test(path.node.extra.raw))
      ) {
        found(path);
      }
    },
    ...[...ECMAScript2015Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
