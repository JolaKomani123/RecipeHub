import { useEffect, useState } from "react";
import { api } from "../api";

const emptyRecipe = {
  title: "",
  imageUrl: "",
  description: "",
  categoryId: "",
  prepTimeMinutes: 20,
  ingredients: "",
  instructions: "",
  isFeatured: false,
};

export default function AdminPage() {
  const [tab, setTab] = useState("recipes");
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyRecipe);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [r, c] = await Promise.all([api("/recipes"), api("/categories")]);
    setRecipes(r);
    setCategories(c);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(recipe) {
    setEditingId(recipe.id);
    setForm({
      title: recipe.title,
      imageUrl: recipe.imageUrl || "",
      description: recipe.description,
      categoryId: recipe.categoryId || "",
      prepTimeMinutes: recipe.prepTimeMinutes,
      ingredients: (recipe.ingredients || []).join("\n"),
      instructions: (recipe.instructions || []).join("\n"),
      isFeatured: recipe.isFeatured,
    });
    setTab("recipes");
  }

  async function saveRecipe(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required");
      return;
    }
    if (!form.ingredients.trim() || !form.instructions.trim()) {
      setError("Ingredients and instructions are required");
      return;
    }

    const body = {
      ...form,
      categoryId: form.categoryId || null,
      prepTimeMinutes: Number(form.prepTimeMinutes),
    };

    try {
      if (editingId) {
        await api(`/admin/recipes/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        setMessage("Recipe updated");
      } else {
        await api("/admin/recipes", {
          method: "POST",
          body: JSON.stringify(body),
        });
        setMessage("Recipe created");
      }
      setForm(emptyRecipe);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteRecipe(id) {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await api(`/admin/recipes/${id}`, { method: "DELETE" });
      setMessage("Recipe deleted");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveCategory(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }
    try {
      if (editingCategoryId) {
        await api(`/categories/${editingCategoryId}`, {
          method: "PUT",
          body: JSON.stringify({ name: categoryName }),
        });
        setMessage("Category updated");
      } else {
        await api("/categories", {
          method: "POST",
          body: JSON.stringify({ name: categoryName }),
        });
        setMessage("Category created");
      }
      setCategoryName("");
      setEditingCategoryId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api(`/categories/${id}`, { method: "DELETE" });
      setMessage("Category deleted");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack">
      <h1>Admin</h1>
      <div className="chips">
        <button
          type="button"
          className={tab === "recipes" ? "chip active" : "chip"}
          onClick={() => setTab("recipes")}
        >
          Recipes
        </button>
        <button
          type="button"
          className={tab === "categories" ? "chip active" : "chip"}
          onClick={() => setTab("categories")}
        >
          Categories
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="muted">{message}</p>}

      {tab === "recipes" && (
        <>
          <form className="form" onSubmit={saveRecipe}>
            <h2>{editingId ? "Edit recipe" : "Add recipe"}</h2>
            <label>
              Title
              <input value={form.title} onChange={(e) => updateField("title", e.target.value)} />
            </label>
            <label>
              Image URL
              <input
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </label>
            <label>
              Category
              <select
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Prep time (minutes)
              <input
                type="number"
                min="0"
                value={form.prepTimeMinutes}
                onChange={(e) => updateField("prepTimeMinutes", e.target.value)}
              />
            </label>
            <label>
              Ingredients (one per line)
              <textarea
                rows={5}
                value={form.ingredients}
                onChange={(e) => updateField("ingredients", e.target.value)}
              />
            </label>
            <label>
              Instructions (one per line)
              <textarea
                rows={5}
                value={form.instructions}
                onChange={(e) => updateField("instructions", e.target.value)}
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
              />
              Featured on home
            </label>
            <div className="row">
              <button className="btn" type="submit">
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyRecipe);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h2>All recipes</h2>
          <ul className="admin-list">
            {recipes.map((r) => (
              <li key={r.id}>
                <span>
                  {r.title} <span className="muted">({r.categoryName || "none"})</span>
                </span>
                <span className="row">
                  <button type="button" className="btn secondary" onClick={() => startEdit(r)}>
                    Edit
                  </button>
                  <button type="button" className="btn danger" onClick={() => deleteRecipe(r.id)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "categories" && (
        <>
          <form className="form" onSubmit={saveCategory}>
            <h2>{editingCategoryId ? "Edit category" : "Add category"}</h2>
            <label>
              Name
              <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </label>
            <div className="row">
              <button className="btn" type="submit">
                {editingCategoryId ? "Update" : "Create"}
              </button>
              {editingCategoryId && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryName("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <ul className="admin-list">
            {categories.map((c) => (
              <li key={c.id}>
                <span>{c.name}</span>
                <span className="row">
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => {
                      setEditingCategoryId(c.id);
                      setCategoryName(c.name);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="btn danger" onClick={() => deleteCategory(c.id)}>
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
