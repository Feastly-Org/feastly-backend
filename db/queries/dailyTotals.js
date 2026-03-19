import db from "#db/client";

// Creates a daily total for a user
export async function createDailyTotal(
/**
 * Get all daily totals from the database.
 * @returns {Promise<Array>} Array of daily total objects
 */
export const getAllDailyTotals = async () => {
  const { rows } = await db.query(`
    SELECT *
    FROM daily_totals
    ORDER BY date DESC;
  `);

  return rows;
};

/**
 * Get a single daily total by ID.
 * @param {number} id - Daily total ID
 * @returns {Promise<Object|null>} Daily total object or null if not found
 */
export const getDailyTotalById = async (id) => {
  const {
    rows: [dailyTotal],
  } = await db.query(
    `
    SELECT *
    FROM daily_totals
    WHERE id = $1;
    `,
    [id],
  );

  return dailyTotal;
};

/**
 * Get a daily total by user and date.
 * @param {number} userId - User ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Object|null>} Daily total or null if not found
 */
export const getDailyTotalByUserAndDate = async (userId, date) => {
  const {
    rows: [dailyTotal],
  } = await db.query(
    `
    SELECT *
    FROM daily_totals
    WHERE user_id = $1 AND date = $2;
    `,
    [userId, date],
  );

  return dailyTotal;
};

/**
 * Create a new daily total.
 * @param {number} userId - The ID of the user
 * @param {string} date - The date (YYYY-MM-DD)
 * @param {number} totalCalories - Total calories
 * @param {number} totalProtein - Total protein
 * @param {number} totalCarbs - Total carbs
 * @param {number} totalFat - Total fat
 * @returns {Promise<Object>} Created daily total
 */
export const createDailyTotal = async (
  userId,
  date,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
) {
  // Iinserting a new row into the "daily_totals" table
  const sql = `
) => {
  const {
    rows: [dailyTotal],
  } = await db.query(
    `
    INSERT INTO daily_totals
      (user_id, date, total_calories, total_protein, total_carbs, total_fat)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  // Send the query to the database
  const result = await db.query(sql, [
    userId,
    date,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
  ]);

  // Get the newly created row from the result
  const dailyTotal = result.rows[0];

  // Return the created daily total
  return dailyTotal;
}
    `,
    [userId, date, totalCalories, totalProtein, totalCarbs, totalFat],
  );

  return dailyTotal;
};

/**
 * Update an existing daily total.
 * @param {number} id - Daily total ID
 * @param {number} totalCalories - Updated calories
 * @param {number} totalProtein - Updated protein
 * @param {number} totalCarbs - Updated carbs
 * @param {number} totalFat - Updated fat
 * @returns {Promise<Object|null>} Updated daily total or null if not found
 */
export const updateDailyTotal = async (
  id,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
) => {
  const {
    rows: [dailyTotal],
  } = await db.query(
    `
    UPDATE daily_totals
    SET total_calories = $2,
        total_protein = $3,
        total_carbs = $4,
        total_fat = $5
    WHERE id = $1
    RETURNING *;
    `,
    [id, totalCalories, totalProtein, totalCarbs, totalFat],
  );

  return dailyTotal;
};

/**
 * Delete a daily total by ID.
 * @param {number} id - Daily total ID
 * @returns {Promise<Object|null>} Deleted daily total or null if not found
 */
export const deleteDailyTotal = async (id) => {
  const {
    rows: [dailyTotal],
  } = await db.query(
    `
    DELETE FROM daily_totals
    WHERE id = $1
    RETURNING *;
    `,
    [id],
  );

  return dailyTotal;
};
