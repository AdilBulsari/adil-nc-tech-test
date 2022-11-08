const cors = require("cors");
const express = require("express");
const routes = require("./routes/routes");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(cors());

// routes endpoints
app.use(routes);
// route not found middleware
app.use("*", notFoundMiddleware);
// all err handling middlewares
app.use(errorHandlerMiddleware);

module.exports = app;
