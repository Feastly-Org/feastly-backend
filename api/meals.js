import express from "express";
import {
  getAllMeals,
  getMealWithIngredients,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} from "#db/queries/meals";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

function requireUser(req, res) {
  if (!req.user) {
    res.status(401).send("You must be logged in.");
    return null;
  }

  return req.user;
}

/**
 * GET /api/meals
 * Get all meals.
 *
 * @returns {Array} List of all meals
 */
router.get("/", async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const meals = await getAllMeals(user.id);
    res.send(meals);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/meals/:id/full
 * Get a meal with all its ingredients.
 *
 * @param {number} id - Meal ID
 * @returns {Object} Meal with ingredients array
 */
router.get("/:id/full", async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const id = Number(req.params.id);
    const meal = await getMealWithIngredients(id, user.id);

    if (!meal) {
      return res.status(404).send("Meal not found.");
    }

    if (meal.user_id !== req.user.id) {
      return res.status(403).send("You do not have access to this meal.");
    }

    res.send(meal);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/meals/:id
 * Get a single meal by ID.
 *
 * @param {number} id - Meal ID from URL params
 * @returns {Object} Meal object
 */
router.get("/:id", async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const id = Number(req.params.id);
    const meal = await getMealById(id, user.id);

    if (!meal) {
      return res.status(404).send("Meal not found.");
    }

    if (meal.user_id !== req.user.id) {
      return res.status(403).send("You do not have access to this meal.");
    }

    res.send(meal);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/meals
 * Create a new meal.
 *
 * @param {string} mealDate - Date of the meal (YYYY-MM-DD)
 * @param {string} mealType - Type of meal (breakfast, lunch, dinner, snack)
 *
 * @returns {Object} Created meal
 */
router.post(
  "/",
  requireBody(["mealDate", "mealType"]),
  async (req, res, next) => {
    try {
      const user = requireUser(req, res);
      if (!user) return;

      const { mealDate, mealType } = req.body;

      const meal = await createMeal(user.id, mealDate, mealType);

      res.status(201).send(meal);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * PUT /api/meals/:id
 * Update an existing meal.
 *
 * @param {number} id - Meal ID
 * @param {string} mealDate - Updated meal date
 * @param {string} mealType - Updated meal type
 *
 * @returns {Object} Updated meal
 */
router.put(
  "/:id",
  requireBody(["mealDate", "mealType"]),
  async (req, res, next) => {
    try {
      const user = requireUser(req, res);
      if (!user) return;

      const id = Number(req.params.id);
      const { mealDate, mealType } = req.body;

      const meal = await updateMeal(id, user.id, mealDate, mealType);

      res.send(meal);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * DELETE /api/meals/:id
 * Delete a meal by ID.
 *
 * @param {number} id - Meal ID
 *
 * @returns {Object} Deleted meal
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const id = Number(req.params.id);

    const meal = await deleteMeal(id, user.id);

    res.send(meal);
  } catch (error) {
    next(error);
  }
});
