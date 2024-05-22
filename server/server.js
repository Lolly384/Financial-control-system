const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const db = require('./db');
const DB = new db();
const path = require('path');
let server = require('http').Server(app);

const publicPath = path.join(__dirname, '../public/');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/',express.static(path.join(__dirname, '../dist/spa')));
app.use('/api', router);

server.listen(3001, async () => {
  DB.connect();
  console.log('We are live on ' + 3001);
})