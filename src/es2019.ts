import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";

/**
 * 判断是否是 es2019 语法
 */
export function es2019(references: { result: boolean }): Visitor {
  const found = (path: NodePath) => {
    references.result = true;
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
