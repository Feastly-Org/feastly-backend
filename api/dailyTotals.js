// comment to test push to pr //
import express from "express";
import {
  getAllDailyTotals,
  getDailyTotalById,
  getDailyTotalByUserAndDate,
  createDailyTotal,
  updateDailyTotal,
  deleteDailyTotal,
} from "#db/queries/dailyTotals";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

/**
 * GET /api/daily-totals
 * Get all daily totals.
 */
router.get("/", async (req, res, next) => {
  try {
    const dailyTotals = await getAllDailyTotals();
    res.send(dailyTotals);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/daily-totals/user/:userId/date/:date
 * Get a daily total by user and date.
 */
router.get("/user/:userId/date/:date", async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { date } = req.params;

    const dailyTotal = await getDailyTotalByUserAndDate(userId, date);

    if (!dailyTotal) {
      return res.status(404).send("Daily total not found.");
    }

    res.send(dailyTotal);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/daily-totals/:id
 * Get a single daily total by ID.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const dailyTotal = await getDailyTotalById(id);

    if (!dailyTotal) {
      return res.status(404).send("Daily total not found.");
    }

    res.send(dailyTotal);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/daily-totals
 * Create a new daily total.
 */
router.post(
  "/",
  requireBody([
    "userId",
    "date",
    "totalCalories",
    "totalProtein",
    "totalCarbs",
    "totalFat",
  ]),
  async (req, res, next) => {
    try {
      const {
        userId,
        date,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      } = req.body;

      const dailyTotal = await createDailyTotal(
        userId,
        date,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      );

      res.status(201).send(dailyTotal);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * PUT /api/daily-totals/:id
 * Update an existing daily total.
 */
router.put(
  "/:id",
  requireBody(["totalCalories", "totalProtein", "totalCarbs", "totalFat"]),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { totalCalories, totalProtein, totalCarbs, totalFat } = req.body;

      const dailyTotal = await updateDailyTotal(
        id,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
      );

      if (!dailyTotal) {
        return res.status(404).send("Daily total not found.");
      }

      res.send(dailyTotal);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * DELETE /api/daily-totals/:id
 * Delete a daily total by ID.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const dailyTotal = await deleteDailyTotal(id);

    if (!dailyTotal) {
      return res.status(404).send("Daily total not found.");
    }

    res.send(dailyTotal);
  } catch (error) {
    next(error);
  }
});
