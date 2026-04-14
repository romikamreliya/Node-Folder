// Test fixtures and helper functions

const testUser = {
  name: "Test User",
  email: "test@example.com",
  phone: "1234567890",
  password: "SecurePass123!",
};

const testUserUpdate = {
  name: "Updated User",
  email: "updated@example.com",
  phone: "0987654321",
};

const invalidUser = {
  name: "",
  email: "not-an-email",
};

/**
 * Get auth token via the public token endpoint
 * @param {import('supertest').SuperTest} request - supertest instance
 * @param {import('express').Application} app - Express app
 * @returns {Promise<string>} access token
 */
async function getAuthToken(request, app) {
  const res = await request(app).post("/api/v1/public/token").send({});
  return res.body.data?.customAccessToken;
}

module.exports = {
  testUser,
  testUserUpdate,
  invalidUser,
  getAuthToken,
};
