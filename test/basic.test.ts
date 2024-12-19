import test from "node:test";
import assert from "node:assert";
import { isECMAScript } from "../src/index";
import outdent from "outdent";

const testCases = {
  5: [
    "var a = 1",
    "function a() {}",
    "var a = function() {}",
    "var a = { b: 1 }",
    "var a = [1]",
    "var a = new Date()",
    "var a = /a/",
    "try {} catch (error) {}",
  ],
  2015: [
    "const a = 1",
    "let a = 1",
    "var [] = []",
    "var {} = {}",
    "var { a = 1 } = {}",
    "var { a, ...b } = {}",
    "class A {}",
    "() => {}",
    "function *a(){}",
    'import a from "a"',
    "export default a",
    "export const a = 1",
    "export function a() {}",
    "for (let a of []) {}",
    'import("./foo")',
    "`${a}`",
    "a`b`",
    "class A { constructor() { new.target } }",
    "import.meta",
    "100n",
    "function a({ a = 1 }) {}",
    "function a([a = 1]) {}",
    "function a(a = 1) {}",
    "function a(...b) {}",
    "function a(a, ...b) {}",
    "const binary = 0B00000000011111111111111111111111",
    "const octal = 0o1234567",
  ],
  2016: ["2 ** 2"],
  2017: [
    "async function a() {}",
    "async () => {}",
    "async function *a() {}",
    "await a",
    "add(1,2,)",
    "function foo(a,b,) {}",
    "function foo(a,b/** */,) {}",
    "function foo(a,b/** */  ,) {}",
  ],
  2018: ["for await (const item of items) {}"],
  2019: ["try {} catch {}"],
  2020: ["a?.b?.c", "a ?? b"],
  2021: ["const budget = 1_000_000_000_000;", "a ||= b; // a || (a = b);"],
  2022: [
    outdent`
          class C {
            static x = 'x';
            static y;
            static z;
            static {
                try {
                const obj = doSomethingWith(this.x);
                this.y = obj.y;
                this.z = obj.z;
                } catch (err) {
                this.y = 'y is error';
                this.z = 'z is error';
                }
            }
          }
        `,
    outdent`
          class Person {
            #name = 'Ergonomic brand checks for Private Fields';
            static check(obj) {
                return #name in obj;
            }
          }
        `,
  ],
};

function getGreaterThanVersion(version) {
  const versions = Object.keys(testCases);
  const index = versions.indexOf(version);

  if (index === -1) {
    return [];
  }

  return versions.slice(index + 1);
}

function getLessThanVersion(version) {
  const versions = Object.keys(testCases);
  const index = versions.indexOf(version);

  if (index === -1) {
    return [];
  }

  return versions.slice(0, index);
}

test("detect", (t) => {
  for (const [version, testCase] of Object.entries(testCases)) {
    if (Number(version) < 2015) continue;

    const fn = isECMAScript[`isECMAScript${version}`];

    for (const code of [
      ...testCase,
      ...getGreaterThanVersion(version).flatMap((v) => testCases[v]),
    ]) {
      assert(fn(code), `'${code}' should be es${version}`);
    }
  }

  for (const [version] of Object.entries(testCases).reverse()) {
    if (Number(version) < 2015) continue;

    const fn = isECMAScript[`isECMAScript${version}`];

    for (const code of getLessThanVersion(version).flatMap(
      (v) => testCases[v]
    )) {
      assert(!fn(code), `'${code}' should not be es${version}`);
    }
  }
});

test("detect invalid version", (t) => {
  const invalidVersions = ["es5", "2014", "2023", "toString"];

  for (const version of invalidVersions) {
    assert.throws(
      // @ts-expect-error ignore
      () => isECMAScript("var a = 1", version),
      new Error(`Unsupported version: ${version}`)
    );
  }
});
