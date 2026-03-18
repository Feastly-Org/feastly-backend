import db from "#db/client";
import bcrypt from "bcrypt";

/**
 * @typedef User
 * @property {number} id
 * @property {string} email
 * @property {Date} created_at
 */

/**
 * Creates a user object and returns it. User objects consist of an email, password, and timestamp.
 * @param {string} email
 * @param {string} password
 * @returns {User}
 */
export async function createUser(email, password) {
  const sql = `
  INSERT INTO users
    (email, password)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 5);
  const {
    rows: [user],
  } = await db.query(sql, [email, hashedPassword]);
  return user;
}
/**
 * Finds a user by email and hashed password
 * @param {string} email
 * @param {string} password
 * @returns {User}
 */

export async function getUserByEmailAndPassword(email, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE email = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [email]);
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return null;
  return user;
}

/**
 * Finds a user by id
 * @param {number} id
 * @returns {User}
 */

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
