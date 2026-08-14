import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function RecipeCard({ recipe, onDeleted }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function onDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setError("");
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    setBusy(true);
    setError("");
    try {
      await api(`/recipes/${recipe.id}`, { method: "DELETE" });
      setConfirmOpen(false);
      onDeleted?.(recipe.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card">
      <Link to={`/recipes/${recipe.id}`} className="card-main">
        <div className="card-image">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title} />
          ) : (
            <div className="card-placeholder">No image</div>
          )}
        </div>
        <div className="card-body">
          <h3>{recipe.title}</h3>
          <p className="muted">
            {recipe.categoryName || "Uncategorized"} · {recipe.prepTimeMinutes} min
          </p>
          <p>{recipe.description}</p>
        </div>
      </Link>
      <div className="card-actions">
        <button type="button" className="btn danger" onClick={onDeleteClick}>
          Delete
        </button>
      </div>

      {confirmOpen &&
        createPortal(
          <div className="confirm-overlay" onClick={() => !busy && setConfirmOpen(false)}>
            <div
              className="confirm-box"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`delete-title-${recipe.id}`}
            >
              <h2 id={`delete-title-${recipe.id}`}>Delete recipe</h2>
              <p>Are you sure you want to delete “{recipe.title}”?</p>
              {error && <p className="error">{error}</p>}
              <div className="confirm-actions">
                <button
                  type="button"
                  className="btn secondary"
                  disabled={busy}
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn danger" disabled={busy} onClick={confirmDelete}>
                  {busy ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </article>
  );
}
