import { useEffect, useState } from "react";
import { api } from "../api";
import RecipeCard from "../components/RecipeCard";

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/favorites")
      .then(setRecipes)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="stack">
      <h1>Your favorites</h1>
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
      {!error && recipes.length === 0 && (
        <p className="muted">No saved recipes yet. Open a recipe and save it.</p>
      )}
    </div>
  );
}
