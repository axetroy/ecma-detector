import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common";

/**
 * 判断是否是 es2019 语法
 */
export function es2019(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  return {
    CatchClause(path) {
      if (!path.node.param) {
        found(path);
      }
    },
  };
}
