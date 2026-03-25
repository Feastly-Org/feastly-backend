import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/**
 * Middleware to extract and attach the authenticated user to the request.
 *
 * If a valid JWT token is provided in the Authorization header,
 * the corresponding user is fetched from the database and attached to `req.user`.
 *
 * If no token is provided, the request continues without a user.
 * If the token is invalid, a 401 response is returned.
 *
 * @async
 * @function getUserFromToken
 *
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} [req.headers.authorization] - Authorization header (Bearer token)
 *
 * @param {Object} res - Express response object
 *
 * @param {Function} next - Express next middleware function
 *
 * @returns {void}
 *
 * @example
 * // Authorization header format:
 * Authorization: Bearer <token>
 *
 * // After middleware:
 * req.user = {
 *   id: 1,
 *   email: "user@example.com"
 * }
 */
export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");

  // If no token is provided, continue without attaching a user
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next();
  }

  const token = authorization.split(" ")[1];

  try {
    // Verify token and extract user ID
    const { id } = verifyToken(token);

    // Fetch user from database
    const user = await getUserById(id);

    // Ensure user exists
    if (!user) {
      return res.status(401).send("User not found.");
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (e) {
    console.error(e);

    // Invalid token
    res.status(401).send("Invalid token.");
  }
}
