import db from "#db/client";

// Creates a daily total for a user
export async function createDailyTotal(
  userId,
  date,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
) {
  // Iinserting a new row into the "daily_totals" table
  const sql = `
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
