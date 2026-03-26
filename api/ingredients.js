import express from "express";
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "#db/queries/ingredients";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

/**
 * GET /api/ingredients
 * Get all ingredients.
 *
 * @returns {Array} List of all ingredients
 */
router.get("/", async (req, res, next) => {
  const ingredients = await getAllIngredients();
  res.send(ingredients);
});

/**
 * GET /api/ingredients/:id
 * Get a single ingredient by ID.
 *
 * @param {number} id - Ingredient ID
 * @returns {Object} Ingredient object
 */
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const ingredient = await getIngredientById(id);

  if (!ingredient) {
    return res.status(404).send("Ingredient not found.");
  }

  res.send(ingredient);
});

/**
 * POST /api/ingredients
 * Create a new ingredient.
 *
 * @param {string} name - Ingredient name
 * @param {number} calories - Calories
 * @param {number} protein - Protein
 * @param {number} carbs - Carbs
 * @param {number} fat - Fat
 *
 * @returns {Object} Created ingredient
 */
router.post(
  "/",
  requireBody(["name", "calories", "protein", "carbs", "fat"]),
  async (req, res) => {
    const { name, calories, protein, carbs, fat } = req.body;

    const ingredient = await createIngredient(
      name,
      calories,
      protein,
      carbs,
      fat,
    );

    // If duplicate (ON CONFLICT DO NOTHING)
    if (!ingredient) {
      return res.status(409).send("Ingredient already exists.");
    }

    res.status(201).send(ingredient);
  },
);

/**
 * PUT /api/ingredients/:id
 * Update an ingredient.
 *
 * @param {number} id - Ingredient ID
 * @param {string} name - Updated name
 * @param {number} calories - Updated calories
 * @param {number} protein - Updated protein
 * @param {number} carbs - Updated carbs
 * @param {number} fat - Updated fat
 *
 * @returns {Object} Updated ingredient
 */
router.put(
  "/:id",
  requireBody(["name", "calories", "protein", "carbs", "fat"]),
  async (req, res) => {
    const id = Number(req.params.id);
    const { name, calories, protein, carbs, fat } = req.body;

    const ingredient = await updateIngredient(
      id,
      name,
      calories,
      protein,
      carbs,
      fat,
    );

    if (!ingredient) {
      return res.status(404).send("Ingredient not found.");
    }

    res.send(ingredient);
  },
);

/**
 * DELETE /api/ingredients/:id
 * Delete an ingredient by ID.
 *
 * @param {number} id - Ingredient ID
 *
 * @returns {Object} Deleted ingredient
 */
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const ingredient = await deleteIngredient(id);

  if (!ingredient) {
    return res.status(404).send("Ingredient not found.");
  }

  res.send(ingredient);
});
