// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Permitir peticiones desde el frontend

app.get("/hello", (req, res) => {
  res.json("¡Hola jorge desde el backend!");
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
