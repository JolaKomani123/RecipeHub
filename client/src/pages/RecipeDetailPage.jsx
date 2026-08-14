import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/recipes/${id}`)
      .then(setRecipe)
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (!isLoggedIn) return;
    api("/favorites")
      .then((list) => setIsFavorite(list.some((r) => String(r.id) === String(id))))
      .catch(() => {});
  }, [id, isLoggedIn]);

  async function toggleFavorite() {
    setMessage("");
    try {
      if (isFavorite) {
        await api(`/favorites/${id}`, { method: "DELETE" });
        setIsFavorite(false);
        setMessage("Removed from favorites");
      } else {
        await api(`/favorites/${id}`, { method: "POST" });
        setIsFavorite(true);
        setMessage("Saved to favorites");
      }
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>Loading…</p>;

  return (
    <article className="detail">
      {recipe.imageUrl && (
        <img className="detail-image" src={recipe.imageUrl} alt={recipe.title} />
      )}
      <header className="detail-header">
        <h1 className="detail-title">{recipe.title}</h1>
        <p className="detail-meta">
          <span className="detail-chip">{recipe.categoryName || "Uncategorized"}</span>
          <span className="detail-chip">{recipe.prepTimeMinutes} min</span>
        </p>
        <p className="detail-desc">{recipe.description}</p>
      </header>

      {isLoggedIn && (
        <div className="row">
          <button type="button" className="btn secondary" onClick={toggleFavorite}>
            {isFavorite ? "Remove from favorites" : "Save to favorites"}
          </button>
          <Link className="btn" to={`/recipes/${id}/edit`}>
            Edit
          </Link>
        </div>
      )}
      {message && <p className="muted">{message}</p>}

      <div className="detail-body">
        <section className="detail-panel">
          <h2>Ingredients</h2>
          <ul className="ingredient-list">
            {(recipe.ingredients || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="detail-panel">
          <h2>Instructions</h2>
          <ol className="step-list">
            {(recipe.instructions || []).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
