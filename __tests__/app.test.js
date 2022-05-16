const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("API: /api/categories", () => {
  describe("GET: /api/categories", () => {
    test("200: responds with array of categories objects containing the properties of, describe and slug  ", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toHaveLength(4);
          expect(categories).toBeInstanceOf(Array);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("errors: /api/categories", () => {
    test("404: responds with error message page not found", () => {
      return request(app)
        .get("/api/invalid_categories")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid endpoint");
        });
    });
  });
});

describe("API: /api/reviews", () => {
  describe("GET: /api/reviews/:review_id", () => {
    test("200: responds with a review object containing the keys: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at,", () => {
      const review_id = 1;
      const time = new Date(1610964020514).toISOString();

      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Object);
          expect(reviews).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: "Agricola",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Farmyard fun!",
              category: "euro game",
              created_at: time,
              votes: 1,
            })
          );
        });
    });
  });
});
