const utils = require("./net-utils");

class DataBase {
  constructor(urls = [], userIDs = []) {
    this.urls = urls;
    this.userIDs = userIDs;
  }

  async checkIfUrlExists(url) {
    const binData = await utils.readBin();
    console.log(binData);
  }

  saveUrl(url) {
    if (!this.checkIfUrlExists(url)) {
      this.urls.push(url);
    }
    utils.addToBin(url);
  }

  updateUrl() {}

  deleteUrl() {}
}

class Url {
  constructor(long, short, urlCode, clickCount, owner) {
    this.long = long;
    this.short = short;
    this.urlCode = urlCode;
    this.clickCount = clickCount;
    this.owner = owner;
  }
}

module.exports = { DataBase, Url };
