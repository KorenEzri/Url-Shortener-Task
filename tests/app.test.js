const app = require("../routes/app.js");
const supertest = require("supertest");
const { router } = require("../routes/urlshortner.js");
const request = supertest(router);
const mainServerRequest = supertest(app);
const fs = require("fs");
const shortid = require("shortid");
const validUrl = require("valid-url");
const { describe, it } = require("@jest/globals");
const { url } = require("inspector");
const { count } = require("console");
const testUrl =
  "https://www.google.com/search?q=adadsa&oq=adadsa&aqs=chrome..69i57j0i10l9.708j0j7&sourceid=chrome&ie=UTF-8";
const alreadyShortenedUrl =
  "https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type";
let oldCount;

describe("URL SHORTENER API", () => {
  it("Should be able to get shortened URL", async (done) => {
    let longUrl = testUrl;
    requestBody = { longUrl };
    const response = await request.put("/api/shorturl/").send(requestBody);
    const { short } = JSON.parse(response.text);
    let isShortID = false;
    short.padStart("/");
    if (short.match(/\b\/.*/g)) {
      isShortID = true;
    }
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
    requestBody = {
      longUrl,
    };
    const response = await request.put("/api/shorturl/").send(requestBody);
    expect(response.status).toBe(200);
    expect(JSON.parse(response.text).short).toBe(
      `http://localhost:3000/pDPNopv7e`
    );
    done();
  });
  it("should redirect the user to the relevant longUrl", async (done) => {
    const response = await mainServerRequest.get(`/pDPNopv7e`);
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
        countElement === `"pDPNopv7e"` ||
        countElement === `["pDPNopv7e"` ||
        countElement === `["pDPNopv7e"]` ||
        countElement === `"pDPNopv7e"]`
      ) {
        counter++;
      }
    });
    oldCount = counter;
    expect(counter).toBeGreaterThan(0);
    done();
  });
  it("should increment the amount of clicks for the relevant link when redirected", async (done) => {
    const response = await mainServerRequest.get(`/pDPNopv7e`);
    const numberOfClicks = [];
    const { text } = await mainServerRequest.put(`/clicks`);
    textArray = text.split(",");
    let counter = 0;
    textArray.forEach((countElement) => {
      if (
        countElement === `"pDPNopv7e"` ||
        countElement === `["pDPNopv7e"` ||
        countElement === `["pDPNopv7e"]` ||
        countElement === `"pDPNopv7e"]`
      ) {
        counter++;
      }
    });
    expect(counter).toBeGreaterThan(oldCount);
    done();
  });

  // it("Should return an error when recieveing an invalid ID", async (done) => {
  //   //
  // });
});
