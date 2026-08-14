import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import RecipeCard from "../components/RecipeCard";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  function loadHome() {
    api("/recipes/home")
      .then((payload) => {
        setData({
          categories: payload?.categories || [],
          featured: payload?.featured || [],
          recent: payload?.recent || [],
        });
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadHome();
  }, []);

  const categories = data?.categories || [];
  const featured = data?.featured || [];
  const recent = data?.recent || [];

  return (
    <div className="stack">
      <section className="hero">
        <h1>Find your next meal</h1>
        <p>Browse, search, and save your favorites on RecipeHub.</p>
        <Link className="btn" to="/recipes">
          Browse recipes
        </Link>
      </section>

      {error && (
        <p className="error">
          {error}. The site is live; recipes will show after the backend is deployed.
        </p>
      )}
      {!data && !error && <p>Loading…</p>}

      <section>
        <h2>Categories</h2>
        <div className="chips">
          {categories.map((c) => (
            <Link key={c.id} className="chip" to={`/recipes?category=${c.id}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Featured</h2>
        <div className="grid">
          {featured.map((r) => (
            <RecipeCard key={r.id} recipe={r} onDeleted={() => loadHome()} />
          ))}
        </div>
      </section>

      <section>
        <h2>Recently added</h2>
        <div className="grid">
          {recent.map((r) => (
            <RecipeCard key={r.id} recipe={r} onDeleted={() => loadHome()} />
          ))}
        </div>
      </section>
    </div>
  );
}
