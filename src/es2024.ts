import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断是否是 ES2024 语法
 */
export function es2024(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  return {
    RegExpLiteral(path) {
      path.node.flags.includes("v") && found(path);
    },
  };
}
