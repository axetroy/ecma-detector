import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断是否是 es2020 语法
 */
export function es2020(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  const ECMAScript2020Nodes = new Set(["OptionalMemberExpression"]);

  return {
    LogicalExpression(path) {
      if (path.node.operator === "??") {
        found(path);
      }
    },
    CallExpression(path) {
      // See: https://github.com/tc39/proposal-dynamic-import
      path.node.callee.type === "Import" && found(path);
    },
    ...[...ECMAScript2020Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
