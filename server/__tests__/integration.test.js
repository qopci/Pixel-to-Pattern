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
});
