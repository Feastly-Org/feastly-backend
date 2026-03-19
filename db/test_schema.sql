-- =========================================================
-- FEASTLY SCHEMA - MUST-DO TESTS
-- Purpose: verify core constraints and relationships
-- =========================================================

-- ----------------------------
-- 1. VALID BASE DATA
-- Should succeed
-- ----------------------------

INSERT INTO users (email, password)
VALUES ('test@example.com', 'hashedpassword');

INSERT INTO ingredients (name, calories, protein, carbs, fat)
VALUES ('Chicken Breast', 165, 31, 0, 4);

INSERT INTO meals (user_id, meal_date, meal_type)
VALUES (1, '2026-03-19', 'lunch');

INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity)
VALUES (1, 1, 150);

INSERT INTO daily_totals (user_id, date, total_calories, total_protein, total_carbs, total_fat)
VALUES (1, '2026-03-19', 165, 31, 0, 4);

INSERT INTO allergies (name)
VALUES ('Peanuts');

INSERT INTO user_allergies (user_id, allergy_id)
VALUES (1, 1);

INSERT INTO diets (name)
VALUES ('Keto');

INSERT INTO user_diets (user_id, diet_id)
VALUES (1, 1);

INSERT INTO ai_requests (ingredient_name, estimated_calories, estimated_protein, estimated_carbs, estimated_fat)
VALUES ('Mystery Food', 200, 10, 20, 5);

-- ----------------------------
-- 2. CORE CHECKS
-- Should return rows
-- ----------------------------

SELECT * FROM users;
SELECT * FROM meals;
SELECT * FROM meal_ingredients;
SELECT * FROM daily_totals;
SELECT * FROM user_allergies;
SELECT * FROM user_diets;

-- ----------------------------
-- 3. MUST-FAIL CONSTRAINT TESTS
-- Uncomment and run one at a time
-- ----------------------------

-- duplicate user email
-- INSERT INTO users (email, password)
-- VALUES ('test@example.com', 'anotherpassword');

-- negative ingredient calories
-- INSERT INTO ingredients (name, calories, protein, carbs, fat)
-- VALUES ('Bad Food', -1, 0, 0, 0);

-- invalid meal type
-- INSERT INTO meals (user_id, meal_date, meal_type)
-- VALUES (1, '2026-03-19', 'brunch');

-- invalid foreign key for meals
-- INSERT INTO meals (user_id, meal_date, meal_type)
-- VALUES (999, '2026-03-19', 'dinner');

-- duplicate ingredient in same meal
-- INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity)
-- VALUES (1, 1, 50);

-- invalid quantity
-- INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity)
-- VALUES (1, 1, 0);

-- duplicate daily total for same day
-- INSERT INTO daily_totals (user_id, date, total_calories, total_protein, total_carbs, total_fat)
-- VALUES (1, '2026-03-19', 300, 20, 10, 5);

-- duplicate user allergy
-- INSERT INTO user_allergies (user_id, allergy_id)
-- VALUES (1, 1);

-- duplicate user diet
-- INSERT INTO user_diets (user_id, diet_id)
-- VALUES (1, 1);

-- negative ai request estimate
-- INSERT INTO ai_requests (ingredient_name, estimated_calories)
-- VALUES ('Fake Food', -10);

-- ----------------------------
-- 4. CASCADE DELETE TEST
-- Deleting user should remove dependent rows
-- ----------------------------

DELETE FROM users WHERE id = 1;

SELECT * FROM meals WHERE user_id = 1;
SELECT * FROM daily_totals WHERE user_id = 1;
SELECT * FROM user_allergies WHERE user_id = 1;
SELECT * FROM user_diets WHERE user_id = 1;