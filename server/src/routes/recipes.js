import { Router } from "express";
import db from "../db.js";
import { authRequired } from "../middleware/auth.js";
import { uploadImage } from "../upload.js";

const router = Router();

export function mapRecipe(row) {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    description: row.description,
    categoryId: row.category_id,
    categoryName: row.category_name,
    prepTimeMinutes: row.prep_time_minutes,
    ingredients: JSON.parse(row.ingredients || "[]"),
    instructions: JSON.parse(row.instructions || "[]"),
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at,
  };
}

export const SELECT_RECIPE = `
  SELECT r.*, c.name AS category_name
  FROM recipes r
  LEFT JOIN categories c ON c.id = r.category_id
`;

router.get("/home", (_req, res) => {
  // #region agent log
  fetch('http://127.0.0.1:7481/ingest/b0a2a51a-b970-481d-9e1e-538890033a31',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c7e133'},body:JSON.stringify({sessionId:'c7e133',runId:'post-fix',hypothesisId:'A',location:'recipes.js:/home',message:'Correct /home route hit',data:{route:'/home'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  try {
    const featured = db
      .prepare(`${SELECT_RECIPE} WHERE r.is_featured = 1 ORDER BY r.created_at DESC LIMIT 6`)
      .all()
      .map(mapRecipe);
    const categories = db.prepare(`SELECT id, name FROM categories ORDER BY name`).all();
    const recent = db
      .prepare(`${SELECT_RECIPE} ORDER BY r.created_at DESC LIMIT 6`)
      .all()
      .map(mapRecipe);
    res.json({ featured, categories, recent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load home data" });
  }
});

router.get("/", (req, res) => {
  try {
    const { q, category } = req.query;
    const clauses = [];
    const params = [];

    if (q?.trim()) {
      clauses.push(`r.title LIKE ?`);
      params.push(`%${q.trim()}%`);
    }
    if (category) {
      clauses.push(`r.category_id = ?`);
      params.push(Number(category));
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = db
      .prepare(`${SELECT_RECIPE} ${where} ORDER BY r.created_at DESC`)
      .all(...params);
    res.json(rows.map(mapRecipe));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load recipes" });
  }
});

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

router.post("/", authRequired, uploadImage, (req, res) => {
  try {
    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const ingredients = parseList(req.body.ingredients);
    const instructions = parseList(req.body.instructions);
    const prepTimeMinutes = Number(req.body.prepTimeMinutes);
    const categoryId = req.body.categoryId ? Number(req.body.categoryId) : null;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    if (!Number.isFinite(prepTimeMinutes) || prepTimeMinutes < 0) {
      return res.status(400).json({ error: "Prep time must be a number 0 or more" });
    }
    if (!ingredients.length || !instructions.length) {
      return res.status(400).json({ error: "Ingredients and instructions are required" });
    }

    const result = db
      .prepare(
        `INSERT INTO recipes
         (title, image_url, description, category_id, prep_time_minutes, ingredients, instructions, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0)`
      )
      .run(
        title,
        imageUrl,
        description,
        categoryId,
        prepTimeMinutes,
        JSON.stringify(ingredients),
        JSON.stringify(instructions)
      );

    const full = db.prepare(`${SELECT_RECIPE} WHERE r.id = ?`).get(result.lastInsertRowid);
    res.status(201).json(mapRecipe(full));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create recipe" });
  }
});

router.get("/:id", (req, res) => {
  // #region agent log
  fetch('http://127.0.0.1:7481/ingest/b0a2a51a-b970-481d-9e1e-538890033a31',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c7e133'},body:JSON.stringify({sessionId:'c7e133',runId:'pre-fix',hypothesisId:'C',location:'recipes.js/:id',message:'Param route hit instead of /home',data:{idParam:req.params.id},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  try {
    const row = db.prepare(`${SELECT_RECIPE} WHERE r.id = ?`).get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(mapRecipe(row));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load recipe" });
  }
});

router.put("/:id", authRequired, uploadImage, (req, res) => {
  try {
    const existing = db.prepare(`SELECT image_url FROM recipes WHERE id = ?`).get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const title = req.body.title?.trim();
    const description = req.body.description?.trim();
    const ingredients = parseList(req.body.ingredients);
    const instructions = parseList(req.body.instructions);
    const prepTimeMinutes = Number(req.body.prepTimeMinutes);
    const categoryId = req.body.categoryId ? Number(req.body.categoryId) : null;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : existing.image_url;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    if (!Number.isFinite(prepTimeMinutes) || prepTimeMinutes < 0) {
      return res.status(400).json({ error: "Prep time must be a number 0 or more" });
    }
    if (!ingredients.length || !instructions.length) {
      return res.status(400).json({ error: "Ingredients and instructions are required" });
    }

    db.prepare(
      `UPDATE recipes SET
         title = ?,
         image_url = ?,
         description = ?,
         category_id = ?,
         prep_time_minutes = ?,
         ingredients = ?,
         instructions = ?
       WHERE id = ?`
    ).run(
      title,
      imageUrl,
      description,
      categoryId,
      prepTimeMinutes,
      JSON.stringify(ingredients),
      JSON.stringify(instructions),
      req.params.id
    );

    const full = db.prepare(`${SELECT_RECIPE} WHERE r.id = ?`).get(req.params.id);
    res.json(mapRecipe(full));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update recipe" });
  }
});

router.delete("/:id", authRequired, (req, res) => {
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
