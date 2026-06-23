const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conexión exitosa a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión:", err));

// Esquema NoSQL de Mongoose
const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  existencia: { type: Number, required: true }
});
const Producto = mongoose.model('Producto', ProductoSchema);

// Rutas API
// Leer productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al traer productos" });
  }
});

// Crear producto
app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.json({ mensaje: "Producto registrado ✅", nuevoProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al guardar producto" });
  }
});

// Eliminar producto
app.delete('/productos/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});

// Editar producto
app.put('/productos/:id', async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ mensaje: "Producto actualizado ✏️✅", actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
