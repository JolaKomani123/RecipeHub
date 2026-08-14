import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import RecipeCard from "../components/RecipeCard";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  function loadHome() {
    const homePath = "/recipes/home";
    // #region agent log
    fetch('http://127.0.0.1:7481/ingest/b0a2a51a-b970-481d-9e1e-538890033a31',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c7e133'},body:JSON.stringify({sessionId:'c7e133',runId:'post-fix',hypothesisId:'A',location:'HomePage.jsx:useEffect',message:'Home requesting path',data:{homePath},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    api(homePath)
      .then((payload) => {
        // #region agent log
        fetch('http://127.0.0.1:7481/ingest/b0a2a51a-b970-481d-9e1e-538890033a31',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c7e133'},body:JSON.stringify({sessionId:'c7e133',runId:'post-fix',hypothesisId:'E',location:'HomePage.jsx:success',message:'Home data loaded',data:{featuredCount:payload?.featured?.length,categoryCount:payload?.categories?.length,recentCount:payload?.recent?.length},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        setData(payload);
      })
      .catch((err) => {
        // #region agent log
        fetch('http://127.0.0.1:7481/ingest/b0a2a51a-b970-481d-9e1e-538890033a31',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c7e133'},body:JSON.stringify({sessionId:'c7e133',runId:'post-fix',hypothesisId:'A',location:'HomePage.jsx:catch',message:'Home request failed',data:{errorMessage:err.message},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        setError(err.message);
      });
  }

  useEffect(() => {
    loadHome();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }
  if (!data) {
    return <p>Loading…</p>;
  }

  return (
    <div className="stack">
      <section className="hero">
        <h1>Find your next meal</h1>
        <p>Browse, search, and save your favorites on RecipeHub.</p>
        <Link className="btn" to="/recipes">
          Browse recipes
        </Link>
      </section>

      <section>
        <h2>Categories</h2>
        <div className="chips">
          {data.categories.map((c) => (
            <Link key={c.id} className="chip" to={`/recipes?category=${c.id}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Featured</h2>
        <div className="grid">
          {data.featured.map((r) => (
            <RecipeCard key={r.id} recipe={r} onDeleted={() => loadHome()} />
          ))}
        </div>
      </section>

      <section>
        <h2>Recently added</h2>
        <div className="grid">
          {data.recent.map((r) => (
            <RecipeCard key={r.id} recipe={r} onDeleted={() => loadHome()} />
          ))}
        </div>
      </section>
    </div>
  );
}
