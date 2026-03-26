/**
 * Middleware factory that validates required fields in the request body.
 *
 * This function returns an Express middleware that checks whether
 * the request body contains all required fields. If any fields are
 * missing, it responds with a 400 Bad Request error.
 *
 * @function requireBody
 *
 * @param {string[]} fields - An array of required field names
 *
 * @returns {Function} Express middleware function
 *
 * @example
 * // Usage in a route:
 * router.post(
 *   "/register",
 *   requireBody(["email", "password"]),
 *   (req, res) => {
 *     // req.body is guaranteed to have email and password
 *   }
 * );
 */
export default function requireBody(fields) {
  /**
   * Express middleware to validate request body fields
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   *
   * @param {Object} res - Express response object
   *
   * @param {Function} next - Express next middleware function
   *
   * @returns {void}
   */
  return (req, res, next) => {
    // Ensure request body exists
    if (!req.body) {
      return res.status(400).send("Request body is required.");
    }

    // Find missing fields
    const missing = fields.filter((field) => !(field in req.body));

    // If any required fields are missing, return error
    if (missing.length > 0) {
      return res.status(400).send(`Missing fields: ${missing.join(", ")}`);
    }

    // All fields present → continue
    next();
  };
}
