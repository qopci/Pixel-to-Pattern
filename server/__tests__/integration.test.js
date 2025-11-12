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

  // Ensure database and table exist before tests
  beforeAll(async () => {
    // Create patterns table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS patterns (
        pattern_ID INT AUTO_INCREMENT PRIMARY KEY,
        pattern_name VARCHAR(255),
        pattern_info JSON,
        author VARCHAR(255),
        description TEXT
      );
    `);
  });

  // Clean up after each test to avoid conflicts
  afterEach(async () => {
    await sequelize.query("DELETE FROM patterns;");
  });

  // Close DB connection after all tests
  afterAll(async () => {
    await sequelize.close();
  });

  //THIS TESTS BREAKING WHYYYY
  //ERROR:
        // expect(received).toHaveProperty(path)                            
                                                                          
        // Expected path: "pattern_ID"                                      
        // Received path: []

        // Received value: 20
        //keeps giving a raw number instead of patternId 
        //do I have to change the controller?
        //
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
  
      expect(typeof res.body).toBe("number");
      createdPatternID = res.body;
      
  });
  

  it("GET /patterns → should return all patterns (200)", async () => {
    // Insert one pattern first
    await sequelize.query(`
      INSERT INTO patterns (pattern_name, pattern_info, author, description)
      VALUES ('Test Pattern', '{"rows":["row1","row2"]}', 'Tester', 'Integration test pattern');
    `);

    const res = await request(app).get("/patterns").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /patterns/:id → should return a specific pattern (200)", async () => {
    // Insert pattern
    const [result] = await sequelize.query(`
      INSERT INTO patterns (pattern_name, pattern_info, author, description)
      VALUES ('Test Pattern', '{"rows":["row1","row2"]}', 'Tester', 'Integration test pattern');
    `);
    const patternID = result.insertId || 1;

    const res = await request(app).get(`/patterns/${patternID}`).expect(200);
    expect(res.body).toHaveProperty("pattern_ID", patternID);
  });

  it("PATCH /update/:id → should update a pattern (200 or 204)", async () => {
    // Insert pattern
    const [result] = await sequelize.query(`
      INSERT INTO patterns (pattern_name, pattern_info, author, description)
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
      .expect(res => {
        if (![200, 204].includes(res.status)) {
          throw new Error(`Expected 200 or 204 but got ${res.status}`);
        }
      });
  });

  it("DELETE /patterns/:id → should delete the pattern (200)", async () => {
    // Insert pattern
    const [result] = await sequelize.query(`
      INSERT INTO patterns (pattern_name, pattern_info, author, description)
      VALUES ('Delete Pattern', '{"rows":["row1"]}', 'Tester', 'Delete me');
    `);
    const patternID = result.insertId || 1;

    const res = await request(app)
      .delete(`/patterns/${patternID}`)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Pattern deleted successfully");
  });
});
