const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Warn in server logs and use a dev fallback so local development can continue.
    // In production you MUST set JWT_SECRET in your environment.
    console.warn("⚠️  JWT_SECRET is not set. Using insecure fallback secret for development.");
  }
  const usedSecret = secret || "dev_secret_fallback_change_me";

  try {
    return jwt.sign({ id }, usedSecret, {
      expiresIn: "30d",
    });
  } catch (err) {
    // Log useful debug info without printing the full secret
    console.error("❌ Failed to sign JWT:", {
      idType: typeof id,
      idValuePreview: typeof id === 'string' && id.length > 20 ? id.slice(0, 8) + '...' : id,
      secretLength: usedSecret ? usedSecret.length : 0,
      errorMessage: err.message,
    });
    // Re-throw to let upstream error handler handle response
    throw err;
  }
};

module.exports = generateToken;
