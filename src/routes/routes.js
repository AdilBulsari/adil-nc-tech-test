const {
  getCards,
  getCardById,
  postCard,
  deleteCardById,
} = require("../controller/cards.controller");

const routes = require("express").Router();

routes.route("/cards").post(postCard).get(getCards);

routes.route("/cards/:cardId").get(getCardById).delete(deleteCardById);

module.exports = routes;
