import db from "#db/client";
import { faker } from "@faker-js/faker";

import { INGREDIENT_LIST, DIETS, ALLERGIES, MEAL_TYPES } from "#db/data";

import { createUser, getAllUsers } from "#db/queries/users";
import { createIngredient, getAllIngredients } from "#db/queries/ingredients";
import { createDiet, getAllDiets } from "#db/queries/diets";
import { createAllergy, getAllAllergies } from "#db/queries/allergies";
import { createMeal, getAllMeals } from "#db/queries/meals";
import {
  addMealIngredient,
  getAllMealIngredients,
} from "#db/queries/mealIngredients";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // create 20 users
  for (let i = 0; i < 20; i++) {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await createUser(email, password);
  }
  const users = await getAllUsers();
  console.log("Users in database");
  console.table(users);

  // create ingredients
  for (const ingredient of INGREDIENT_LIST) {
    const { name, calories, protein, carbs, fat } = ingredient;
    await createIngredient(name, calories, protein, carbs, fat);
  }
  const ingredients = await getAllIngredients();
  console.log("Ingredients in database:");
  console.table(ingredients);

  // create diets
  for (const diet of DIETS) {
    await createDiet(diet.name);
  }

  const diets = await getAllDiets();
  console.log("Diets in database:");
  console.table(diets);

  //create allergies
  for (const allergy of ALLERGIES) {
    await createAllergy(allergy.name);
  }

  const allergies = await getAllAllergies();
  console.log("Allergies in database:");
  console.table(allergies);

  // create meals for each user
  for (let user of users) {
    // create 5 meals
    for (let i = 0; i < 5; i++) {
      // chose meal type
      const randomMealTypeIndex = Math.floor(Math.random() * MEAL_TYPES.length);
      const meal = await createMeal(
        user.id,
        faker.date.recent(),
        MEAL_TYPES[randomMealTypeIndex],
        faker.food.dish(),
      );
    }
  }

  let meals = await getAllMeals();
  console.log("Meals in database:");
  console.table(meals);

  // add 3 ingredients to each meal
  for (const meal of meals) {
    for (let i = 0; i < 3; i++) {
      // select random ingredient
      const randomIngredientId = Math.floor(
        Math.random() * INGREDIENT_LIST.length + 1,
      );
      await addMealIngredient(meal.id, randomIngredientId, 1);
    }
  }

  const mealIngredients = await getAllMealIngredients();
  console.log("Meal Ingredients in database:");
  console.table(mealIngredients);

  // to confirm that meals and meal_ingredients show up in join query
  meals = await getAllMeals();
  console.table(meals);
}
