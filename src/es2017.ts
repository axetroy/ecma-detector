import type { Visitor } from "@babel/traverse";
import type { Comment, Identifier, RestElement, Pattern } from "@babel/types";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断是否是 es2017 语法
 */
export function es2017(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  const ECMAScript2017Nodes = new Set(["AwaitExpression"]);

  return {
    FunctionDeclaration(path) {
      if (path.node.async) {
        found(path);
        return;
      }

      if (path.node.params.length > 0) {
        const lastParam = path.node.params.at(-1)!;

        let lastNode: Comment | Identifier | RestElement | Pattern = lastParam;

        if (
          lastParam.trailingComments &&
          lastParam.trailingComments.length > 0
        ) {
          lastNode = lastParam.trailingComments.at(-1)!;
        }

        // 通过位置信息判断最后一个参数后面是否有逗号
        const text = context.sourceCode.slice(
          lastNode.end as number,
          path.node.body.start as number
        );

        if (text.trim().at(0) === ",") {
          found(path);
        }
      }
    },
    FunctionExpression(path) {
      if (path.node.async) {
        found(path);
      }
    },
    ArrowFunctionExpression(path) {
      if (path.node.async) {
        found(path);
      }
    },
    ...[...ECMAScript2017Nodes].reduce((acc, nodeType) => {
      acc[nodeType] = found;
      return acc;
    }, {}),
    enter(path) {
      // add(1, 2,)
      if (path.node.extra?.trailingComma) {
        found(path);
      }
    },
  };
}
