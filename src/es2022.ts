import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common";

/**
 * 判断是否是 es2022 语法
 */
export function es2022(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  const ECMAScript2022Nodes = new Set([
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
    ...[...ECMAScript2022Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
  };
}
