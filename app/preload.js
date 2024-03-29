// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const path = require('path')
const fs = require("fs");     //ファイル読み書きメソッド用
//const path = process.cwd();
//console.log(path);
//const filenames = fs.readdirSync(path);
//console.log(filenames);
console.log(__dirname);
const buf = Buffer.alloc(512);
try {
  var fd = fs.openSync(path.join(__dirname, "TacOS.dmg"), "r+");    //r+:読み書き可能
  console.log("ファイル:" + fd);
} catch (e) {
  console.log(e.message);
}

const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld(
  'electron', {
  readSector: (n) => {
    console.log("ファイル:" + fd);
    fs.readSync(fd, buf, 0, 512, n * 512);
    return buf;
  },
  writeSector: (data, n) => {
    try {
      fs.writeSync(fd, data, n * 512);
    } catch (e) {
      console.log(e.message);
    }
  }
}
)
