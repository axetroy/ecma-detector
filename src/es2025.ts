import type { Visitor } from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import type { Context } from "./common.js";

/**
 * 判断正则表达式是否包含 ES2018 特性，并检测环境是否支持
 * @param {string} regexString - 正则表达式的字符串形式
 * @returns {Object} 包含是否支持的结果和详细信息
 */
function containsDuplicateNamedCapturingGroups(regexString: string): boolean {
  const result = {
    isSupported: true, // 当前环境是否支持输入的正则表达式
    containsES2018: false, // 正则表达式是否使用了 ES2018 特性
    errorMessage: null, // 如果不支持，记录错误信息
  };

  // 检查是否可能包含 ES2018 的特性（仅通过字符串检测）
  if (regexString.indexOf("(?<") !== -1 || regexString.indexOf("\\k<") !== -1) {
    result.containsES2018 = true;
  }

  try {
    // 使用 `new RegExp` 测试解析支持性
    new RegExp(regexString);
  } catch (e) {
    // 捕获错误，记录不支持的信息
    result.isSupported = false;
    result.errorMessage = e.message;
  }

  return result.containsES2018;
}

/**
 * 判断正则表达式字符串是否包含嵌入式模式修饰符
 * @param {string} regexString - 正则表达式的字符串形式
 * @returns {boolean} 是否包含嵌入式模式修饰符
 */
function containsEmbeddedModifiers(regexString: string): boolean {
  // 正则匹配嵌入式模式修饰符，如 (?i:) (?s:) 等
  const embeddedModifierPattern = /\(\?[ismguyv]*:/;

  return embeddedModifierPattern.test(regexString);
}

/**
 * 判断是否是 ES2025 语法
 */
export function es2025(context: Context): Visitor {
  const found = (path: NodePath) => {
    context.result = true;
    path.stop();
  };

  return {
    RegExpLiteral(path) {
      if (
        // See: https://github.com/tc39/proposal-regexp-modifiers?tab=readme-ov-file#syntax
        containsDuplicateNamedCapturingGroups(path.node.pattern) ||
        // See: https://github.com/tc39/proposal-regexp-modifiers
        containsEmbeddedModifiers(path.node.pattern)
      ) {
        found(path);
      }
    },
    ImportDeclaration(path) {
      path.node.attributes?.length && found(path);
    },
  };
}
