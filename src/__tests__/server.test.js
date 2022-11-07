const request = require("supertest");
const app = require("../server");

describe("GET /cards", () => {
  test("200 :returns all cards with exact length", () => {
    const cards = [
      {
        title: "card 1 title",
        imageUrl: "/front-cover-portrait-1.jpg",
        card_id: "card001",
      },
      {
        title: "card 2 title",
        imageUrl: "/front-cover-portrait-2.jpg",
        card_id: "card002",
      },
      {
        title: "card 3 title",
        imageUrl: "/front-cover-landscape.jpg",
        card_id: "card003",
      },
    ];
    return request(app)
      .get("/cards")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ cards });

        expect(res.body.cards.length).toBe(3);
      });
  });

  test("200 :returns card with array of objects", () => {
    const expectedCards = [
      {
        title: "card 1 title",
        imageUrl: "/front-cover-portrait-1.jpg",
        card_id: "card001",
      },
      {
        title: "card 2 title",
        imageUrl: "/front-cover-portrait-2.jpg",
        card_id: "card002",
      },
      {
        title: "card 3 title",
        imageUrl: "/front-cover-landscape.jpg",
        card_id: "card003",
      },
    ];

    return request(app)
      .get("/cards")
      .expect(200)
      .then(({ body: { cards } }) => {
        if (cards.length === 0) {
          return;
        } else {
          cards.forEach((card) => {
            expect(typeof card.title).toBe("string");
            expect(typeof card.imageUrl).toBe("string");
            expect(typeof card.card_id).toBe("string");
          });
          expect(cards).toEqual(expectedCards);
        }
      });
  });

  test("404 :respond with error message when route does not exist", () => {
    return request(app)
      .get("/cardz")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("does not exist");
      });
  });
  test.skip("400 :respond with error message when card data does not exist", () => {
    return request(app)
      .get("/cards")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("No cards found !!!");
      });
  });
});

describe("GET /cards/:Id", () => {
  test("200 :return single card when correct id is passed", () => {
    const singleCard = {
      title: "card 1 title",
      imageUrl: "/front-cover-portrait-1.jpg",
      card_id: "card001",
      base_price: 200,
      availableSizes: [
        {
          id: "sm",
        },
        {
          id: "md",
        },
        {
          id: "gt",
        },
      ],
      pages: [
        {
          title: "Front Cover",
          templateId: "template001",
        },
        {
          title: "Inside Left",
          templateId: "template002",
        },
        {
          title: "Inside Right",
          templateId: "template003",
        },
        {
          title: "Back Cover",
          templateId: "template004",
        },
      ],
    };
    return request(app)
      .get("/cards/card001")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ card: singleCard });
      });
  });

  test("200 : returns matching card title", async () => {
    return request(app)
      .get("/cards/card001")
      .expect(200)
      .then(({ body: { card } }) => {
        expect(card).toEqual(
          expect.objectContaining({
            title: "card 1 title",
          })
        );
      });
  });
  test("200 : returns exact property count in a card object", async () => {
    return request(app)
      .get("/cards/card001")
      .expect(200)
      .then(({ body: { card } }) => {
        expect(Object.keys(card).length).toBe(6);
      });
  });
  test("400 : returns error message if passed invalid card id or id does not starts with `card` ", async () => {
    return request(app)
      .get("/cards/123")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("invalid id");
      });
  });
  test("404 : returns error message gived id is not found within card data ", async () => {
    return request(app)
      .get("/cards/card006")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("card id not found !!");
      });
  });
});

describe("POST /cards", () => {
  test("400 :post card with missing values", () => {
    const inValidCardPost = {
      title: "card 3 title",
      // sizes: ["md", "lg"],
      basePrice: "200",
      pages: [
        {
          title: "Front Cover",
          templateId: "template006",
        },
        {
          title: "Inside Top",
          templateId: "template007",
        },
        {
          title: "Inside Bottom",
          templateId: "template007",
        },
        {
          title: "Back Cover",
          templateId: "template008",
        },
      ],
    };

    return request(app)
      .post("/cards")
      .send(inValidCardPost)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });

  const cardToPost =
    test.skip("200 :post single card when correct data is entered", () => {
      return request(app)
        .post("/cards")
        .send({
          title: "card 3 title",
          sizes: ["md", "lg"],
          basePrice: 200,
          pages: [
            {
              title: "Front Cover",
              templateId: "template006",
            },
            {
              title: "Inside Top",
              templateId: "template007",
            },
            {
              title: "Inside Bottom",
              templateId: "template007",
            },
            {
              title: "Back Cover",
              templateId: "template008",
            },
          ],
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(cardToPost);
        });
    });
});
