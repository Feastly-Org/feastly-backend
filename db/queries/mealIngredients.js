import db from "#db/client";

/**
 * Get all meal ingredients from the database.
 * @returns {Promise<Array>} Array of meal_ingredient objects
 */
export const getAllMealIngredients = async () => {
  const { rows } = await db.query(`
    SELECT *
    FROM meal_ingredients;
  `);

  return rows;
};

/**
 * Get a single meal ingredient by ID.
 * @param {number} id - Meal ingredient ID
 * @returns {Promise<Object|null>} Meal ingredient object or null if not found
 */
export const getMealIngredientById = async (id) => {
  const {
    rows: [mealIngredient],
  } = await db.query(
    `
    SELECT *
    FROM meal_ingredients
    WHERE id = $1;
    `,
    [id],
  );

  return mealIngredient;
};

/**
 * Create a new meal ingredient.
 * @param {number} mealId - Meal ID
 * @param {number} ingredientId - Ingredient ID
 * @param {number} quantity - Quantity of the ingredient
 * @returns {Promise<Object>} Created meal ingredient
 */
export const createMealIngredient = async (mealId, ingredientId, quantity) => {
  const {
    rows: [mealIngredient],
  } = await db.query(
    `
    INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [mealId, ingredientId, quantity],
  );

  return mealIngredient;
};

/**
 * Update an existing meal ingredient.
 * @param {number} id - Meal ingredient ID
 * @param {number} mealId - Meal ID
 * @param {number} ingredientId - Ingredient ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object|null>} Updated meal ingredient or null if not found
 */
export const updateMealIngredient = async (
  id,
  mealId,
  ingredientId,
  quantity,
) => {
  const {
    rows: [mealIngredient],
  } = await db.query(
    `
    UPDATE meal_ingredients
    SET meal_id = $2,
        ingredient_id = $3,
        quantity = $4
    WHERE id = $1
    RETURNING *;
    `,
    [id, mealId, ingredientId, quantity],
  );

  return mealIngredient;
};

/**
 * Delete a meal ingredient by ID.
 * @param {number} id - Meal ingredient ID
 * @returns {Promise<Object|null>} Deleted meal ingredient or null if not found
 */
export const deleteMealIngredient = async (id) => {
  const {
    rows: [mealIngredient],
  } = await db.query(
    `
    DELETE FROM meal_ingredients
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return mealIngredient;
};

/**
 * Adds an ingredient to a specific meal.
 *
 * @param {number} mealId - The ID of the meal.
 * @param {number} ingredientId - The ID of the ingredient.
 * @param {number} quantity - The amount of the ingredient (e.g., grams, servings).
 *
 * @returns {Promise<Object>} The newly created meal_ingredient row.
 */
