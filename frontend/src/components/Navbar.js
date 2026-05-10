import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to={token ? `/${role}` : "/"} style={{textDecoration: 'none'}}>
        <h2 className="nav-brand">
          <span style={{fontSize: '1.8rem'}}>🏥</span> MediCare
        </h2>
      </Link>

      <div className="center-flex">
        {!token ? (
          <div className="nav-links">
            <Link to="/" style={{color: 'var(--text-main)', marginRight: '1rem'}}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{color: 'white', padding: '0.5rem 1.2rem'}}>Register</Link>
          </div>
        ) : (
          <div className="center-flex" style={{gap: '1rem'}}>
            <span className="badge badge-role">
              {role === "doctor" ? "👨‍⚕️ Doctor" : role === "admin" ? "🛡️ Admin" : "🧑 Patient"}
            </span>

            <button onClick={handleLogout} className="btn btn-danger" style={{padding: '0.4rem 1rem'}}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;