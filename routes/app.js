require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const shortURL = require("./urlshortner");
const netUtils = require("../net-utils");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const controller = require("../controller");

app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: "*",
    preflightContinue: true,
  })
);
app.use(express.json());
app.use("/public", express.static(`./public`));
app.use(shortURL.router);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use(helmet());
app.use(morgan("tiny"));
let location;
app.put("/ping", async (req, res) => {
  location = req.body.id;
  res.status(200).send(location);
});
const saltRounds = 10;

app.get("/:shortUrl", async (req, res) => {
  const allUrls = await netUtils.readBin(location);
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

app.post("/register", async (req, res) => {
  try {
    const {
      body: { username, password },
    } = req;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        console.error(err);
        return res.status(400).json({ success: false });
      }
      const fileData = await netUtils.readBin("users");
      if (fileData[0]) {
        if (Array.isArray(fileData[0])) {
          await netUtils.registerToService(username, hash, fileData[0]);
        } else {
          await netUtils.registerToService(username, hash, fileData);
        }
      } else {
        await netUtils.registerToService(username, hash);
      }
      return res.status(200).send("Successfully created a new user!");
    });
  } catch (error) {
    console.error(error);
  }
});

app.put("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const fileData = await netUtils.readBin("users");
    let findUser;
    if (fileData[0].length > 1) {
      findUser = fileData[0].find((user) => user.username === username);
    } else {
      findUser = fileData.find((user) => user.username === username);
    }
    console.log(fileData);
    const hash = findUser.password;
    await bcrypt.compare(password, hash, async function (err, result) {
      if (result == true) {
        const id = findUser.id;
        userFile = await netUtils.readBin(id);
        const user = new controller.User(
          userFile,
          findUser.username,
          findUser.id
        );
        res.status(200).send(JSON.stringify(user));
      } else if (result == false) {
        res.status(400).json({ message: `user not found` });
      }
    });
  } catch (error) {
    console.error(error);
  }
});
module.exports = app;
