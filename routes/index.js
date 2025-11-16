module.exports = app => {
    app.get("/", (req, res) => {
      res.json({
        response: "API is running",
        status: "success",
      });
    });
}