import { Router } from "express";
import db from "../db.js";
import { adminRequired } from "../middleware/auth.js";
import { mapRecipe, SELECT_RECIPE } from "./recipes.js";

const router = Router();

router.use(adminRequired);

function parseList(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function validateRecipeBody(body) {
  const title = body.title?.trim();
  const description = body.description?.trim();
  const ingredients = parseList(body.ingredients);
  const instructions = parseList(body.instructions);
  const prepTimeMinutes = Number(body.prepTimeMinutes);
  const categoryId = body.categoryId ? Number(body.categoryId) : null;

  if (!title || !description) {
    return { error: "Title and description are required" };
  }
  if (!Number.isFinite(prepTimeMinutes) || prepTimeMinutes < 0) {
    return { error: "Prep time must be a number 0 or more" };
  }
  if (!ingredients.length || !instructions.length) {
    return { error: "Ingredients and instructions are required" };
  }

  return {
    data: {
      title,
      imageUrl: body.imageUrl?.trim() || null,
      description,
      categoryId,
      prepTimeMinutes,
      ingredients,
      instructions,
      isFeatured: body.isFeatured ? 1 : 0,
    },
  };
}

router.post("/recipes", (req, res) => {
  try {
    const checked = validateRecipeBody(req.body);
    if (checked.error) {
      return res.status(400).json({ error: checked.error });
    }
    const d = checked.data;
    const result = db
      .prepare(
        `INSERT INTO recipes
         (title, image_url, description, category_id, prep_time_minutes, ingredients, instructions, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        d.title,
        d.imageUrl,
        d.description,
        d.categoryId,
        d.prepTimeMinutes,
        JSON.stringify(d.ingredients),
        JSON.stringify(d.instructions),
        d.isFeatured
      );

    const full = db.prepare(`${SELECT_RECIPE} WHERE r.id = ?`).get(result.lastInsertRowid);
    res.status(201).json(mapRecipe(full));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create recipe" });
  }
});

router.put("/recipes/:id", (req, res) => {
  try {
    const checked = validateRecipeBody(req.body);
    if (checked.error) {
      return res.status(400).json({ error: checked.error });
    }
    const d = checked.data;
    const result = db
      .prepare(
        `UPDATE recipes SET
           title = ?,
           image_url = ?,
           description = ?,
           category_id = ?,
           prep_time_minutes = ?,
           ingredients = ?,
           instructions = ?,
           is_featured = ?
         WHERE id = ?`
      )
      .run(
        d.title,
        d.imageUrl,
        d.description,
        d.categoryId,
        d.prepTimeMinutes,
        JSON.stringify(d.ingredients),
        JSON.stringify(d.instructions),
        d.isFeatured,
        req.params.id
      );

    if (!result.changes) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    const full = db.prepare(`${SELECT_RECIPE} WHERE r.id = ?`).get(req.params.id);
    res.json(mapRecipe(full));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update recipe" });
  }
});

router.delete("/recipes/:id", (req, res) => {
  try {
    const result = db.prepare(`DELETE FROM recipes WHERE id = ?`).run(req.params.id);
    if (!result.changes) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete recipe" });
  }
});

export default router;
