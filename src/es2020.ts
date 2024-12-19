import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";

/**
 * 判断是否是 es2020 语法
 */
export function es2020(references: { result: boolean }): Visitor {
  const found = (path: NodePath) => {
    references.result = true;
    path.stop();
  };

  const ECMAScript2020Nodes = new Set(["OptionalMemberExpression"]);

  return {
    LogicalExpression(path) {
      if (path.node.operator === "??") {
        found(path);
      }
    },
    ...[...ECMAScript2020Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
