/* =========================================================
   DATABASE: FEASTLY
   PURPOSE:
   This database supports a meal tracking application where
   users can log meals, track nutritional intake, and manage
   dietary restrictions such as allergies and diets.
   ========================================================= */

/* =========================================================
   DROP TABLES (Dependency Order)
   Drops all tables safely before recreating schema.
   CASCADE ensures dependent tables are also removed.
   ========================================================= */
DROP TABLE IF EXISTS user_diets CASCADE;
DROP TABLE IF EXISTS diets CASCADE;
DROP TABLE IF EXISTS user_allergies CASCADE;
DROP TABLE IF EXISTS allergies CASCADE;
DROP TABLE IF EXISTS daily_totals CASCADE;
DROP TABLE IF EXISTS meal_ingredients CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ai_requests CASCADE;

/* =========================================================
   USERS
   Stores user account credentials and metadata.
   Each user is uniquely identified by email.
   ========================================================= */
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================================================
   INGREDIENTS
   Stores nutritional information for individual ingredients.
   All nutritional values must be non-negative.
   ========================================================= */
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    calories INT NOT NULL CHECK (calories >= 0),
    protein INT NOT NULL CHECK (protein >= 0),
    carbs INT NOT NULL CHECK (carbs >= 0),
    fat INT NOT NULL CHECK (fat >= 0)
);

/* =========================================================
   MEALS
   Represents a meal logged by a user on a specific date.
   Meal type is restricted to predefined categories.
   ========================================================= */
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    meal_date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL CHECK (
        meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')
    ),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =========================================================
   MEAL_INGREDIENTS
   Join table linking meals and ingredients.
   Stores quantity of each ingredient used in a meal.
   Ensures no duplicate ingredient entries per meal.
   ========================================================= */
CREATE TABLE meal_ingredients (
    id SERIAL PRIMARY KEY,
    meal_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),  -- quantity in grams or units
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    UNIQUE (meal_id, ingredient_id)
);

/* =========================================================
   DAILY_TOTALS
   Stores aggregated nutritional values per user per day.
   Enforces one record per user per date.
   Used for fast dashboard calculations.
   ========================================================= */
CREATE TABLE daily_totals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    total_calories INT NOT NULL CHECK (total_calories >= 0),
    total_protein INT NOT NULL CHECK (total_protein >= 0),
    total_carbs INT NOT NULL CHECK (total_carbs >= 0),
    total_fat INT NOT NULL CHECK (total_fat >= 0),
    UNIQUE (user_id, date),  -- ensures only one total per day
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* =========================================================
   ALLERGIES
   Master reference table containing all possible allergens.
   Examples: peanuts, dairy, gluten.
   ========================================================= */
CREATE TABLE allergies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

/* =========================================================
   USER_ALLERGIES
   Join table linking users to their allergies.
   Each user can have multiple allergies.
   ========================================================= */
CREATE TABLE user_allergies (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    allergy_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (allergy_id) REFERENCES allergies(id) ON DELETE CASCADE
);

/* =========================================================
   DIETS
   Master reference table for diet types.
   Examples: keto, vegan, vegetarian.
   ========================================================= */
CREATE TABLE diets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

/* =========================================================
   USER_DIETS
   Join table linking users to selected diet preferences.
   Each user can follow multiple diets.
   ========================================================= */
CREATE TABLE user_diets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    diet_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (diet_id) REFERENCES diets(id) ON DELETE CASCADE
);

/* =========================================================
   AI_REQUESTS
   Stores AI-generated nutritional estimates for ingredients
   that are not already present in the database.
   Used as a fallback for unknown foods.
   ========================================================= */
CREATE TABLE ai_requests (
    id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL,
    estimated_calories INT CHECK (estimated_calories >= 0),
    estimated_protein INT CHECK (estimated_protein >= 0),
    estimated_carbs INT CHECK (estimated_carbs >= 0),
    estimated_fat INT CHECK (estimated_fat >= 0)
);

/* =========================================================
   CONSTRAINTS: PREVENT DUPLICATES
   Ensures users cannot assign the same allergy or diet twice.
   ========================================================= */
ALTER TABLE user_allergies
ADD CONSTRAINT unique_user_allergy UNIQUE (user_id, allergy_id);

ALTER TABLE user_diets
ADD CONSTRAINT unique_user_diet UNIQUE (user_id, diet_id);