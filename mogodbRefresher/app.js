const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoPractice = require('./mongo');
const mongoPractice2 = require('./mongoose');

app.use(bodyParser.json());

app.get('/products', mongoPractice2.getProducts);
app.post('/products', mongoPractice2.createProduct);
app.get('/', (req, res, next) => {
  res.send('<h1>hello world</h1>');
});

app.listen(5000);
