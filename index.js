const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
var bodyParser = require('body-parser')


const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(3000, () => console.log('listening at 3000'));
app.get('/', (req, res) => res.send("Hi"));
// create api capture web page
app.post('/api/capture', async (req, res) => {
  try {
    console.log(req.body)
    const browser = await puppeteer.launch({
      headless: true, args: ['--no-sandbox']
    });
    const url = req.body.url;
    let cookies = req.body.cookies;
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920, height: 1080
    });
    if (cookies)
      await page.setCookie(...(JSON.parse(cookies)));
    await page.goto(url);
    const pathSave = __dirname + "/image" + Date.now() + ".png";
    await page.screenshot({
      path: pathSave
    });
    
    res.sendFile(pathSave);
    res.on('finish', () => {
      fs.unlink(pathSave, () => {});
    });
await browser.close();



  }
  catch(err) {
    res.status(500).send({
      error: err.name,
      message: err.message
    })
  }
});