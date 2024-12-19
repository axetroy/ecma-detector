import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common";

/**
 * 判断是否是 es2021 语法
 */
export function es2021(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  return {
    NumericLiteral(path) {
      const raw = path.node.extra?.raw as string;
      if (raw?.includes("_")) {
        found(path);
      }
    },
    AssignmentExpression(path) {
      if (["||=", "&&=", "??="].includes(path.node.operator)) {
        found(path);
      }
    },
  };
}
