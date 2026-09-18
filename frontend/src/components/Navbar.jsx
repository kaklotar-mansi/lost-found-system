import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <i className="fa-solid fa-magnifying-glass-location"></i> Lost & Found
        </Link>
        <div className="navbar-links">
          <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
          {user ? (
            <>
              <Link to="/report/lost"><i className="fa-solid fa-circle-exclamation"></i> Report Lost</Link>
              <Link to="/report/found"><i className="fa-solid fa-hand-holding"></i> Report Found</Link>
              <Link to="/my-reports"><i className="fa-solid fa-list-check"></i> My Reports</Link>
              <Link to="/dashboard"><i className="fa-solid fa-chart-simple"></i> Dashboard</Link>
              <span className="navbar-user"><i className="fa-solid fa-user"></i> {user.name}</span>
              <button className="btn-link" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><i className="fa-solid fa-right-to-bracket"></i> Login</Link>
              <Link to="/register"><i className="fa-solid fa-user-plus"></i> Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
