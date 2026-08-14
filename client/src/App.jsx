import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage";
import AddRecipePage from "./pages/AddRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route
            path="/recipes/new"
            element={
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            }
          />
          <Route path="/recipes/:id/edit" element={
            <ProtectedRoute>
              <EditRecipePage />
            </ProtectedRoute>
          } />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
