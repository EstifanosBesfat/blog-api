const request = require("supertest");
const app = require("../src/app");
const db = require("../src/config/db");
require("dotenv").config({ path: ".env.test" });

let userToken;
let otherUserToken;
let postId;
let commentId;

// SETUP: Create Tables, Users, and a Post
beforeAll(async () => {
  // 1. Ensure Tables Exist (Critical for Test DB)
  await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

  await db.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

  await db.query(`
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

  // 2. Clean DB (Order matters due to foreign keys)
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM posts");
  await db.query("DELETE FROM users");

  // 3. Create User A (The Author)
  await request(app).post("/api/auth/register").send({
    username: "UserA",
    email: "usera@example.com",
    password: "password123",
  });
  const loginA = await request(app).post("/api/auth/login").send({
    email: "usera@example.com",
    password: "password123",
  });
  userToken = loginA.body.token;

  // 4. Create User B (The Hacker)
  await request(app).post("/api/auth/register").send({
    username: "UserB",
    email: "userb@example.com",
    password: "password123",
  });
  const loginB = await request(app).post("/api/auth/login").send({
    email: "userb@example.com",
    password: "password123",
  });
  otherUserToken = loginB.body.token;

  // 5. User A Creates a Post
  const postRes = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${userToken}`)
    .send({ title: "Discussion Post", content: "Let us talk." });

  postId = postRes.body.post.id;
});

afterAll(async () => {
  await db.end();
});

describe("Comments API", () => {
  // TEST 1: User A adds a comment
  it("should allow a logged-in user to comment", async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "My first comment!" });

    expect(res.statusCode).toEqual(201);
    expect(res.body.comment).toHaveProperty("content", "My first comment!");
    commentId = res.body.comment.id; // Save ID for delete tests
  });

  // TEST 2: Read comments
  it("should fetch comments for a post", async () => {
    const res = await request(app).get(`/api/posts/${postId}/comments`);
    expect(res.statusCode).toEqual(200);
    // Depending on your controller, check if it returns an array or object
    if (Array.isArray(res.body)) {
      expect(res.body.length).toBeGreaterThan(0);
    } else {
      expect(res.body.comments.length).toBeGreaterThan(0);
    }
  });

  // TEST 3: User B tries to delete User A's comment (Should Fail)
  it("should prevent deleting someone else's comment", async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${otherUserToken}`); // Using User B's token

    // We expect an error code (403 Forbidden or 400 Bad Request)
    expect(res.statusCode).not.toEqual(200);
    expect(res.statusCode).not.toEqual(201);
  });

  // TEST 4: User A deletes their own comment (Should Pass)
  it("should allow owner to delete their comment", async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`); // Using User A's token

    expect(res.statusCode).toEqual(200);
  });
  it("should not allow empty comments", async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});
