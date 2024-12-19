# ecma-detector

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
![Node](https://img.shields.io/badge/node-%3E=14-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/ecma-detector.svg)](https://badge.fury.io/js/ecma-detector)

A tool to detect ECMAScript version.

## Installation

```bash
npm install ecma-detector --save
```

## Usage

```js
// import via esm
import { isECMAScript } from "ecma-detector";

// import via cjs
const { isECMAScript } = require("ecma-detector");
```

```js
import { isECMAScript, isECMAScript2020 } from "ecma-detector";

isECMAScript("let foo = bar", "2015"); // true
isECMAScript2020("let foo = a ?? b"); // true
```

## License

The [Anti 996 License](LICENSE)
