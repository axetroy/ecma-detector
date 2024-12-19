import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";

/**
 * 判断是否是 es2016 语法
 */
export function es2016(references: { result: boolean }): Visitor {
  const found = (path: NodePath) => {
    references.result = true;
    path.stop();
  };

  /**
   * @type {import('@babel/traverse').Visitor}
   */
  return {
    BinaryExpression(path) {
      if (path.node.operator === "**") {
        found(path);
      }
    },
  };
}
