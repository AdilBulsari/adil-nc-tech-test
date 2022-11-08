const fs = require("fs/promises");

exports.fetchCards = () => {
  const result = [];
  return fs.readFile("./src/data/cards.json", "utf-8").then((data) => {
    const cards = JSON.parse(data);

    if (cards.length === 0) {
      return Promise.reject({
        message: "No cards found !!!",
        status: 404,
      });
    } else {
      return fs.readFile("./src/data/templates.json", "utf-8").then((data) => {
        const templates = JSON.parse(data);
        for (let i in cards) {
          for (let j in templates) {
            if (cards[i]["pages"][0]["templateId"] === templates[j]["id"]) {
              result.push({
                title: cards[i]["title"],
                imageUrl: templates[j]["imageUrl"],
                card_id: cards[i]["id"],
              });
            }
          }
        }
        return result;
      });
    }
  });
};

exports.fetchCardById = (cardId) => {
  if (cardId.startsWith("card")) {
    let result = [];
    return fs.readFile("./src/data/cards.json", "utf-8").then((data) => {
      const cards = JSON.parse(data);

      const cardFound = cards.filter((card) => card.id === cardId);
      if (cardFound.length === 0) {
        return Promise.reject({
          message: "card id not found !!",
          status: 404,
        });
      } else {
        return fs
          .readFile("./src/data/templates.json", "utf-8")
          .then((data) => {
            const templates = JSON.parse(data);

            let availableSizes = [];

            for (let j in templates) {
              if (
                cardFound[0]["pages"][0]["templateId"] === templates[j]["id"]
              ) {
                cardFound[0]["sizes"].forEach((size, i) => {
                  availableSizes.push({ id: size });
                }),
                  result.push({
                    title: cardFound[0]["title"],
                    imageUrl: templates[j]["imageUrl"],
                    card_id: cardFound[0]["id"],
                    base_price: cardFound[0]["basePrice"],
                    availableSizes: availableSizes,
                    pages: cardFound[0]["pages"],
                  });
              }
            }

            return result;
          });
      }
    });
  } else {
    return Promise.reject({
      message: "invalid id",
      status: 400,
    });
  }
};

exports.addCard = (cardToPost) => {
  const cardBody = Object.keys(cardToPost);

  if (
    cardBody.length < 4 ||
    typeof cardToPost["basePrice"] !== "number" ||
    typeof cardToPost["pages"] !== "object" ||
    typeof cardToPost["title"] !== "string"
  ) {
    return Promise.reject({
      message: "Bad Request",
      status: 400,
    });
  }

  return fs
    .readFile("./src/data/cards.json", { encoding: "utf-8" })
    .then((data) => {
      const cards = JSON.parse(data);
      if (cards.length === 0) {
        cards.push({ id: "card001", ...cardToPost });
      } else {
        cards.push({ id: `card00${cards.length + 1}`, ...cardToPost });
      }

      const newData = JSON.stringify(cards);

      return fs.writeFile("./src/data/cards.json", newData).then(() => {
        const getCardById = this.fetchCardById(
          cards[cards.length - 1]["id"]
        ).then((data) => {
          return data;
        });

        return getCardById;
      });
    });
};

exports.deleteCard = (cardId) => {
  if (cardId.startsWith("card")) {
    return fs.readFile("./src/data/cards.json", "utf-8").then((data) => {
      const cards = JSON.parse(data);

      const isDeleted = cards.find((card) => card["id"] === cardId);
      if (!isDeleted) {
        return Promise.reject({
          message: "This id card is already deleted or id not found",
          status: 404,
        });
      } else {
        const filteredData = cards.filter((card) => card["id"] !== cardId);
        return fs
          .writeFile("./src/data/cards.json", JSON.stringify(filteredData))
          .then(() => {
            return {
              message: "deleted",
            };
          });
      }
    });
  } else {
    return Promise.reject({
      message: "invalid id",
      status: 400,
    });
  }
};
