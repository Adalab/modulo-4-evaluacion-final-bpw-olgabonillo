const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

require("dotenv").config();


const app = express();

async function getDBConnection() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "biblioteca"
    })
    connection.connect();
    return connection;
}


app.use(cors());
app.use(express.json());

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening in http://localhost:${port}`)
})



app.get("/books", async (req, res) => {
    
    try {
        const connection = await getDBConnection();
        const query = "SELECT * FROM books, authors where books.fkAuthor = authors.idAuthor";
        const [result] = await connection.query(query);

        connection.end();

        res.status(200).json({
            info: { "count": result.length },
            results: result
        })
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
    }
})


app.get("/books/:id", async (req, res) => {
    
    const id = req.params.id;
    console.log("El ID del libro es: ", id);

    try {
        const connection = await getDBConnection();
        const query = "SELECT * FROM books, authors WHERE books.idBooks = ? AND books.fkAuthor = authors.idAuthor";
        const [result] = await connection.query(query, [id]);

        
        if (result.length === 0) {
            res.status(400).json({
                status: "error",
                message: "No existe ningún libro con ese ID"
            })
        } else {
            res.status(200).json({
                status: "success",
                result: result
            })
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
    }

})


app.post("/books", async (req, res) => {
    
    const { title, genre, image, category, year, pages, idAuthor } = req.body;
    if (!title || !genre || !image || !category || !year || !pages || !idAuthor) {
        res.status(400).json({
            status: "error",
            message: "Mandatory fields: title, genre, image, category, year, pages and idAuthor"
        })
    } else {
        const connection = await getDBConnection();
        const query = "INSERT INTO books (title, genre, image, category, year, pages, fkAuthor) VALUES(?, ?, ?, ?, ?, ?, ?)";
        const [result] = await connection.query(query, [
            title, genre, image, category, year, pages, idAuthor
        ])
        res.status(201).json({
            status: true,
            id: result.insertId
        });
    }
})


app.put("/books/:id", async (req, res) => {
    const id = req.params.id;
    const { title, genre, image, category, year, pages, idAuthor } = req.body;
    const connection = await getDBConnection();


    if (title) {
        const query = "UPDATE books SET title = ? WHERE idBooks = ?";
        const [resultTitle] = await connection.query(query, [title, id])
    }
    if (genre) {
        const query = "UPDATE books SET genre = ? WHERE idBooks = ?";
        const [resultGenre] = await connection.query(query, [genre, id])
    }
    if (image) {
        const query = "UPDATE books SET image = ? WHERE idBooks = ?";
        const [resultImage] = await connection.query(query, [image, id])
    }

    if (category) {
        const query = "UPDATE books SET category = ? WHERE idBooks = ?";
        const [resultCategory] = await connection.query(query, [category, id])
    }

    if (year) {
        const query = "UPDATE books SET year = ? WHERE idBooks = ?";
        const [resultYear] = await connection.query(query, [year, id])
    }

    if (pages) {
        const query = "UPDATE books SET pages = ? WHERE idBooks = ?";
        const [resultPages] = await connection.query(query, [pages, id])
    }

    if (idAuthor) {
        const query = "UPDATE books SET idAuthor = ? WHERE idBooks = ?";
        const [resultIdAuthor] = await connection.query(query, [idAuthor, id])
    }

    connection.end();

    res.json({
        status: "success",
        message: "Biblioteca actualizada"
    })
})


app.delete("/books/:id", async (req, res) => {
    const id = req.params.id;

    const connection = await getDBConnection();
    const mySql = "DELETE FROM books WHERE idBooks = ?";
    const [result] = await connection.query(mySql, [id]);

    console.log("el resultado es: ", result);

    connection.end();

    if (result.affectedRows > 0) {
        res.status(200).json({
            status: "success",
            message: "Se ha eliminado el libro correctamente"
        })
    } else {
        res.status(500).json({
            status: "error",
            message: "No se ha podido eliminar el libro"
        })
    }
})

const staticServer = "./src/public-react";
app.use(express.static(staticServer))