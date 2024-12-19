import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";

/**
 * 判断是否是 es2022 语法
 */
export function es2022(references: { result: boolean }): Visitor {
  const found = (path: NodePath) => {
    references.result = true;
    path.stop();
  };

  const ECMAScript2021Nodes = new Set([
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
    ...[...ECMAScript2021Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
