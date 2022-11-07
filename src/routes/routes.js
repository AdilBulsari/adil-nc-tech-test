const {
  getCards,
  getCardById,
  postCard,
} = require("../controller/cards.controller");

const routes = require("express").Router();

routes.get("/cards", getCards);

routes.get("/cards/:cardId", getCardById);

routes.post("/cards", postCard);
module.exports = routes;
