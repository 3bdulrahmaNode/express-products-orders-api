const express = require("express");
const app = express();
const port = 3000;

let products = [
  { id: 1, name: "Laptop", price: 15000, stock: 5 },
  { id: 2, name: "Phone", price: 8000, stock: 10 },
];
let orders = [{ id: 1, productId: 1, quantity: 2, totalPrice: 3000 }];
app.use(express.json());

//GET PRODUCTS
app.get("/products", (req, res, next) => {
  res.status(200).json({ message: "Done", products });
});

//GET PRODUCTS BY ID
app.get("/products/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const product = products.find((u) => u.id === id);
  if (!product) {
    return res.status(404).json({ message: "product is not available" });
  }
  res.status(200).json(product);
});

//POST PRODUCTS
app.post("/products", (req, res, next) => {
  const { name, price, stock } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "name and price are required" });
  }
  const existProduct = products.find((p) => p.name === name);
  if (existProduct) {
    return res.status(400).json({ message: "Product already exists" });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock: stock || 0,
  };
  products.push(newProduct);
  res.status(201).json({ message: "done", newProduct });
});

//DELETE PRODUCTS
app.delete("/products/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const index = products.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  products.splice(index, 1);
  res.status(200).json({ message: "Product delete successfully" });
});

//GET ORDERS
app.get("/orders", (req, res, next) => {
  res.status(200).json({ message: "Done", orders });
});

//GET ORDERS BY ID
app.get("/orders/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const order = orders.find((u) => u.id === id);
  if (!order) {
    return res.status(404).json({ message: "order is not available" });
  }
  res.status(200).json(order);
});

//POST Orders
app.post("/orders", (req, res, next) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "productId and quantity are required" });
  }
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  product.stock -= quantity;

  const totalPrice = product.price * quantity;

  const newOrder = {
    id: orders.length + 1,
    productId,
    quantity,
    totalPrice,
  };
  orders.push(newOrder);
  res.status(201).json({ message: "done", newOrder });
});

//DELETE PRODUCTS
app.delete("/orders/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const index = orders.findIndex((d) => d.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "order not found" });
  }
  orders.splice(index, 1);
  res.status(200).json({ message: "order delete successfully" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`server is run on port ${port}`);
});
