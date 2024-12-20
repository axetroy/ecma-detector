import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import type { Visitor } from "@babel/traverse";
import { es2015 } from "./es2015";
import { es2016 } from "./es2016";
import { es2017 } from "./es2017";
import { es2018 } from "./es2018";
import { es2019 } from "./es2019";
import { es2020 } from "./es2020";
import { es2021 } from "./es2021";
import { es2022 } from "./es2022";
import { es2023 } from "./es2023";
import type { Context } from "./common";

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
  | "2023";

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

export const isECMAScript: IsECMAScript = Object.assign(
  (code: string, version: ECMAScriptVersion) => {
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
  },
  {
    isECMAScript2015,
    isECMAScript2016,
    isECMAScript2017,
    isECMAScript2018,
    isECMAScript2019,
    isECMAScript2020,
    isECMAScript2021,
    isECMAScript2022,
    isECMAScript2023,
  }
);

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
