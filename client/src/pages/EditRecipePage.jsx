import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api("/categories"), api(`/recipes/${id}`)])
      .then(([cats, recipe]) => {
        setCategories(cats);
        setTitle(recipe.title || "");
        setImageUrl(recipe.imageUrl || "");
        setDescription(recipe.description || "");
        setCategoryId(recipe.categoryId ? String(recipe.categoryId) : "");
        setPrepTimeMinutes(recipe.prepTimeMinutes ?? 20);
        setIngredients((recipe.ingredients || []).join("\n"));
        setInstructions((recipe.instructions || []).join("\n"));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }
    if (!ingredients.trim() || !instructions.trim()) {
      setError("Ingredients and instructions are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("categoryId", categoryId || "");
      formData.append("prepTimeMinutes", String(prepTimeMinutes));
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await api(`/recipes/${id}`, {
        method: "PUT",
        body: formData,
      });
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="form-wrap add-recipe">
      <h1>Edit recipe</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Photo
          {imageUrl && (
            <img className="form-preview" src={imageUrl} alt="Current recipe" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </label>
        <label>
          Description
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Category
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Choose a category</option>
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
            value={prepTimeMinutes}
            onChange={(e) => setPrepTimeMinutes(e.target.value)}
          />
        </label>
        <label>
          Ingredients (one per line)
          <textarea rows={5} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </label>
        <label>
          Instructions (one per line)
          <textarea
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn" type="submit">
            Save changes
          </button>
          <button type="button" className="btn secondary" onClick={() => navigate(`/recipes/${id}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
