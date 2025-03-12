const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Define JSON file path
const DATA_FILE = path.join(__dirname, "data.json");

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Helper function to read JSON file
const readData = () => {
  const jsonData = fs.readFileSync(DATA_FILE);
  return JSON.parse(jsonData);
};

// Helper function to write JSON file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 🛒 GET /menu - Fetch all menu items
app.get("/api/menu", (req, res) => {
  const data = readData();
  res.json({ status: "success", data: data.menu });
});

// 🛒 POST /menu - Add a new menu item
app.post("/api/menu", (req, res) => {
  const data = readData();
  const newItem = { id: Date.now(), ...req.body };
  data.menu.push(newItem);
  writeData(data);
  res.status(201).json({ status: "success", data: newItem });
});

// 🛒 DELETE /menu/:id - Remove a menu item
app.delete("/api/menu/:id", (req, res) => {
  const data = readData();
  const menuId = parseInt(req.params.id);
  data.menu = data.menu.filter((item) => item.id !== menuId);
  writeData(data);
  res.json({ status: "success", message: "Menu item deleted" });
});

// 🛍 GET /order/:id - Fetch an order by ID
app.get("/api/order/:id", (req, res) => {
  const data = readData();
  const order = data.orders.find((o) => o.id == req.params.id);
  if (!order)
    return res.status(404).json({ error: `Order #${req.params.id} not found` });
  res.json({ status: "success", data: order });
});

// 🛍 POST /order - Create a new order
app.post("/api/order", (req, res) => {
  const data = readData();
  const newOrder = { id: Date.now(), ...req.body, status: "pending" };
  data.orders.push(newOrder);
  writeData(data);
  res.status(201).json({ status: "success", data: newOrder });
});

// 🛍 PATCH /order/:id - Update an order
app.patch("/api/order/:id", (req, res) => {
  const data = readData();
  const orderIndex = data.orders.findIndex((o) => o.id == req.params.id);
  if (orderIndex === -1)
    return res.status(404).json({ error: "Order not found" });

  data.orders[orderIndex] = { ...data.orders[orderIndex], ...req.body };
  writeData(data);
  res.json({ status: "success", message: "Order updated successfully" });
});

// 🛍 DELETE /order/:id - Delete an order
app.delete("/api/order/:id", (req, res) => {
  const data = readData();
  const orderId = parseInt(req.params.id);
  data.orders = data.orders.filter((order) => order.id !== orderId);
  writeData(data);
  res.json({ status: "success", message: "Order deleted successfully" });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
