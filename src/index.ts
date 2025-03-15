import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import type { Visitor } from "@babel/traverse";
import { es2015 } from "./es2015.js";
import { es2016 } from "./es2016.js";
import { es2017 } from "./es2017.js";
import { es2018 } from "./es2018.js";
import { es2019 } from "./es2019.js";
import { es2020 } from "./es2020.js";
import { es2021 } from "./es2021.js";
import { es2022 } from "./es2022.js";
import { es2023 } from "./es2023.js";
import { es2024 } from "./es2024.js";
import { es2025 } from "./es2025.js";
import type { Context } from "./common.js";

const versions: Record<ECMAScriptVersion, (context: Context) => Visitor> =
  Object.assign(Object.create(null), {
    2015: es2015,
    2016: es2016,
    2017: es2017,
    2018: es2018,
    2019: es2019,
    2020: es2020,
    2021: es2021,
    2022: es2022,
    2023: es2023,
    2024: es2024,
    2025: es2025,
  });

export type ECMAScriptVersion =
  | "2015"
  | "2016"
  | "2017"
  | "2018"
  | "2019"
  | "2020"
  | "2021"
  | "2022"
  | "2023"
  | "2025"
  | "2024"
  | "2025";

export interface IsECMAScript {
  (code: string, version: ECMAScriptVersion): boolean;

  isECMAScript2015(code: string): boolean;
  isECMAScript2016(code: string): boolean;
  isECMAScript2017(code: string): boolean;
  isECMAScript2018(code: string): boolean;
  isECMAScript2019(code: string): boolean;
  isECMAScript2020(code: string): boolean;
  isECMAScript2021(code: string): boolean;
  isECMAScript2022(code: string): boolean;
  isECMAScript2023(code: string): boolean;
  isECMAScript2024(code: string): boolean;
  isECMAScript2025(code: string): boolean;
}

export const isECMAScript2015 = (code: string) => isECMAScript(code, "2015");
export const isECMAScript2016 = (code: string) => isECMAScript(code, "2016");
export const isECMAScript2017 = (code: string) => isECMAScript(code, "2017");
export const isECMAScript2018 = (code: string) => isECMAScript(code, "2018");
export const isECMAScript2019 = (code: string) => isECMAScript(code, "2019");
export const isECMAScript2020 = (code: string) => isECMAScript(code, "2020");
export const isECMAScript2021 = (code: string) => isECMAScript(code, "2021");
export const isECMAScript2022 = (code: string) => isECMAScript(code, "2022");
export const isECMAScript2023 = (code: string) => isECMAScript(code, "2023");
export const isECMAScript2024 = (code: string) => isECMAScript(code, "2024");
export const isECMAScript2025 = (code: string) => isECMAScript(code, "2025");

export const isECMAScript: IsECMAScript = (
  code: string,
  version: ECMAScriptVersion
) => {
  if (version in versions === false) {
    throw new Error(`Unsupported version: ${version}`);
  }

  const ast = parser.parse(code, { sourceType: "module" });

  const result: Context = { result: false, sourceCode: code };

  traverse(
    ast,
    combineVisitors(
      ...Object.values(versions)
        .slice(Number(version) - 2015)
        .map((v) => v(result))
    )
  );

  return result.result;
};

isECMAScript.isECMAScript2015 = isECMAScript2015;
isECMAScript.isECMAScript2016 = isECMAScript2016;
isECMAScript.isECMAScript2017 = isECMAScript2017;
isECMAScript.isECMAScript2018 = isECMAScript2018;
isECMAScript.isECMAScript2019 = isECMAScript2019;
isECMAScript.isECMAScript2020 = isECMAScript2020;
isECMAScript.isECMAScript2021 = isECMAScript2021;
isECMAScript.isECMAScript2022 = isECMAScript2022;
isECMAScript.isECMAScript2023 = isECMAScript2023;
isECMAScript.isECMAScript2024 = isECMAScript2024;
isECMAScript.isECMAScript2025 = isECMAScript2025;

export default isECMAScript;

function combineVisitors(...visitors: Visitor[]) {
  return visitors.reduce((acc, visitor) => {
    for (const key in visitor) {
      if (acc[key]) {
        const originalNodeVisitor = acc[key];
        acc[key] = function (...args) {
          originalNodeVisitor.apply(this, args);
          visitor[key].apply(this, args);
        };
      } else {
        acc[key] = visitor[key];
      }
    }
    return acc;
  }, {});
}
