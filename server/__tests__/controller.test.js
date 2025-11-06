// __tests__/controller.test.js
import { jest } from "@jest/globals";
import SequelizeMock from "sequelize-mock";

// Create a mock database connection
const DBConnectionMock = new SequelizeMock();

// Mock db.js before importing any models
await jest.unstable_mockModule("../models/db.js", () => ({
  default: DBConnectionMock,
}));

// Import modules after mocking db
const { Patterns } = await import("../models/patterns.js");
const model = await import("../models/model.js");
const { getAllPatterns, getPattern, postPattern, updatePattern } = model;

// Helper for mock Express response
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Pattern Model Tests (with Sequelize Mock)", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getAllPatterns returns all patterns", async () => {
    const mockPatterns = [
      DBConnectionMock.define("pattern", { id: 1, name: "Pattern 1" }),
    ];

    // Override Patterns.findAll to return mockPatterns
    jest.spyOn(Patterns, "findAll").mockResolvedValue(mockPatterns);

    const result = await getAllPatterns();
    expect(result).toEqual(mockPatterns);
  });

  test("getPattern returns single pattern", async () => {
    const mockPattern = DBConnectionMock.define("pattern", { id: 1, name: "Test Pattern" });

    Patterns.findByPk = jest.fn().mockResolvedValue(mockPattern);

    const result = await getPattern(1);
    expect(result).toEqual(mockPattern);
  });

  test("postPattern creates a new pattern", async () => {
    const createdPattern = { pattern_ID: 10 };
    jest.spyOn(Patterns, "create").mockResolvedValue(createdPattern);

    const result = await postPattern({
      pattern_name: "New Pattern",
      pattern_info: {},
      description: "desc",
    });

    expect(result).toBe(10);
  });

  test("updatePattern updates a pattern by ID", async () => {
    jest.spyOn(Patterns, "update").mockResolvedValue([1]); 

    await updatePattern(1, { pattern_name: "Updated" });

    expect(Patterns.update).toHaveBeenCalledWith(
      { pattern_name: "Updated" },
      { where: { pattern_id: 1 } }
    );
  });
});
