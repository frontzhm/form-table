module.exports = {
  devServer: {
    before(app) {
      app.get("/api/list", (req, res) => res.json({ state: 1, data: "ok" }));
    }
  }
};
