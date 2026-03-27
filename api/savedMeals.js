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
router.get("/", async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const savedMeals = await getAllSavedMeals(user.id);
    res.send(savedMeals);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/savedMeals/:id
 * Returns one saved meal template belonging to the logged-in user,
 * including its ingredient list from the database.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const id = Number(req.params.id);
    const savedMeal = await getSavedMealById(id, user.id);

    if (!savedMeal) {
      return res.status(404).send("Saved meal not found.");
    }

    res.send(savedMeal);
  } catch (error) {
    next(error);
  }
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
  async (req, res, next) => {
    try {
      const user = requireUser(req, res);
      if (!user) return;

      const { name, mealType, ingredients } = req.body;

      if (!Array.isArray(ingredients)) {
        return res.status(400).send("Ingredients must be an array.");
      }

      const savedMeal = await createSavedMeal(
        user.id,
        name,
        mealType,
        ingredients,
      );
      res.status(201).send(savedMeal);
    } catch (error) {
      next(error);
    }
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
  async (req, res, next) => {
    try {
      const user = requireUser(req, res);
      if (!user) return;

      const id = Number(req.params.id);
      const { name, mealType, ingredients } = req.body;

      if (!Array.isArray(ingredients)) {
        return res.status(400).send("Ingredients must be an array.");
      }

      const savedMeal = await updateSavedMeal(
        id,
        user.id,
        name,
        mealType,
        ingredients,
      );

      if (!savedMeal) {
        return res.status(404).send("Saved meal not found.");
      }

      res.send(savedMeal);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * POST /api/savedMeals/:id/use
 * Turns a saved meal template into a real dated meal entry.
 * This creates a row in meals and copies the saved ingredients
 * into meal_ingredients for the selected day. If mealType is
 * omitted, the saved template's own meal type is used.
 */
router.post("/:id/use", requireBody(["mealDate"]), async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const id = Number(req.params.id);
    const { mealDate, mealType } = req.body;

    const meal = await useSavedMeal(id, user.id, mealDate, mealType);
    if (!meal) {
      return res.status(404).send("Saved meal not found.");
    }

    res.status(201).send(meal);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/savedMeals/:id
 * Deletes one saved meal template owned by the logged-in user.
 * Its saved ingredient rows are removed by the database cascade.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const id = Number(req.params.id);
    const savedMeal = await deleteSavedMeal(id, user.id);

    if (!savedMeal) {
      return res.status(404).send("Saved meal not found.");
    }

    res.send(savedMeal);
  } catch (error) {
    next(error);
  }
});
