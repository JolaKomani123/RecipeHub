import { Router } from "express";
import db from "../db.js";
import { adminRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", (_req, res) => {
  try {
    const rows = db.prepare(`SELECT id, name FROM categories ORDER BY name`).all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load categories" });
  }
});

router.post("/", adminRequired, (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const result = db.prepare(`INSERT INTO categories (name) VALUES (?)`).run(name);
    const row = db
      .prepare(`SELECT id, name FROM categories WHERE id = ?`)
      .get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "Category already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Could not create category" });
  }
});

router.put("/:id", adminRequired, (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const result = db
      .prepare(`UPDATE categories SET name = ? WHERE id = ?`)
      .run(name, req.params.id);
    if (!result.changes) {
      return res.status(404).json({ error: "Category not found" });
    }
    const row = db.prepare(`SELECT id, name FROM categories WHERE id = ?`).get(req.params.id);
    res.json(row);
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "Category already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Could not update category" });
  }
});

router.delete("/:id", adminRequired, (req, res) => {
  try {
    const result = db.prepare(`DELETE FROM categories WHERE id = ?`).run(req.params.id);
    if (!result.changes) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete category" });
  }
});

export default router;
