import db from "#db/client";

/**
 * Get all meals from the database.
 * @returns {Promise<Array>} Array of meal objects
 */
export const getAllMeals = async () => {
  const { rows } = await db.query(`
    SELECT *
    FROM meals
    ORDER BY meal_date DESC;
  `);

  return rows;
};

/**
 * Get a single meal by ID.
 * @param {number} id - Meal ID
 * @returns {Promise<Object|null>} Meal object or null if not found
 */
export const getMealById = async (id) => {
  const {
    rows: [meal],
  } = await db.query(
    `
    SELECT *
    FROM meals
    WHERE id = $1;
    `,
    [id],
  );

  return meal;
};

/**
 * Create a new meal.
 * @param {number} userId - The ID of the user creating the meal
 * @param {string} mealDate - The date of the meal (YYYY-MM-DD)
 * @param {string} mealType - The type of meal (breakfast, lunch, dinner, snack)
 * @returns {Promise<Object>} Created meal
 */
export const createMeal = async (userId, mealDate, mealType) => {
  const {
    rows: [meal],
  } = await db.query(
    `
    INSERT INTO meals (user_id, meal_date, meal_type)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [userId, mealDate, mealType],
  );

  return meal;
};

/**
 * Update an existing meal.
 * @param {number} id - Meal ID
 * @param {string} mealDate - Updated meal date
 * @param {string} mealType - Updated meal type
 * @returns {Promise<Object|null>} Updated meal or null if not found
 */
export const updateMeal = async (id, mealDate, mealType) => {
  const {
    rows: [meal],
  } = await db.query(
    `
    UPDATE meals
    SET meal_date = $2,
        meal_type = $3
    WHERE id = $1
    RETURNING *;
    `,
    [id, mealDate, mealType],
  );

  return meal;
};

/**
 * Delete a meal by ID.
 * @param {number} id - Meal ID
 * @returns {Promise<Object|null>} Deleted meal or null if not found
 */
export const deleteMeal = async (id) => {
  const {
    rows: [meal],
  } = await db.query(
    `
    DELETE FROM meals
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return meal;
};
