import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function AddRecipePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/categories").then(setCategories).catch((err) => setError(err.message));
  }, []);

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
      const recipe = await api("/recipes", {
        method: "POST",
        body: formData,
      });
      navigate(`/recipes/${recipe.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="form-wrap add-recipe">
      <h1>Add a recipe</h1>
      <p className="muted">Fill in your own details. A new card will show on Home and Recipes.</p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Photo
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
        <button className="btn" type="submit">
          Save recipe
        </button>
      </form>
    </div>
  );
}
