import express from "express";
const router = express.Router();
export default router;

import usersRouter from "#api/users";
import dailyTotalsRouter from "#api/dailyTotals";
import ingredientsRouter from "#api/ingredients";
import mealIngredientsRouter from "#api/mealIngredients";
import mealsRouter from "#api/meals";
import savedMealsRouter from "#api/savedMeals";

router.use("/users", usersRouter);
router.use("/dailyTotals", dailyTotalsRouter);
router.use("/ingredients", ingredientsRouter);
router.use("/mealIngredients", mealIngredientsRouter);
router.use("/meals", mealsRouter);
router.use("/savedMeals", savedMealsRouter);
