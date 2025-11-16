import bodyParser from "body-parser";
module.exports = app => {
app.set("json spaces", 4); // Set JSON response formatting for better readability
app.set("port", process.env.PORT || 3000);

// CORS middleware to allow frontend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Middleware to parse URL-encoded request bodies
}

