import db from "#db/client";

// Create a new meal in the database
export async function createMeal(userId, mealDate, mealType) {
  // Insert a new row into the "meals" table
  const sql = `
    INSERT INTO meals
      (user_id, meal_date, meal_type)
    VALUES
      ($1, $2, $3)
    RETURNING *;
  `;

  // Send the query to the database
  const result = await db.query(sql, [userId, mealDate, mealType]);

  // Get the newly created meal from the result
  const meal = result.rows[0];

  // Return the created meal
  return meal;
}
