const fs = require("fs");
const path = require("path");

// 处理文件后缀
const renameModuleFiles = (dir, moduleName) => {
  const extName = moduleName === "cjs" ? ".cjs" : ".mjs";

  // 读取目录下的所有文件
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileExt = path.extname(file);

    // 处理 .js 文件
    if (fileExt === ".js") {
      const newFilePath = path.join(dir, file.replace(/\.js$/, extName));
      const newSourceMapPath = newFilePath + ".map";

      // 替换文件中对 .map 文件的引用
      let content = fs.readFileSync(filePath, "utf8");

      // 更新文件中的路径
      content = content.replace(/\.js\.map/g, `${extName}.map`);

      // 写回修改后的文件
      fs.writeFileSync(filePath, content, "utf8");

      // 重命名 .js 为 .cjs
      fs.renameSync(filePath, newFilePath);

      // 查找对应的 .map 文件
      const mapFilePath = filePath + ".map";
      if (fs.existsSync(mapFilePath)) {
        // 读取 .map 文件
        let mapContent = fs.readFileSync(mapFilePath, "utf8");

        // 更新 .map 文件中的路径
        mapContent = mapContent.replace(/\.js"/g, `${extName}"`);

        // 写回修改后的 .map 文件
        fs.writeFileSync(mapFilePath, mapContent, "utf8");
        console.log(`Updated sourcemap for ${file} -> ${newFilePath}`);

        // 重命名 .map 文件
        fs.renameSync(mapFilePath, newSourceMapPath);
      }
    }
  });
};

module.exports = renameModuleFiles;
