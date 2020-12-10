const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoPractice = require('./mongo');

app.use(bodyParser.json());

app.get('/products', mongoPractice.getProducts);
app.post('/products', mongoPractice.createProduct);

app.listen(5000);
