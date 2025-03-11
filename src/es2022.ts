import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断是否是 es2022 语法
 */
export function es2022(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  const ECMAScript2022Nodes = new Set([
    "StaticBlock",
    "ClassPrivateProperty",
    "PrivateName",
  ]);

  return {
    ClassProperty(path) {
      if (path.node.static) {
        found(path);
      }
    },
    RegExpLiteral(path) {
      // See: https://github.com/tc39/proposal-regexp-match-indices?tab=readme-ov-file#why-use-d-for-the-regexp-flag
      if (path.node.flags.includes("d")) {
        found(path);
      }
    },
    MetaProperty(path) {
      // See: https://github.com/tc39/proposal-import-meta
      path.node.meta.name === "import" &&
        path.node.property.name === "meta" &&
        found(path);
    },
    ...[...ECMAScript2022Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
