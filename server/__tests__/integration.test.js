import request from "supertest";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

// Resolve .env.test path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env.test") });

// Ensure DB_HOST defaults to localhost if not set
if (!process.env.DB_HOST) process.env.DB_HOST = "localhost";

// Import your Express app (not starting a new server)
import express from "express";
import cors from "cors";
import router from "../routes/router.js";

// Create a test instance of the app
const app = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use("/", router);

// Database connection helper
let connection;

beforeAll(async () => {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE, 
    port: process.env.DB_PORT || 3306,
  });

  // Ensure test table exists
  await connection.query(`
    CREATE TABLE IF NOT EXISTS Patterns (
      pattern_id INT AUTO_INCREMENT PRIMARY KEY,
      pattern_name VARCHAR(255),
      description TEXT,
      author VARCHAR(255),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Clean slate
  await connection.query("DELETE FROM Patterns;");
});

afterAll(async () => {
  await connection.query("DELETE FROM Patterns;");
  await connection.end();
});

describe("🔗 Integration Tests for Pattern API", () => {
  test("POST /patterns → creates a new pattern", async () => {
    const newPattern = {
      pattern_name: "Test Pattern",
      description: "Integration test pattern",
      author: "Jest",
    };

    const res = await request(app)
      .post("/patterns")
      .send(newPattern)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toHaveProperty("pattern_ID");
  });

  test("GET /patterns → retrieves all patterns", async () => {
    const res = await request(app)
      .get("/patterns")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /patterns/:id → retrieves a specific pattern", async () => {
    // First insert a known pattern
    const [insert] = await connection.query(
      "INSERT INTO Patterns (pattern_name, description, author) VALUES (?, ?, ?)",
      ["GetOne", "Test single fetch", "Tester"]
    );

    const id = insert.insertId;

    const res = await request(app)
      .get(`/patterns/${id}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toHaveProperty("pattern_id", id);
    expect(res.body.pattern_name).toBe("GetOne");
  });

  test("DELETE /patterns/:id → deletes a pattern", async () => {
    const [insert] = await connection.query(
      "INSERT INTO Patterns (pattern_name, description, author) VALUES (?, ?, ?)",
      ["ToDelete", "Will be removed", "Tester"]
    );

    const id = insert.insertId;

    const res = await request(app)
      .delete(`/patterns/${id}`)
      .expect(200);

    expect(res.text).toMatch(/deleted/i);

    const [rows] = await connection.query(
      "SELECT * FROM Patterns WHERE pattern_id = ?",
      [id]
    );
    expect(rows.length).toBe(0);
  });
});
