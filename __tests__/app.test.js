process.env.NODE_ENV = "test";
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
// require("jest-sorted");

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
});
