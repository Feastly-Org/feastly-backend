import express from "express";
const router = express.Router();
export default router;

import {
  createUser,
  getUserByEmailAndPassword,
  getUserById,
} from "#db/queries/users";

import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

/**
 * @route POST /api/users/register
 * @description Register a new user and return a JWT token
 *
 * @param {Object} req.body
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 *
 * @returns {Object} 201 - { token: string }
 * @returns {Object} 400 - Missing required fields
 * @returns {Object} 409 - Email already exists
 */
router.post(
  "/register",
  requireBody(["email", "password"]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await createUser(email, password);

      const token = createToken({ id: user.id });

      res.status(201).json({ token });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * @route POST /api/users/login
 * @description Authenticate a user and return a JWT token
 *
 * @param {Object} req.body
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 *
 * @returns {Object} 200 - { token: string }
 * @returns {Object} 401 - Invalid credentials
 */
router.post(
  "/login",
  requireBody(["email", "password"]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await getUserByEmailAndPassword(email, password);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = createToken({ id: user.id });

      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * @route GET /api/users/:id
 * @description Get a user by ID
 *
 * @param {Object} req.params
 * @param {number} req.params.id - User ID
 *
 * @returns {Object} 200 - User object (without password)
 * @returns {Object} 400 - Invalid ID
 * @returns {Object} 404 - User not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await getUserById(id);

    // Handle not found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Remove sensitive data
    delete user.password;

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});
