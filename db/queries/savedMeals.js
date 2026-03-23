import db from "#db/client";

export async function getAllSavedMeals(userId) {
  const params = [];
  let whereClause = "";

  if (userId !== undefined) {
    params.push(userId);
    whereClause = `WHERE saved_meals.user_id = $${params.length}`;
  }

  const { rows } = await db.query(
    `
    SELECT
      saved_meals.id,
      saved_meals.user_id,
      saved_meals.name,
      saved_meals.created_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ingredients.id,
            'name', ingredients.name,
            'calories', ingredients.calories,
            'protein', ingredients.protein,
            'carbs', ingredients.carbs,
            'fat', ingredients.fat,
            'quantity', saved_meal_ingredients.quantity
          )
          ORDER BY ingredients.name
        ) FILTER (WHERE ingredients.id IS NOT NULL),
        '[]'::json
      ) AS ingredients
    FROM saved_meals
    LEFT JOIN saved_meal_ingredients
      ON saved_meals.id = saved_meal_ingredients.saved_meal_id
    LEFT JOIN ingredients
      ON saved_meal_ingredients.ingredient_id = ingredients.id
    ${whereClause}
    GROUP BY saved_meals.id
    ORDER BY saved_meals.created_at DESC, saved_meals.id DESC;
    `,
    params,
  );

  return rows;
}

export async function getSavedMealById(id, userId) {
  const {
    rows: [savedMeal],
  } = await db.query(
    `
    SELECT
      saved_meals.id,
      saved_meals.user_id,
      saved_meals.name,
      saved_meals.created_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ingredients.id,
            'name', ingredients.name,
            'calories', ingredients.calories,
            'protein', ingredients.protein,
            'carbs', ingredients.carbs,
            'fat', ingredients.fat,
            'quantity', saved_meal_ingredients.quantity
          )
          ORDER BY ingredients.name
        ) FILTER (WHERE ingredients.id IS NOT NULL),
        '[]'::json
      ) AS ingredients
    FROM saved_meals
    LEFT JOIN saved_meal_ingredients
      ON saved_meals.id = saved_meal_ingredients.saved_meal_id
    LEFT JOIN ingredients
      ON saved_meal_ingredients.ingredient_id = ingredients.id
    WHERE saved_meals.id = $1 AND saved_meals.user_id = $2
    GROUP BY saved_meals.id;
    `,
    [id, userId],
  );

  return savedMeal ?? null;
}

export async function createSavedMeal(userId, name, ingredients = []) {
  try {
    await db.query("BEGIN");

    const {
      rows: [savedMeal],
    } = await db.query(
      `
      INSERT INTO saved_meals (user_id, name)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [userId, name],
    );

    for (const ingredient of ingredients) {
      await db.query(
        `
        INSERT INTO saved_meal_ingredients (saved_meal_id, ingredient_id, quantity)
        VALUES ($1, $2, $3);
        `,
        [savedMeal.id, ingredient.ingredientId, ingredient.quantity],
      );
    }

    await db.query("COMMIT");
    return getSavedMealById(savedMeal.id, userId);
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}

export async function deleteSavedMeal(id, userId) {
  const {
    rows: [savedMeal],
  } = await db.query(
    `
    DELETE FROM saved_meals
    WHERE id = $1 AND user_id = $2
    RETURNING *;
    `,
    [id, userId],
  );

  return savedMeal ?? null;
}

export async function useSavedMeal(savedMealId, userId, mealDate, mealType) {
  try {
    await db.query("BEGIN");

    const {
      rows: [savedMeal],
    } = await db.query(
      `
      SELECT *
      FROM saved_meals
      WHERE id = $1 AND user_id = $2;
      `,
      [savedMealId, userId],
    );

    if (!savedMeal) {
      await db.query("ROLLBACK");
      return null;
    }

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

    const { rows: savedIngredients } = await db.query(
      `
      SELECT ingredient_id, quantity
      FROM saved_meal_ingredients
      WHERE saved_meal_id = $1;
      `,
      [savedMealId],
    );

    for (const ingredient of savedIngredients) {
      await db.query(
        `
        INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity)
        VALUES ($1, $2, $3);
        `,
        [meal.id, ingredient.ingredient_id, ingredient.quantity],
      );
    }

    await db.query("COMMIT");
    return meal;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}
