// @ts-nocheck
import path from 'path'
import replace from "replace";


const replacementMap = {
  "afcore" : {regex : /lite.*js"/g, replacement : "lite.js\""},
  "lite": {regex : /afcore-.+?\.js"\)/g, replacement : "afcore.js\")"}
}

export default class FileRename {
  
    /**
     * @param {string} filePath
     */
     replace (filePath) {
        const file = path.parse(filePath)
        const fileName = file.name;
        let newName, modern = ".modern";
        if(fileName.includes(modern)) {
          newName = fileName.replace(modern, "");
          this.updateReferences(filePath, replacementMap.afcore)
        } else {
          newName = fileName.split("-")[0];
          this.updateReferences(filePath, replacementMap[newName])
        }
        return path.join(file.dir, newName + file.ext)
    }

    async updateReferences(filePath, {regex, replacement}) {
      console.log("Updating References");
      replace({
        regex: regex,
        replacement: replacement,
        paths: [filePath],
        recursive: false,
        silent: false,
      });
    }
  }