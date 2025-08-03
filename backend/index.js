// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ message: "¡Hola desde el backend!" });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
