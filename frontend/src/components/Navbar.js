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
        <h2 className="nav-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--primary)', flexShrink: 0 }}>
            <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M12 8V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          MediCare
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
            <span className="badge badge-role" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {role === "doctor" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.8 19s1.2-3 7.2-3 7.2 3 7.2 3" />
                  <circle cx="12" cy="8" r="4" />
                </svg>
              )}
              {role === "admin" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              )}
              {role === "patient" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              <span style={{ textTransform: 'capitalize' }}>{role}</span>
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