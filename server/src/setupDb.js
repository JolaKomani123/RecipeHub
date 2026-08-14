import bcrypt from "bcryptjs";
import db from "./db.js";

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  prep_time_minutes INTEGER NOT NULL DEFAULT 0,
  ingredients TEXT NOT NULL DEFAULT '[]',
  instructions TEXT NOT NULL DEFAULT '[]',
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, recipe_id)
);
`);

const adminHash = bcrypt.hashSync("admin123", 10);
db.prepare(
  `INSERT OR IGNORE INTO users (name, email, password_hash, is_admin)
   VALUES (?, ?, ?, 1)`
).run("Admin", "admin@recipehub.com", adminHash);

const categories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Vegetarian"];
const insertCategory = db.prepare(
  `INSERT OR IGNORE INTO categories (name) VALUES (?)`
);
for (const name of categories) {
  insertCategory.run(name);
}

const recipeCount = db.prepare(`SELECT COUNT(*) AS count FROM recipes`).get().count;
if (recipeCount === 0) {
  const cats = db.prepare(`SELECT id, name FROM categories`).all();
  const byName = Object.fromEntries(cats.map((c) => [c.name, c.id]));

  const insertRecipe = db.prepare(
    `INSERT INTO recipes
     (title, image_url, description, category_id, prep_time_minutes, ingredients, instructions, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const samples = [
    {
      title: "Fluffy Pancakes",
      image_url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
      description: "Soft pancakes for a cozy breakfast.",
      category_id: byName.Breakfast,
      prep_time_minutes: 20,
      ingredients: ["2 cups flour", "2 eggs", "1.5 cups milk", "2 tbsp sugar", "1 tsp baking powder"],
      instructions: ["Mix dry ingredients.", "Add eggs and milk.", "Cook on a hot pan until golden."],
      is_featured: 1,
    },
    {
      title: "Classic Caesar Salad",
      image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
      description: "Crisp romaine with creamy dressing.",
      category_id: byName.Lunch,
      prep_time_minutes: 15,
      ingredients: ["Romaine lettuce", "Croutons", "Parmesan", "Caesar dressing"],
      instructions: ["Chop lettuce.", "Toss with dressing.", "Top with croutons and cheese."],
      is_featured: 1,
    },
    {
      title: "Tomato Pasta",
      image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
      description: "Simple weeknight pasta with tomato sauce.",
      category_id: byName.Dinner,
      prep_time_minutes: 30,
      ingredients: ["400g pasta", "Tomato sauce", "Garlic", "Olive oil", "Basil"],
      instructions: ["Boil pasta.", "Sauté garlic in oil.", "Add sauce and pasta.", "Finish with basil."],
      is_featured: 0,
    },
    {
      title: "Chocolate Mug Cake",
      image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
      description: "Quick dessert ready in minutes.",
      category_id: byName.Dessert,
      prep_time_minutes: 5,
      ingredients: ["4 tbsp flour", "3 tbsp sugar", "2 tbsp cocoa", "3 tbsp milk", "2 tbsp oil"],
      instructions: ["Mix everything in a mug.", "Microwave 90 seconds.", "Let cool slightly and enjoy."],
      is_featured: 1,
    },
    {
      title: "Veggie Stir Fry",
      image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800",
      description: "Colorful vegetables with light soy sauce.",
      category_id: byName.Vegetarian,
      prep_time_minutes: 25,
      ingredients: ["Mixed vegetables", "Soy sauce", "Garlic", "Ginger", "Rice"],
      instructions: ["Cook rice.", "Stir-fry garlic and ginger.", "Add vegetables and soy sauce.", "Serve over rice."],
      is_featured: 0,
    },
  ];

  for (const r of samples) {
    insertRecipe.run(
      r.title,
      r.image_url,
      r.description,
      r.category_id,
      r.prep_time_minutes,
      JSON.stringify(r.ingredients),
      JSON.stringify(r.instructions),
      r.is_featured
    );
  }
}

console.log("SQLite database ready at data/recipehub.db");
console.log("Admin: admin@recipehub.com / admin123");
