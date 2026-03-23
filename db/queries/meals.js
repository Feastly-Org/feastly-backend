import db from "#db/client";

/**
 * Get all meals from the database.
 * @returns {Promise<Array>} Array of meal objects
 */
export const getAllMeals = async (userId) => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM meals
    WHERE user_id = $1
    ORDER BY meal_date DESC;
  `,
    [userId],
  );

  return rows;
};

/**
 * Get a single meal by ID.
 * @param {number} id - Meal ID
 * @returns {Promise<Object|null>} Meal object or null if not found
 */
export const getMealById = async (id, userId) => {
  const {
    rows: [meal],
  } = await db.query(
    `
    SELECT *
    FROM meals
    WHERE id = $1 AND user_id = $2;
    `,
    [id, userId],
  );

  return meal;
};

/**
 * Get one full meal with all ingredient details.
 * @param {number} id - Meal ID
 * @returns {Promise<Object|null>} Meal with ingredients or null if not found
 */
export const getMealWithIngredients = async (id, userId) => {
  const { rows } = await db.query(
    `
    SELECT
      meals.id,
      meals.user_id,
      meals.meal_date,
      meals.meal_type,
      ingredients.id AS ingredient_id,
      ingredients.name,
      ingredients.calories,
      ingredients.protein,
      ingredients.carbs,
      ingredients.fat,
      meal_ingredients.quantity
    FROM meals
    LEFT JOIN meal_ingredients
      ON meals.id = meal_ingredients.meal_id
    LEFT JOIN ingredients
      ON meal_ingredients.ingredient_id = ingredients.id
    WHERE meals.id = $1 AND meals.user_id = $2;
    `,
    [id, userId],
  );

  if (rows.length === 0) {
    return null;
  }

  const meal = {
    id: rows[0].id,
    user_id: rows[0].user_id,
    meal_date: rows[0].meal_date,
    meal_type: rows[0].meal_type,
    ingredients: [],
  };

  for (const row of rows) {
    if (row.ingredient_id) {
      meal.ingredients.push({
        id: row.ingredient_id,
        name: row.name,
        calories: row.calories,
        protein: row.protein,
        carbs: row.carbs,
        fat: row.fat,
        quantity: row.quantity,
      });
    }
  }

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
export const updateMeal = async (id, userId, mealDate, mealType) => {
  const {
    rows: [meal],
  } = await db.query(
    `
    UPDATE meals
    SET meal_date = $2,
        meal_type = $3
    WHERE id = $1 AND user_id = $4
    RETURNING *;
    `,
    [id, mealDate, mealType, userId],
  );

  return meal;
};

/**
 * Delete a meal by ID.
 * @param {number} id - Meal ID
 * @returns {Promise<Object|null>} Deleted meal or null if not found
 */
export const deleteMeal = async (id, userId) => {
  const {
    rows: [meal],
  } = await db.query(
    `
    DELETE FROM meals
    WHERE id = $1 AND user_id = $2
    RETURNING *;
    `,
    [id, userId],
  );

  return meal;
};
