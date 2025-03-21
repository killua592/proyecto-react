const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

// Middleware
app.use(express.json()); // 📌 Manejar JSON antes de cualquier otra cosa
app.use(cors());

// 📌 CONEXIÓN A BASE DE DATOS
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ejercicioreact"
});

// Verificar conexión
db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar con la base de datos:", err);
        process.exit(1); // Finaliza la ejecución si no se conecta
    }
    console.log("✅ Conectado a la base de datos.");
});

// 📌 LEER INDICADORES
app.get("/", (req, res) => {
    const sql = "SELECT * FROM indicadorfinanciero";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("❌ Error al obtener datos:", err);
            return res.status(500).json({ error: "Error al obtener los indicadores." });
        }
        res.json(data);
    });
});

app.get("/indicador/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM indicadorfinanciero WHERE id = ?";

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("❌ Error al obtener el indicador:", err);
            return res.status(500).json({ error: "Error en el servidor." });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "❌ Indicador no encontrado." });
        }

        res.json(data[0]); // Enviar solo el objeto, no un array
    });
});


// 📌 CREAR INDICADOR
app.post('/create', (req, res) => {
    const sql = `INSERT INTO indicadorfinanciero 
        (nombreIndicador, codigoIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador) 
        VALUES (?, ?, ?, ?, ?)`;

    const { nombreIndicador, codigoIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador } = req.body;

    // Validaciones
    if (!nombreIndicador || !codigoIndicador || !unidadMedidaIndicador || valorIndicador === undefined || valorIndicador === "" || !fechaIndicador) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    if (isNaN(valorIndicador) || Number(valorIndicador) < 0) {
        return res.status(400).json({ error: "El valor del indicador debe ser un número positivo." });
    }

    db.query(sql, [nombreIndicador, codigoIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar el indicador:", err);
            return res.status(500).json({ error: "Error en el servidor al insertar el indicador." });
        }
        res.status(201).json({ message: "✅ Indicador agregado correctamente." });
    });
});

// 📌 ACTUALIZAR INDICADOR
app.put('/update/:id', (req, res) => {
    const sql = `UPDATE indicadorfinanciero 
                 SET nombreIndicador = ?, codigoIndicador = ?, unidadMedidaIndicador = ?, valorIndicador = ?, fechaIndicador = ? 
                 WHERE id = ?`;

    const { nombreIndicador, codigoIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador } = req.body;
    const id = req.params.id;

    // Validaciones
    if (!nombreIndicador || !codigoIndicador || !unidadMedidaIndicador || valorIndicador === undefined || valorIndicador === "" || !fechaIndicador) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    if (isNaN(valorIndicador) || Number(valorIndicador) < 0) {
        return res.status(400).json({ error: "El valor del indicador debe ser un número positivo." });
    }

    db.query(sql, [nombreIndicador, codigoIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador, id], (err, result) => {
        if (err) {
            console.error("❌ Error al modificar el indicador:", err);
            return res.status(500).json({ error: "Error en el servidor al modificar el indicador." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Indicador no encontrado." });
        }

        res.status(200).json({ message: "✅ Indicador modificado correctamente." });
    });
});

// 📌 ELIMINAR INDICADOR
app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM indicadorfinanciero WHERE id = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar el indicador:", err);
            return res.status(500).json({ error: "Error en el servidor al eliminar el indicador." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "❌ Indicador no encontrado." });
        }

        res.status(200).json({ message: "✅ Indicador eliminado correctamente." });
    });
});

// 📌 INICIAR SERVIDOR
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
