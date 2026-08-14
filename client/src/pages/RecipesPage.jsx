import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import RecipeCard from "../components/RecipeCard";

export default function RecipesPage() {
  const [params, setParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/categories").then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (params.get("q")) query.set("q", params.get("q"));
    if (params.get("category")) query.set("category", params.get("category"));
    const qs = query.toString();
    api(`/recipes${qs ? `?${qs}` : ""}`)
      .then(setRecipes)
      .catch((err) => setError(err.message));
  }, [params]);

  function onSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (category) next.set("category", category);
    setParams(next);
  }

  return (
    <div className="stack">
      <h1>All recipes</h1>
      <form className="filters" onSubmit={onSubmit}>
        <input
          type="search"
          placeholder="Search by name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {recipes.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            onDeleted={(id) => setRecipes((list) => list.filter((x) => x.id !== id))}
          />
        ))}
      </div>
      {!error && recipes.length === 0 && <p className="muted">No recipes found.</p>}
    </div>
  );
}
