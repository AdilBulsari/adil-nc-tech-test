const { fetchCards, fetchCardById, addCard } = require("../model/cards.model");

exports.getCards = (req, res, next) => {
  fetchCards()
    .then((data) => {
      res.status(200).send({
        cards: data,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCardById = (req, res, next) => {
  const { cardId } = req.params;

  fetchCardById(cardId)
    .then((data) => {
      res.status(200).send({
        card: data[0],
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCard = (req, res, next) => {
  const cardToPost = req.body;

  addCard(cardToPost)
    .then(({ card }) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      next(err);
    });
};
