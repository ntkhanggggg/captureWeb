const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const bodyParser = require("body-parser");
const ngrok = require("ngrok");

ngrok.authtoken("2HQsXbVcXBf2F4c1MftTa9KZXgI_4T8piep33KumV46si4D6S");
const app = express();
// app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const PORT = process.env.PORT || 3001;
// get http tunnel url
ngrok.connect(PORT).then(url => {
  console.log("ngrok url: ", url);
});

app.listen(PORT, () => console.log("listening at " + PORT));
app.get("/", (req, res) => res.send("Hi"));
// create api capture web page


app.post("/api/capture", async (req, res) => {
  try {
    console.log(req.body);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });
    const url = req.body.url;
    let cookies = req.body.cookies;
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    if (cookies) await page.setCookie(...JSON.parse(cookies));
    await page.goto(url);
    const pathSave = __dirname + "/image" + Date.now() + ".png";
    await page.screenshot({
      path: pathSave
    });

    res.sendFile(pathSave);
    res.on("finish", () => {
      fs.unlink(pathSave, () => { });
    });
    await browser.close();
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: err.name,
      message: err.message
    });
  }
});
