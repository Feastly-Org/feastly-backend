import db from "#db/client";

export async function createIngredient(name, calories, protein, carbs, fat) {
  const sql = `
  INSERT INTO ingredients
    (name, calories, protein, carbs, fat)
  VALUES
    ($1, $2, $3, $4, $5)
  RETURNING *
  `;
  const {
    rows: [ingredient],
  } = await db.query(sql, [name, calories, protein, carbs, fat]);
  return ingredient;
}
