const request = require("supertest");
const app = require("../server");
const { StatusCodes } = require("http-status-codes");

describe("POST /cards", () => {
  test("400 :post card with missing values or sending invalid data send", () => {
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
      .expect(StatusCodes.BAD_REQUEST)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });

  test("200 :post single card when correct data is passed and type is object is Array and returns data structure as get card by its id ", () => {
    const response = [
      {
        title: "card 1 title",
        imageUrl: "/front-cover-landscape.jpg",
        card_id: "card001",
        base_price: 200,
        availableSizes: [
          {
            id: "md",
          },
          {
            id: "lg",
          },
        ],
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
      },
    ];
    return request(app)
      .post("/cards")
      .send({
        title: "card 1 title",
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
      .expect(StatusCodes.OK)
      .then((res) => {
        expect(res.body).toEqual(response);
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});

describe("GET /cards", () => {
  test("200 :returns all cards from json and returns array of all card with title, imageUrl and card_id as required ", () => {
    const cards = [
      {
        title: "card 1 title",
        imageUrl: "/front-cover-landscape.jpg",
        card_id: "card001",
      },
      {
        title: "card 2 title",
        imageUrl: "/front-cover-landscape.jpg",
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
      .expect(StatusCodes.OK)
      .then((res) => {
        expect(res.body).toEqual(cards);
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  test("200 :returns card with array of objects verifying types of each object value", () => {
    const expectedCards = [
      {
        title: "card 1 title",
        imageUrl: "/front-cover-landscape.jpg",
        card_id: "card001",
      },
      {
        title: "card 2 title",
        imageUrl: "/front-cover-landscape.jpg",
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
      .expect(StatusCodes.OK)
      .then((res) => {
        const cards = [...res.body];
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

  test("404 :respond with error message when route does not exist or matches the endpoint", () => {
    return request(app)
      .get("/cardZ-invalid")
      .expect(StatusCodes.NOT_FOUND)
      .then(({ body }) => {
        expect(body.message).toBe("route does not exist");
      });
  });
  test("202 :respond with error message when passed corrent endpoint but cards does not exist in json/database or deleted using DELETE endpoint ", () => {
    return request(app)
      .get("/cards")
      .expect(StatusCodes.ACCEPTED)
      .then(({ body }) => {
        expect(body.message).toBe("No cards found !!!");
      });
  });
});

describe("GET /cards/:Id", () => {
  test("200 :return single card item in array when correct id is passed", () => {
    const singleCard = [
      {
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
      },
    ];
    return request(app)
      .get("/cards/card001")
      .expect(StatusCodes.OK)
      .then((res) => {
        expect(res.body).toEqual(singleCard);
        expect(Array.isArray(res.body)).toBe(true);
        const cards = [...res.body];
        cards.forEach((card) => {
          expect(typeof card.title).toBe("string");
          expect(typeof card.imageUrl).toBe("string");
          expect(typeof card.card_id).toBe("string");
          expect(typeof card.base_price).toBe("number");
          expect(Array.isArray(card.availableSizes)).toBe(true);
          expect(Array.isArray(card.pages)).toBe(true);
        });
      });
  });

  test("200 : returns matching card title", () => {
    return request(app)
      .get("/cards/card001")
      .expect(StatusCodes.OK)
      .then((res) => {
        const card = res.body[0];
        expect(card).toEqual(
          expect.objectContaining({
            title: "card 1 title",
          })
        );
      });
  });
  test("200 : returns exact property count in a card object", () => {
    return request(app)
      .get("/cards/card001")
      .expect(StatusCodes.OK)
      .then((res) => {
        const cardPropsCount = Object.keys(res.body[0]).length;
        expect(cardPropsCount).toBe(6);
      });
  });
  test("400 : returns error message if passed invalid card id / id does not starts with `card` ", () => {
    return request(app)
      .get("/cards/123")
      .expect(StatusCodes.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.message).toEqual("invalid id");
      });
  });
  test("404 : returns error message gived id is not found within card data ", () => {
    return request(app)
      .get("/cards/card006")
      .expect(StatusCodes.NOT_FOUND)
      .then(({ body }) => {
        expect(body.message).toEqual("card id not found !!");
      });
  });
});

describe.only("DELETE card", () => {
  test("404 : Passing a valid id which is already deleted or not present", () => {
    return request(app)
      .delete("/cards/card001")
      .expect(StatusCodes.NOT_FOUND)
      .then(({ body }) => {
        expect(body.message).toEqual(
          "This id card is already deleted or id not found"
        );
      });
  });
  test("400 : Passing an id which is not valid/does not start with card", () => {
    return request(app)
      .delete("/cards/car1")
      .expect(StatusCodes.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.message).toEqual("invalid id");
      });
  });
  test("200 : Passing an id which is valid and is deleted successfully", () => {
    return request(app)
      .delete("/cards/card004")
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.message).toEqual("deleted");
      });
  });
});
