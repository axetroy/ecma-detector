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

export declare const isECMAScript: IsECMAScript;
export declare const isECMAScript2015: (code: string) => boolean;
export declare const isECMAScript2016: (code: string) => boolean;
export declare const isECMAScript2017: (code: string) => boolean;
export declare const isECMAScript2018: (code: string) => boolean;
export declare const isECMAScript2019: (code: string) => boolean;
export declare const isECMAScript2020: (code: string) => boolean;
export declare const isECMAScript2021: (code: string) => boolean;
export declare const isECMAScript2022: (code: string) => boolean;
export declare const isECMAScript2023: (code: string) => boolean;
export declare const isECMAScript2024: (code: string) => boolean;
export declare const isECMAScript2025: (code: string) => boolean;
