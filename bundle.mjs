// @ts-nocheck
import path from 'path'

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
        } 
        return path.join(file.dir, newName + file.ext)
    }
  }