import { response } from "express";
import mongojs from "mongojs";

const db = mongojs("moviesdb", ["movies"]);

module.exports = (app) => {
  app.get("/movies", (req, res) => {
    db.movies.find((err, movies) => {
      res.json({
        movies,
      });
    });
  });

  app.post("/movies", (req, res) => {
    let newMovie = req.body;

    db.movies.insert(newMovie, (err, movie) => {
      res.json({
        movie /*: [
          { title: "Inception", year: 2010 },
          { title: "The Matrix", year: 1999 },
          { title: "Interstellar", year: 2014 },
          { title: "The Shawshank Redemption", year: 1994 },
          { title: "Pulp Fiction", year: 1994 },
          { title: "The Godfather", year: 1972 },
          { title: "The Dark Knight", year: 2008 },
          { title: "Forrest Gump", year: 1994 },
          { title: "Fight Club", year: 1999 },
          {
            title: "The Lord of the Rings: The Return of the King",
            year: 2003,
          },
          { title: "Gladiator", year: 2000 },
          { title: "The Silence of the Lambs", year: 1991 },
          { title: "Schindler's List", year: 1993 },
          { title: "The Departed", year: 2006 },
          { title: "Saving Private Ryan", year: 1998 },
          { title: "The Usual Suspects", year: 1995 },
          { title: "Se7en", year: 1995 },
          { title: "Braveheart", year: 1995 },
          { title: "Titanic", year: 1997 },
          { title: "Jurassic Park", year: 1993 },
          { title: "Avatar", year: 2009 },
          { title: "The Avengers", year: 2012 },
          { title: "Black Panther", year: 2018 },
        ],*/
      });
    });
  });

  app.put("/movies/:id", (req, res) => {
    let updatedMovie = req.body;
    db.movies.update(
        {_id: mongojs.ObjectId(req.params.id)},
        {$set: updatedMovie},
        {},
        (err, response) => {
          res.json({
            response
          });
        }
    )
  });

  app.delete('/movies/:id', (req, res) => {
    db.movies.remove({_id: mongojs.ObjectId(req.params.id)}, (err, response) => {
      res.json({
        response
      });
    });
  });
};
