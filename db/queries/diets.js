import db from "../client.js";

/**
 * Get all diets from the database.
 * @returns {Promise<Array>} Array of diet objects
 */
export const getAllDiets = async () => {
  const { rows } = await db.query(`
    SELECT *
    FROM diets
    ORDER BY name ASC;
  `);

  return rows;
};

/**
 * Get a single diet by ID.
 * @param {number} id - Diet ID
 * @returns {Promise<Object|null>} Diet object or null if not found
 */
export const getDietById = async (id) => {
  const {
    rows: [diet],
  } = await db.query(
    `
    SELECT *
    FROM diets
    WHERE id = $1;
    `,
    [id],
  );

  return diet;
};

/**
 * Create a new diet.
 * @param {string} name - Diet name
 * @returns {Promise<Object>} Created diet
 */
export const createDiet = async (name) => {
  const {
    rows: [diet],
  } = await db.query(
    `
    INSERT INTO diets (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
    [name],
  );

  return diet;
};

/**
 * Update an existing diet.
 * @param {number} id - Diet ID
 * @param {string} name - New diet name
 * @returns {Promise<Object|null>} Updated diet or null if not found
 */
export const updateDiet = async (id, name) => {
  const {
    rows: [diet],
  } = await db.query(
    `
    UPDATE diets
    SET name = $2
    WHERE id = $1
    RETURNING *;
    `,
    [id, name],
  );

  return diet;
};

/**
 * Delete a diet by ID.
 * @param {number} id - Diet ID
 * @returns {Promise<Object|null>} Deleted diet or null if not found
 */
export const deleteDiet = async (id) => {
  const {
    rows: [diet],
  } = await db.query(
    `
    DELETE FROM diets
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return diet;
};
/**
 * @param {number} id - userID
 * @returns {string} - diet type
 */
export async function getDietByUserId(id) {
  const sql = `
  SELECT *
  FROM user_diets 
  WHERE user_id = $1;
  `;
  const {
    rows: [diet],
  } = await db.query(sql, [id]);
  return diet;
}
