import db from "#db/client";

/**
 * Get all ingredients from the database.
 * @returns {Promise<Array>} Array of ingredient objects
 */
export const getAllIngredients = async () => {
  const { rows } = await db.query(`
    SELECT *
    FROM ingredients
    ORDER BY name ASC;
  `);

  return rows;
};

/**
 * Get a single ingredient by ID.
 * @param {number} id - Ingredient ID
 * @returns {Promise<Object|null>} Ingredient object or null if not found
 */
export const getIngredientById = async (id) => {
  const {
    rows: [ingredient],
  } = await db.query(
    `
    SELECT *
    FROM ingredients
    WHERE id = $1;
    `,
    [id],
  );

  return ingredient;
};

/**
 * Create a new ingredient.
 * @param {string} name - Ingredient name
 * @param {number} calories - Calories (must be >= 0)
 * @param {number} protein - Protein (must be >= 0)
 * @param {number} carbs - Carbs (must be >= 0)
 * @param {number} fat - Fat (must be >= 0)
 * @returns {Promise<Object>} Created ingredient
 */
export const createIngredient = async (name, calories, protein, carbs, fat) => {
  const {
    rows: [ingredient],
  } = await db.query(
    `
    INSERT INTO ingredients (name, calories, protein, carbs, fat)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
    [name, calories, protein, carbs, fat],
  );

  return ingredient || null;
};

/**
 * Update an existing ingredient.
 * @param {number} id - Ingredient ID
 * @param {string} name - Updated name
 * @param {number} calories - Updated calories
 * @param {number} protein - Updated protein
 * @param {number} carbs - Updated carbs
 * @param {number} fat - Updated fat
 * @returns {Promise<Object|null>} Updated ingredient or null if not found
 */
export const updateIngredient = async (
  id,
  name,
  calories,
  protein,
  carbs,
  fat,
) => {
  const {
    rows: [ingredient],
  } = await db.query(
    `
    UPDATE ingredients
    SET name = $2,
        calories = $3,
        protein = $4,
        carbs = $5,
        fat = $6
    WHERE id = $1
    RETURNING *;
    `,
    [id, name, calories, protein, carbs, fat],
  );

  return ingredient;
};

/**
 * Delete an ingredient by ID.
 * @param {number} id - Ingredient ID
 * @returns {Promise<Object|null>} Deleted ingredient or null if not found
 */
export const deleteIngredient = async (id) => {
  const {
    rows: [ingredient],
  } = await db.query(
    `
    DELETE FROM ingredients
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return ingredient;
};
