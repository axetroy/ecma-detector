import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断是否是 es2018 语法
 */
export function es2018(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  const ECMAScript2018Nodes = new Set(["ForAwaitStatement"]);

  return {
    ForOfStatement(path) {
      if (path.node.await) {
        found(path);
      }
    },
    RegExpLiteral(path) {
      if (
        // See: https://github.com/tc39/proposal-regexp-unicode-property-escapes
        (path.node.flags.includes("u") && path.node.pattern.includes("\\p")) ||
        // See: https://github.com/tc39/proposal-regexp-dotall-flag
        path.node.flags.includes("s")
      ) {
        found(path);
      }
    },
    ...[...ECMAScript2018Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
