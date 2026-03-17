import db from "#db/client";

// Function adds an ingredient to a specific meal
export async function addMealIngredient(mealId, ingredientId, quantity) {
  // Inserting a new row into the "meal_ingredients" table
  const sql = `
    INSERT INTO meal_ingredients
      (meal_id, ingredient_id, quantity)
    VALUES
      ($1, $2, $3)
    RETURNING *;
  `;

  // Send the query to the database
  const result = await db.query(sql, [mealId, ingredientId, quantity]);

  // Get the newly created row from the result
  const mealIngredient = result.rows[0];

  // Return the new meal ingredient
  return mealIngredient;
}
