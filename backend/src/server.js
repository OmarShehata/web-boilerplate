import express from 'express'
import { engine } from 'express-handlebars';
import { connectToDB } from './db.js'
import { makeRandomToken } from './randomToken.js'
import { dirname } from 'path';
import path from 'path'
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser'
import { Op } from 'sequelize';
import zlib from 'zlib'
import util from 'util'
const gunzip = util.promisify(zlib.gunzip);
const __dirname = dirname(fileURLToPath(import.meta.url));

const DATA_DIRECTORY =  path.join(__dirname, '../.data/')
const TEMP_ZIP_FILE_DIR = path.join(DATA_DIRECTORY, 'temp')
const ARCHIVE_DIRECTORY = path.join(__dirname, '../public/archives')

async function run() {
  const { sequelize, models } = await connectToDB()

  // Initialize data directories
  fs.mkdirSync(ARCHIVE_DIRECTORY, { recursive: true });
  fs.mkdirSync(TEMP_ZIP_FILE_DIR, { recursive: true });


  const app = express();
  app.engine('handlebars', engine({
    helpers: {
      json: JSON.stringify
    }
  }));
  app.set('view engine', 'handlebars');
  app.set('views', './views');
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));

  ///// Pages
  app.get("/", async function (request, response) {
    const average = await computeAverage()
    response.render('index', { average })
  });
  app.get("/average", async function (request, response) {
    const average = await computeAverage()
    response.json({ average })
  });
  app.get("/about", async function(request, response) {
    response.render('about')
  })

  async function computeAverage() {
    const numbers = await models.Number.findAll()
    let average = 0
    for (let item of numbers) {
      average += item.value
    }
    average /= numbers.length
    if (numbers.length == 0) average = 0
    return average
  }
  

  //////// API routes

  app.post('/addNumberForm', async function (request, response) {
    console.log(request.body)
    await models.Number.create({
      value: request.body['rand-num']
    })

    return response.status(200).send("Done!")
  })

  app.post('/addNumber', async function (request, response) {
    const { number } = request.body

    console.log(number)
    await models.Number.create({
      value: number
    })

    return response.json({ done: true })
  })

  const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });

}

run()
