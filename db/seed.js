import db from "#db/client";
import { faker } from "@faker-js/faker";

import { INGREDIENT_LIST, DIETS, ALLERGIES } from "#db/data";

import { createUser, getAllUsers } from "#db/queries/users";
import { createIngredient, getAllIngredients } from "#db/queries/ingredients";
import { createDiet, getAllDiets } from "#db/queries/diets";
import { createAllergy, getAllAllergies } from "#db/queries/allergies";

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
}
