require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const shortURL = require("./urlshortner");
const utils = require("../net-utils");
app.use(cors());
app.use(express.json());
app.use("/public", express.static(`./public`));
app.use(shortURL.router);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/:shortUrl", async (req, res) => {
  const allUrls = await utils.readBin();
  let shortUrlCode = req.params.shortUrl;
  let index = allUrls.findIndex((url) => url.urlCode === shortUrlCode);
  let longUrl = allUrls[index].long;
  try {
    if (longUrl) {
      res.redirect(longUrl);
    } else {
      return res
        .status(400)
        .json("The short url doesn't exists in our system.");
    }
  } catch (err) {
    console.error(
      `Error while retrieving long url for shorturlcode "${shortUrlCode}"`
    );
    return res.status(500).json("There is some internal error.");
  }
});

module.exports = app;
