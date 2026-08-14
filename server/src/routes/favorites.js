import { Router } from "express";
import db from "../db.js";
import { authRequired } from "../middleware/auth.js";
import { mapRecipe, SELECT_RECIPE } from "./recipes.js";

const router = Router();

router.use(authRequired);

router.get("/", (req, res) => {
  try {
    const rows = db
      .prepare(
        `${SELECT_RECIPE}
         INNER JOIN favorites f ON f.recipe_id = r.id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`
      )
      .all(req.user.id);
    res.json(rows.map(mapRecipe));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load favorites" });
  }
});

router.post("/:recipeId", (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const recipe = db.prepare(`SELECT id FROM recipes WHERE id = ?`).get(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    db.prepare(
      `INSERT OR IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)`
    ).run(req.user.id, recipeId);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save favorite" });
  }
});

router.delete("/:recipeId", (req, res) => {
  try {
    db.prepare(`DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?`).run(
      req.user.id,
      req.params.recipeId
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not remove favorite" });
  }
});

export default router;
