const path = require("path");

// 定义要处理的文件夹路径
const dirPath = path.join(__dirname, "../dist/esm"); // 根据实际情况设置

require("./renameModule.cjs")(dirPath, "mjs");
