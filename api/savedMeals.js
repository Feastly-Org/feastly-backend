import express from "express";

import requireBody from "#middleware/requireBody";
import {
  createSavedMeal,
  deleteSavedMeal,
  getAllSavedMeals,
  getSavedMealById,
  useSavedMeal,
} from "#db/queries/savedMeals";

const router = express.Router();
export default router;

function requireUser(req, res) {
  if (!req.user) {
    res.status(401).send("You must be logged in.");
    return null;
  }

  return req.user;
}

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

router.post("/", requireBody(["name", "ingredients"]), async (req, res, next) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const { name, ingredients } = req.body;

    if (!Array.isArray(ingredients)) {
      return res.status(400).send("Ingredients must be an array.");
    }

    const savedMeal = await createSavedMeal(user.id, name, ingredients);
    res.status(201).send(savedMeal);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/use",
  requireBody(["mealDate", "mealType"]),
  async (req, res, next) => {
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
  },
);

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
