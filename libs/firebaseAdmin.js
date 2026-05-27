import admin from 'firebase-admin';
import mongojs from 'mongojs';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = mongojs(process.env.MONGODB_URI || 'moviesdb', ['users']);

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireAdmin = (req, res, next) => {
  db.users.findOne({ uid: req.uid }, (err, user) => {
    if (err || !user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Se requieren permisos de administrador' });
    }
    next();
  });
};

export { db as usersDb };
