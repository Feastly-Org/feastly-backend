import db from "../client.js";

/**
 * Get all allergies from the database.
 * @returns {Promise<Array>} Array of allergy objects
 */
export const getAllAllergies = async () => {
  const { rows } = await db.query(`
    SELECT *
    FROM allergies
    ORDER BY name ASC;
  `);

  return rows;
};

/**
 * Get a single allergy by ID.
 * @param {number} id - Allergy ID
 * @returns {Promise<Object|null>} Allergy object or null if not found
 */
export const getAllergyById = async (id) => {
  const {
    rows: [allergy],
  } = await db.query(
    `
    SELECT *
    FROM allergies
    WHERE id = $1;
    `,
    [id],
  );

  return allergy;
};

/**
 * Create a new allergy.
 * @param {string} name - Allergy name
 * @returns {Promise<Object>} Created allergy
 */
export const createAllergy = async (name) => {
  const {
    rows: [allergy],
  } = await db.query(
    `
    INSERT INTO allergies (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
    [name],
  );

  return allergy;
};

/**
 * Update an existing allergy.
 * @param {number} id - Allergy ID
 * @param {string} name - New allergy name
 * @returns {Promise<Object|null>} Updated allergy or null if not found
 */
export const updateAllergy = async (id, name) => {
  const {
    rows: [allergy],
  } = await db.query(
    `
    UPDATE allergies
    SET name = $2
    WHERE id = $1
    RETURNING *;
    `,
    [id, name],
  );

  return allergy;
};

/**
 * Delete an allergy by ID.
 * @param {number} id - Allergy ID
 * @returns {Promise<Object|null>} Deleted allergy or null if not found
 */
export const deleteAllergy = async (id) => {
  const {
    rows: [allergy],
  } = await db.query(
    `
    DELETE FROM allergies
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return allergy;
};
