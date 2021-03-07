const app = require("../routes/app.js");
const supertest = require("supertest");
const { router } = require("../routes/urlshortner.js");
const request = supertest(router);
const mainServerRequest = supertest(app);
const fs = require("fs");
const { describe, it } = require("@jest/globals");
const testUrl =
  "https://www.google.com/search?q=adadsa&oq=adadsa&aqs=chrome..69i57j0i10l9.708j0j7&sourceid=chrome&ie=UTF-8";
const alreadyShortenedUrl =
  "https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type";
let oldCount;
let oldShortID;
describe("URL SHORTENER API", () => {
  it("should be able to get shortened URL", async (done) => {
    let longUrl = testUrl;
    requestBody = { longUrl };
    const response = await request.put("/api/shorturl/").send(requestBody);
    const { short } = JSON.parse(response.text);
    let isShortID = false;
    short.padStart("/");
    if (short.match(/\b\/.*/g)) {
      isShortID = true;
    }
    oldShortID = short;
    expect(response.status).toBe(200);
    expect(isShortID).toBe(!null);
    done();
  });
  it("should respond with an error when provided a faulty URL", async (done) => {
    requestBody = {
      lol: "kaki HAHAAHAHAHAHA",
    };
    const response = await request.put("/api/shorturl/").send(requestBody);
    expect(response.status).toBe(400);
    expect(JSON.parse(response.text).msg).toBe(`Invalid URL`);
    done();
  });
  it("should return the existing shortened URL if the link has already been shortened. ", async (done) => {
    let longUrl = alreadyShortenedUrl;
    let requestBody = { longUrl };
    const oldShortenResponse = await request
      .put("/api/shorturl/")
      .send(requestBody);
    const response = await request.put("/api/shorturl/").send(requestBody);
    urlObj = JSON.parse(oldShortenResponse.text);
    shortUrl = urlObj.short;
    oldShortID = urlObj.urlCode;
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text).short).toBe(shortUrl);
    done();
  });
  it("should redirect the user to the relevant longUrl", async (done) => {
    console.log(oldShortID);
    const response = await mainServerRequest.get(`/${oldShortID}`);
    const { headers } = response;
    expect(headers).toHaveProperty("location");
    done();
  });
  it("should be able to get statistics for a short URL", async (done) => {
    const numberOfClicks = [];
    const { text } = await mainServerRequest.put(`/clicks`);
    textArray = text.split(",");
    let counter = 0;
    textArray.forEach((countElement) => {
      if (
        countElement === `"${oldShortID}"` ||
        countElement === `["${oldShortID}"` ||
        countElement === `["${oldShortID}"]` ||
        countElement === `"${oldShortID}"]`
      ) {
        counter++;
      }
    });
    oldCount = counter;
    expect(counter).toBeGreaterThan(0);
    done();
  });
  it("should increment the amount of clicks for the relevant link when redirected", async (done) => {
    const response = await mainServerRequest.get(`/${oldShortID}`);
    const numberOfClicks = [];
    const { text } = await mainServerRequest.put(`/clicks`);
    textArray = text.split(",");
    let counter = 0;
    textArray.forEach((countElement) => {
      if (
        countElement === `"${oldShortID}"` ||
        countElement === `["${oldShortID}"` ||
        countElement === `["${oldShortID}"]` ||
        countElement === `"${oldShortID}"]`
      ) {
        counter++;
      }
    });
    expect(counter).toBeGreaterThan(oldCount);
    done();
  });
});
