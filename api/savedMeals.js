import express from "express";

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import {
  createSavedMeal,
  deleteSavedMeal,
  getAllSavedMeals,
  getSavedMealById,
  updateSavedMeal,
  useSavedMeal,
} from "#db/queries/savedMeals";

const router = express.Router();
export default router;

router.use(requireUser);
/**
 * Saved meal routes are private to the authenticated user.
 * This helper ensures every handler below has a resolved user
 * from the bearer token before touching saved meal data.
 */

/**
 * GET /api/savedMeals
 * Returns all reusable saved meals for the logged-in user.
 * Each saved meal can later be used as a template on the daily log.
 */
router.get("/", async (req, res) => {
  const savedMeals = await getAllSavedMeals(req.user.id);
  res.send(savedMeals);
});

/**
 * GET /api/savedMeals/:id
 * Returns one saved meal template belonging to the logged-in user,
 * including its ingredient list from the database.
 */
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const savedMeal = await getSavedMealById(id, req.user.id);

  if (!savedMeal) {
    return res.status(404).send("Saved meal not found.");
  }

  res.send(savedMeal);
});

/**
 * POST /api/savedMeals
 * Creates a reusable meal template for the logged-in user.
 * The request body contains the template name, meal type, plus
 * ingredient ids and quantities selected from the ingredients table.
 */
router.post(
  "/",
  requireBody(["name", "mealType", "ingredients"]),
  async (req, res) => {
    const { name, mealType, ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).send("Ingredients must be an array.");
    }

    const savedMeal = await createSavedMeal(
      req.user.id,
      name,
      mealType,
      ingredients,
    );
    res.status(201).send(savedMeal);
  },
);

/**
 * PUT /api/savedMeals/:id
 * Updates one saved meal template for the logged-in user.
 * The submitted ingredient list replaces the existing template ingredients.
 */
router.put(
  "/:id",
  requireBody(["name", "mealType", "ingredients"]),
  async (req, res) => {
    const id = Number(req.params.id);
    const { name, mealType, ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).send("Ingredients must be an array.");
    }

    const savedMeal = await updateSavedMeal(
      id,
      req.user.id,
      name,
      mealType,
      ingredients,
    );

    if (!savedMeal) {
      return res.status(404).send("Saved meal not found.");
    }

    res.send(savedMeal);
  },
);

/**
 * POST /api/savedMeals/:id/use
 * Turns a saved meal template into a real dated meal entry.
 * This creates a row in meals and copies the saved ingredients
 * into meal_ingredients for the selected day. If mealType is
 * omitted, the saved template's own meal type is used.
 */
router.post("/:id/use", requireBody(["mealDate"]), async (req, res) => {
  const id = Number(req.params.id);
  const { mealDate, mealType } = req.body;

  const meal = await useSavedMeal(id, req.user.id, mealDate, mealType);
  if (!meal) {
    return res.status(404).send("Saved meal not found.");
  }

  res.status(201).send(meal);
});

/**
 * DELETE /api/savedMeals/:id
 * Deletes one saved meal template owned by the logged-in user.
 * Its saved ingredient rows are removed by the database cascade.
 */
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const savedMeal = await deleteSavedMeal(id, req.user.id);

  if (!savedMeal) {
    return res.status(404).send("Saved meal not found.");
  }

  res.send(savedMeal);
});
