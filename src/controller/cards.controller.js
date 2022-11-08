const {
  fetchCards,
  deleteCard,
  fetchCardById,
  addCard,
} = require("../model/cards.model");
const { StatusCodes } = require("http-status-codes");

exports.getCards = (req, res, next) => {
  fetchCards()
    .then((cards) => {
      res.status(StatusCodes.OK).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCardById = (req, res, next) => {
  const { cardId } = req.params;

  fetchCardById(cardId)
    .then((card) => {
      res.status(StatusCodes.OK).send(card);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCard = (req, res, next) => {
  const cardToPost = req.body;
  addCard(cardToPost)
    .then((postCard) => {
      res.status(StatusCodes.OK).send(postCard);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  deleteCard(cardId)
    .then(({ message }) => {
      res.status(StatusCodes.OK).send({ message });
    })
    .catch((err) => {
      next(err);
    });
};
