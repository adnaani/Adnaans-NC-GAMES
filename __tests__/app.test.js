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
  describe("GET - errors: /api/categories", () => {
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
  describe("GET - errors: /api/reviews/:review_id", () => {
    test("400: responds with an error message when passed an endpoint with an incorrect data type", () => {
      const review_id = "invalid_type";
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });
    test("404: responds with an error message when passed an endpoint with correct data type but does not exist", () => {
      const review_id = 999;
      return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`review with id: ${review_id} does not exist`);
        });
    });
  });

  describe("PATCH: /api/reviews/:review_id", () => {
    test("201: responds with a votes incrementing by inc_vote", () => {
      const review_id = 1;

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send({ inc_votes: 5 })
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review.votes).toBe(6);
          expect(review.review_id).toBe(1);
        });
    });
    test("201: responds with a votes decrementing by inc_vote", () => {
      const review_id = 1;
      const inc_vote = { inc_votes: -100 };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(inc_vote)
        .expect(201)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review.votes).toBe(-99);
          expect(review.review_id).toBe(1);
        });
    });
  });

  describe("PATCH - errors: /api/reviews/:review_id", () => {
    test("400: responds with an error message when passed an endpoint with an incorrect data type", () => {
      const review_id = 1;
      const inc_vote = { inc_votes: "NaN" };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(400)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });
    test("400: responds with an error message when passed an endpoint where review_id is invalid data type", () => {
      const review_id = "invalid";
      const inc_vote = { inc_votes: "3" };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(400)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });

    test("400: responds with an error message when passed an endpoint where inc_vote key missing", () => {
      const review_id = 1;
      const inc_vote = { invalid_vote: 5 };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(400)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });

    test("404: responds with an error message when passed an endpoint with correct data type but does not exist", () => {
      const review_id = 999;
      const inc_vote = { inc_votes: "3" };

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .expect(404)
        .send(inc_vote)
        .then(({ body: { message } }) => {
          expect(message).toBe(`review with id: ${review_id} does not exist`);
        });
    });
  });
});
