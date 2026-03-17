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

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories INT,
    protein INT,
    carbs INT,
    fat INT
);

CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    meal_date DATE NOT NULL,
    meal_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE meal_ingredients (
    id SERIAL PRIMARY KEY,
    meal_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity INT,
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE daily_totals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    total_calories INT,
    total_protein INT,
    total_carbs INT,
    total_fat INT,
    UNIQUE (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE allergies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user_allergies (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    allergy_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (allergy_id) REFERENCES allergies(id) ON DELETE CASCADE
);

CREATE TABLE diets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE user_diets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    diet_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (diet_id) REFERENCES diets(id) ON DELETE CASCADE
);

CREATE TABLE ai_requests (
    id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255),
    estimated_calories INT,
    estimated_protein INT,
    estimated_carbs INT,
    estimated_fat INT
);