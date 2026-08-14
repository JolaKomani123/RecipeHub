import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import recipeRoutes from "./routes/recipes.js";
import categoryRoutes from "./routes/categories.js";
import favoriteRoutes from "./routes/favorites.js";
import adminRoutes from "./routes/admin.js";
import { uploadsDir } from "./upload.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://recipe-hub-beige.vercel.app",
  "http://localhost:5173",
]
  .filter(Boolean)
  .flatMap((value) => value.split(",").map((item) => item.trim()));

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "RecipeHub API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Image is too large (max 5MB)" });
  }
  if (err.message === "Please upload an image file") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Server error" });
});

app.listen(port, () => {
  console.log(`RecipeHub API running on http://localhost:${port}`);
});
