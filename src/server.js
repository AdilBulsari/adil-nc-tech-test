const cors = require("cors");
const express = require("express");
const routes = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.use("*", (req, res) => {
  res.status(404).send({
    message: "does not exist",
  });
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({
      message: err.message,
    });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({
    message: "server error",
  });
});

module.exports = app;
