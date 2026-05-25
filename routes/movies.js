import mongojs from 'mongojs';

const db = mongojs(process.env.MONGODB_URI || 'moviesdb', ['movies']);

module.exports = (app) => {
  app.get('/movies', (req, res) => {
    db.movies.find((err, movies) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ movies });
    });
  });

  app.post('/movies', (req, res) => {
    const newMovie = Object.assign({}, req.body, {
      added_at: new Date(),
      status: req.body.status || 'pending',
      personal_rating: req.body.personal_rating || 0,
    });
    db.movies.insert(newMovie, (err, movie) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ movie });
    });
  });

  app.put('/movies/:id', (req, res) => {
    const updateFields = Object.assign({}, req.body);
    delete updateFields._id;
    db.movies.update(
      { _id: mongojs.ObjectId(req.params.id) },
      { $set: updateFields },
      {},
      (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ response });
      }
    );
  });

  app.delete('/movies/:id', (req, res) => {
    db.movies.remove({ _id: mongojs.ObjectId(req.params.id) }, (err, response) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ response });
    });
  });
};
