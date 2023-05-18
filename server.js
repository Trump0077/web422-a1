/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Jiaheng Wang______ Student ID: __180562217___ Date: __May 17____
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

app.post("/api/movies", (req, res) => {
    const movieAdded = req.body;
    db.addNewMovie(movieAdded)
    .then((movie) => {
        res.status(201).json(movie);
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    })
})

app.get("/api/movies", (req, res) => {
    const { page, perPage, title } = req.query;
    db.getAllMovies(page, perPage, title)
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    })
})

app.get("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    db.getMovieById(id)
    .then((movie) => {
        res.status(201).json(movie);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
})

app.put('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const updatedMovie = req.body;
    db.updateMovieById(updatedMovie, id)
    .then(() => {
        res.status(201).json({ message: `Movie ${id} has been updated successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.delete("/api/movies/:id", (req, res) => {
    const id = req.params.id;
    db.deleteMovieById(id)
    .then(() => {
        res.status(201).json({ message: `Movie ${id} has been deleted successfully` });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
})

app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});