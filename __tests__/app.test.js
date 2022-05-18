const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
require("jest-sorted");

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
  describe("GET: /api/reviews", () => {
    test("200: responds with array of reviews objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("200: responds with array of reviews objects sorted in ascending order by the date", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at");
        });
    });
  });

  describe("QUERIES: /api/reviews", () => {
    test("200: responds with array of reviews object sorted in ascending order, date defautlt", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at");
        });
    });
  });

  describe("PARAM: /api/reviews/:review_id", () => {
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
    describe("GET - Comment Count: /api/reviews/:review_id", () => {
      test("200: responds with a review object containing an additional key of comment count with the value of 0 when the comment does not exist", () => {
        const review_id = 9;
        const time = new Date(1610964101251).toISOString();

        return request(app)
          .get(`/api/reviews/${review_id}`)
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeInstanceOf(Object);
            expect(reviews).toEqual(
              expect.objectContaining({
                review_id: 9,
                title: "A truly Quacking Game; Quacks of Quedlinburg",
                category: "social deduction",
                designer: "Wolfgang Warsch",
                owner: "mallionaire",
                review_body:
                  "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
                review_img_url:
                  "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
                created_at: time,
                votes: 10,
                comment_count: "0",
              })
            );
          });
      });
      test("200: responds with a review object containing an additional key of comment count when the comment is more than 0", () => {
        const review_id = 2;
        const time = new Date(1610964101251).toISOString();

        return request(app)
          .get(`/api/reviews/${review_id}`)
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeInstanceOf(Object);
            expect(reviews).toEqual(
              expect.objectContaining({
                review_id: 2,
                title: "Jenga",
                category: "dexterity",
                designer: "Leslie Scott",
                owner: "philippaclaire9",
                review_body: "Fiddly fun for all the family",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                created_at: time,
                votes: 5,
                comment_count: "3",
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
      test("200: responds with a votes incrementing by inc_vote", () => {
        const review_id = 1;

        return request(app)
          .patch(`/api/reviews/${review_id}`)
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body: { review } }) => {
            expect(review.votes).toBe(6);
            expect(review.review_id).toBe(1);
          });
      });

      test("200: responds with a votes decrementing by inc_vote", () => {
        const review_id = 1;
        const inc_vote = { inc_votes: -100 };

        return request(app)
          .patch(`/api/reviews/${review_id}`)
          .send(inc_vote)
          .expect(200)
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
            expect(message).toBe("input is missing");
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

  describe("PARAM: /api/reviews/:review_id/comment", () => {
    describe("GET: /api/reviews/:review_id/comment", () => {
      test("200: responds with a comment object", () => {
        const review_id = 3;

        return request(app)
          .get(`/api/reviews/${review_id}/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(3);
            expect(comments).toBeInstanceOf(Array);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  votes: expect.any(Number),
                  author: expect.any(String),
                  review_id: expect.any(Number),
                  created_at: expect.any(String),
                })
              );
            });
          });
      });
      test("200: responds with a empty comment array when review exists but no comment posted yet", () => {
        const review_id = 1;

        return request(app)
          .get(`/api/reviews/${review_id}/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Object);
            expect(comments).toEqual([]);
          });
      });
    });
    describe("GET - errors: /api/reviews/:review_id/comments", () => {
      test("400: responds with a error message when wrong data is passed in the review_id", () => {
        const review_id = "invalid_id";

        return request(app)
          .get(`/api/reviews/${review_id}/comments`)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("input is not valid");
          });
      });

      test("404 responds with a error message when the input is correct however the number does not exist in the data base", () => {
        const review_id = 999;

        return request(app)
          .get(`/api/${review_id}/comments`)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("invalid endpoint");
          });
      });
    });

    describe("POST: /api/reviews/:review_id/comments", () => {
      test("201: responds with new comment", () => {
        const review_id = 1;
        const newComment = {
          body: "This is a cool game",
          author: "mallionaire",
        };

        return request(app)
          .post(`/api/reviews/${review_id}/comments`)
          .send(newComment)
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(newComment);
          });
      });
    });
    describe("POST - errors: /api/reviews/:review_id/comments", () => {
      test("400: responds with error message when body does not contain both mandatory keys ", () => {
        const review_id = 1;
        const newComment = {
          notAuthor: "invalid_author",
          notBody: "invalid_body",
        };
        return request(app)
          .post(`/api/reviews/${review_id}/comments`)
          .send(newComment)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("input is missing");
          });
      });

      test("404: responds with error message when review_id in path does not exist", () => {
        const review_id = 999;
        const newComment = {
          body: "This is a cool game",
          author: "mallionaire",
        };
        return request(app)
          .post(`/api/reviews/${review_id}/comments`)
          .send(newComment)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("input does not exist");
          });
      });

      test("404: responds with error message when user does not exist", () => {
        const review_id = 2;
        const newComment = {
          body: "This is a cool game",
          author: "dont_exist",
        };
        return request(app)
          .post(`/api/reviews/${review_id}/comments`)
          .send(newComment)
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("input does not exist");
          });
      });
    });
  });
});

describe("API: /api/users", () => {
  describe("GET: /api/users", () => {
    test("200: responds with an array of user objects containing the properties of username, name and avatar_url", () => {
      return request(app)
        .get("/api/users/")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(users).toBeInstanceOf(Array);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET - errors: /api/users", () => {
    test("404: responds with error message", () => {
      return request(app)
        .get("/api/invalid_users")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid endpoint");
        });
    });
  });
});
