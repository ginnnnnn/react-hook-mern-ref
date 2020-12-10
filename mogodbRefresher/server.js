const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/products/:productName', (req, res, next) => {
  const productName = req.params;
  // http:localhost:5000/products/apple ,params will be apple
  // do whast you want here
  res.json({ msg: 'ok' });
  //this will send back JSON
});

app.post('/products', (req, res, next) => {
  const body = req.body;
  //  what it attached to post request
  // ex. {
  //   name:"orange",
  //   price:30
  //  }
  const { name, price } = body;
  //store in db with this info

  res.json({ msg: 'success' });
});
//same with other method ,the first argument is url, and the second argument is the callback
app.put('url', callbackFunction);
app.delete('url', callbackFunction);
app.patch('url', callbackFunction);

app.listen(5000);
