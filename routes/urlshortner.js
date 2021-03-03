const express = require("express");
const cors = require("cors");
const shortid = require("shortid");
const validUrl = require("valid-url");
const controller = require("../controller");
const dataBase = new controller.DataBase();
const utils = require("../net-utils");
let router = express.Router();

router.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: "*",
    preflightContinue: true,
  })
);

router.put("/api/shorturl/", async (req, res) => {
  const longUrl = req.body.longUrl;
  const baseUrl = "http://localhost:3000";
  // if (!validUrl.isUri(baseUrl)) {
  //   return res.status(401).json("Internal server error.");
  // }
  dataBase.checkIfUrlExists();
  const urlCode = shortid.generate();
  if (validUrl.isHttpUri(longUrl) || validUrl.isHttpsUri(longUrl)) {
    try {
      const urls = await utils.readBin();
      const alreadyShortened = urls.find(
        (element) => element.long === `${longUrl}`
      );
      if (alreadyShortened) {
        return res.status(200).json(alreadyShortened);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;
        url = new controller.Url(longUrl, shortUrl, urlCode, 0);
        dataBase.saveUrl(url);
        return res.status(200).send(`${JSON.stringify(url, null, 2)}`);
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json("Internal Server error " + err.message);
    }
  } else {
    res
      .status(400)
      .json(
        `Invalid URL. Please enter a valid url for shortening. url: ${longUrl}`
      );
  }
});

module.exports = { router, dataBase };
