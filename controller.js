const netUtils = require("./net-utils");

class DataBase {
  constructor(urls = [], userIDs = []) {
    this.urls = urls;
    this.userIDs = userIDs;
  }

  saveUrl(url) {
    netUtils.addToBin(url);
  }

  updateUrl() {}

  deleteUrl() {}

  // register(username, password) {
  //   netUtils.registerToService(username, password);
  // }
}

class Url {
  constructor(long, short, urlCode, clickCount, creationDate, owner) {
    this.long = long;
    this.short = short;
    this.urlCode = urlCode;
    this.clickCount = clickCount;
    this.creationDate = creationDate;
    this.owner = owner;
  }
}

class User {
  constructor(urls, username, id) {
    this.urls = urls;
    this.username = username;
    this.id = id;
  }
}

module.exports = { DataBase, Url, User };
