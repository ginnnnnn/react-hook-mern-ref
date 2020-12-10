const MongoClient = require('mongodb').MongoClient;
const url =
  'mongodb+srv://aginlo:zhaojing123@cluster0.rxsef.gcp.mongodb.net/products_test?retryWrites=true&w=majority';

const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price,
  };
  const client = new MongoClient(url);
  try {
    await client.connect();
    //connect to db products_test //also can use client.db('products_test')
    const db = client.db();
    const result = db.collection('products').insertOne(newProduct);
  } catch (err) {
    return res.json({ message: 'saving data error' });
  }
  client.close();
  res.json(newProduct);
};

const getProducts = async (req, res, next) => {
  const client = new MongoClient(url);

  let products;
  try {
    await client.connect();
    const db = client.db();
    products = await db.collection('products').find().toArray();
  } catch (err) {
    return res.json({ message: 'there is a problem for fetching data' });
  }
  client.close();
  res.json({ products });
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
