import mongojs from 'mongojs';
import { verifyToken } from '../libs/firebaseAdmin';

const db = mongojs(process.env.MONGODB_URI || 'moviesdb', ['users']);

module.exports = (app) => {
  app.get('/users/me', verifyToken, (req, res) => {
    const { uid, userEmail } = req;

    db.users.findOne({ uid }, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!user) {
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(function(e) { return e.trim(); });
        const role = adminEmails.includes(userEmail) ? 'admin' : 'viewer';
        const newUser = { uid, email: userEmail, role: role, created_at: new Date() };

        db.users.insert(newUser, (err2, created) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json(created);
        });
      } else {
        res.json(user);
      }
    });
  });

  app.get('/users', verifyToken, (req, res) => {
    db.users.findOne({ uid: req.uid }, (err, requester) => {
      if (err || !requester || requester.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      db.users.find((err2, users) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ users });
      });
    });
  });
};
