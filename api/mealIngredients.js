import express from "express";
import {
  addMealIngredient,
  getAllMealIngredients,
  getMealIngredientById,
  updateMealIngredient,
  deleteMealIngredient,
} from "#db/queries/mealIngredients";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

/**
 * GET /api/meal-ingredients
 * Get all meal ingredients.
 *
 * @returns {Array} List of all meal ingredients
 */
router.get("/", async (req, res, next) => {
  const mealIngredients = await getAllMealIngredients();
  res.send(mealIngredients);
});

/**
 * GET /api/meal-ingredients/:id
 * Get a single meal ingredient by ID.
 *
 * @param {number} id - Meal ingredient ID
 * @returns {Object} Meal ingredient object
 */
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const mealIngredient = await getMealIngredientById(id);

  if (!mealIngredient) {
    return res.status(404).send("Meal ingredient not found.");
  }

  res.send(mealIngredient);
});

/**
 * POST /api/meal-ingredients
 * Create a new meal ingredient.
 *
 * @param {number} mealId - Meal ID
 * @param {number} ingredientId - Ingredient ID
 * @param {number} quantity - Quantity of the ingredient
 *
 * @returns {Object} Created meal ingredient
 */
router.post(
  "/",
  requireBody(["mealId", "ingredientId", "quantity"]),
  async (req, res) => {
    const { mealId, ingredientId, quantity } = req.body;

    const mealIngredient = await addMealIngredient(
      mealId,
      ingredientId,
      quantity,
    );

    res.status(201).send(mealIngredient);
  },
);

/**
 * PUT /api/meal-ingredients/:id
 * Update an existing meal ingredient.
 *
 * @param {number} id - Meal ingredient ID
 * @param {number} mealId - Meal ID
 * @param {number} ingredientId - Ingredient ID
 * @param {number} quantity - Updated quantity
 *
 * @returns {Object} Updated meal ingredient
 */
router.put(
  "/:id",
  requireBody(["mealId", "ingredientId", "quantity"]),
  async (req, res) => {
    const id = Number(req.params.id);
    const { mealId, ingredientId, quantity } = req.body;

    const mealIngredient = await updateMealIngredient(
      id,
      mealId,
      ingredientId,
      quantity,
    );

    if (!mealIngredient) {
      return res.status(404).send("Meal ingredient not found.");
    }

    res.send(mealIngredient);
  },
);

/**
 * DELETE /api/meal-ingredients/:id
 * Delete a meal ingredient by ID.
 *
 * @param {number} id - Meal ingredient ID
 *
 * @returns {Object} Deleted meal ingredient
 */
router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  const mealIngredient = await deleteMealIngredient(id);

  if (!mealIngredient) {
    return res.status(404).send("Meal ingredient not found.");
  }

  res.send(mealIngredient);
});
