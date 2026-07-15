process.env.NODE_APP_ENV = "test";
const request = require("supertest");
const { app } = require("../../app");

describe("Public API", () => {
  it("returns token payload", async () => {
    const response = await request(app).post("/api/v1/public/token").send({});

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        customAccessToken: expect.any(String),
        jwtAccessToken: expect.any(String),
        customRefreshToken: expect.any(String),
      }),
    );
  });
});

describe("Protected User API", () => {
  it("returns users with valid custom token", async () => {
    const tokenResponse = await request(app)
      .post("/api/v1/public/token")
      .send({});
    const token = tokenResponse.body.data.customAccessToken;

    const response = await request(app)
      .get("/api/v1/user/get")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("Validation API", () => {
  it("returns BAD_REQUEST for invalid AJV payload", async () => {
    const response = await request(app).post("/api/v1/public/ajv").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toEqual(expect.any(String));
  });
});
