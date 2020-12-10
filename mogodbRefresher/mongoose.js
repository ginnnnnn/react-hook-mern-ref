const mongoose = require('mongoose');
const Product = require('./models/product');
mongoose
  .connect(
    'mongodb+srv://aginlo:zhaojing123@cluster0.rxsef.gcp.mongodb.net/products_test?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('database connected');
  })
  .catch(() => {
    console.log('database connection failed');
  });

const createProduct = async (req, res, next) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });
  const result = await newProduct.save();
  res.json(result);
};

const getProducts = async (req, res, next) => {
  //mongoose find default return array if want to use cursor use find().cursor
  const products = await Product.find().exec();
  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
