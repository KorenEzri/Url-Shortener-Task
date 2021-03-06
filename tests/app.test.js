const app = require("../routes/app.js");
const { router } = require("../routes/urlshortner.js");
const request = require("supertest");
const fs = require("fs");
const shortid = require("shortid");
const validUrl = require("valid-url");
const { describe, it } = require("@jest/globals");
const longUrl =
  "https://www.google.com/search?q=adadsa&oq=adadsa&aqs=chrome..69i57j0i10l9.708j0j7&sourceid=chrome&ie=UTF-8";

describe("URL SHORTENER API", () => {
  it("Should be able to get shortened URL", async (done) => {
    requestBody = { longUrl: "http://www.testurl.test" };
    let response = await (await request(router).put("/api/shorturl")).send(
      requestBody
    );
    console.log(response);
    // const isShortID = body.match(/\b \/.*/g);
    expect(shortenUrl.status).toBe(200);
    expect(isShortID).toBe(true);
    done();
  });
  it("Should response with an error if receiving an invalid URL", async () => {
    //
  });
  it("Should response with the same id if receiving an existing URL", async () => {
    //
  });

  it("Should be able to get redirected", async () => {
    //
  });

  it("Should be able to get statistics for a short URL", async () => {
    //
  });

  it("Should add 1 to 'clicks' when redirecting", async () => {
    //
  });

  it("Should return an error when recieveing an invalid ID", async () => {
    //
  });
});
