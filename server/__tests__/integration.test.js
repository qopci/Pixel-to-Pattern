import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import app from "../server.js";
import sequelize from "../models/db.js"; // import your sequelize instance

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.test
dotenv.config({ path: path.join(__dirname, "../.env.test") });

describe("Integration Tests – Pattern API", () => {
  let createdPatternID;

  beforeAll(async () => {
    // Create table matching your model
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Patterns (
        pattern_ID INT AUTO_INCREMENT PRIMARY KEY,
        pattern_name VARCHAR(255),
        pattern_info JSON,
        author VARCHAR(255),
        description TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  afterEach(async () => {
    await sequelize.query("DELETE FROM Patterns;");
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("POST /patterns → should create a new pattern (201)", async () => {
    const newPattern = {
      pattern_name: "Test Pattern",
      pattern_info: { rows: ["row1", "row2"] },
      author: "Tester",
      description: "Integration test pattern",
    };

    const res = await request(app)
      .post("/patterns")
      .send(newPattern)
      .expect(201);

    // Your controller returns just the numeric pattern_ID
    expect(typeof res.body).toBe("number");
    createdPatternID = res.body;
  });

  it("GET /patterns → should return all patterns (200)", async () => {
    await sequelize.query(`
      INSERT INTO Patterns (pattern_name, pattern_info, author, description)
      VALUES ('Test Pattern', '{"rows":["row1","row2"]}', 'Tester', 'Integration test pattern');
    `);

    const res = await request(app).get("/patterns").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /patterns/:id → should return a specific pattern (200)", async () => {
    const [result] = await sequelize.query(`
      INSERT INTO Patterns (pattern_name, pattern_info, author, description)
      VALUES ('Test Pattern', '{"rows":["row1","row2"]}', 'Tester', 'Integration test pattern');
    `);

    const patternID = result.insertId || 1;

    const res = await request(app).get(`/patterns/${patternID}`).expect(200);
    expect(res.body).toHaveProperty("pattern_ID", patternID);
  });

  it("PATCH /update/:id → should update a pattern (200 or 204)", async () => {
    const [result] = await sequelize.query(`
      INSERT INTO Patterns (pattern_name, pattern_info, author, description)
      VALUES ('Old Pattern', '{"rows":["row1"]}', 'Tester', 'Old description');
    `);
    const patternID = result.insertId || 1;

    const updatedData = {
      pattern_name: "Updated Pattern",
      author: "Updated Tester",
      description: "Updated description",
    };

    const res = await request(app)
      .patch(`/update/${patternID}`)
      .send(updatedData)
      .expect((res) => {
        if (![200, 204].includes(res.status)) {
          throw new Error(`Expected 200 or 204 but got ${res.status}`);
        }
      });
  });

  it("DELETE /patterns/:id → should delete the pattern (200)", async () => {
    const [result] = await sequelize.query(`
      INSERT INTO Patterns (pattern_name, pattern_info, author, description)
      VALUES ('Delete Pattern', '{"rows":["row1"]}', 'Tester', 'Delete me');
    `);
    const patternID = result.insertId || 1;

    const res = await request(app)
      .delete(`/patterns/${patternID}`)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Pattern deleted successfully");
  });
});
