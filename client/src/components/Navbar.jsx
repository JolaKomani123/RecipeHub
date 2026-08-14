import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();

  return (
    <header className="nav">
      <Link to="/" className="brand">
        RecipeHub
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recipes">Recipes</NavLink>
        {isLoggedIn && <NavLink to="/recipes/new">Add recipe</NavLink>}
        {isLoggedIn && <NavLink to="/favorites">Favorites</NavLink>}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        {!isLoggedIn && <NavLink to="/login">Login</NavLink>}
        {!isLoggedIn && <NavLink to="/register">Register</NavLink>}
        {isLoggedIn && (
          <button type="button" className="linkish" onClick={logout}>
            Logout ({user?.name})
          </button>
        )}
      </nav>
    </header>
  );
}
