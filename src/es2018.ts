import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";

/**
 * 判断是否是 es2018 语法
 */
export function es2018(references: { result: boolean }): Visitor {
  const found = (path: NodePath) => {
    references.result = true;
    path.stop();
  };

  const ECMAScript2018Nodes = new Set(["ForAwaitStatement"]);

  return {
    ForOfStatement(path) {
      if (path.node.await) {
        found(path);
      }
    },
    ...[...ECMAScript2018Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
