import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserGraduate, FaUserTie, FaUserShield } from "react-icons/fa";

function Navbar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo">
          🎉 College Events
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          {/* Show Events link only when logged in */}
          {user && (
            <Link
              to="/events"
              className={location.pathname === "/events" ? "active" : ""}
            >
              Events
            </Link>
          )}

          {/* Only organizers can create events */}
          {user && user.role === "organizer" && (
            <Link
              to="/create"
              className={location.pathname === "/create" ? "active" : ""}
            >
              Create Event
            </Link>
          )}

          {/* Only admins can access Admin Panel */}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className={location.pathname === "/admin" ? "active" : ""}
            >
              Admin Panel
            </Link>
          )}

          {/* If no user, show login/signup */}
          {!user ? (
            <>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={location.pathname === "/signup" ? "active" : ""}
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="nav-user">
              <span>
                {user.role === "student" ? (
                  <FaUserGraduate />
                ) : user.role === "admin" ? (
                  <FaUserShield />
                ) : (
                  <FaUserTie />
                )}{" "}
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
