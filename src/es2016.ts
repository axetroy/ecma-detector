import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断是否是 es2016 语法
 */
export function es2016(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
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
