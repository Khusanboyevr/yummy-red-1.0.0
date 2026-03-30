import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container position-relative d-flex align-items-center justify-content-between">
        <Link to="/" className="logo d-flex align-items-center me-auto me-xl-0">
          <h1 className="sitename">GoPizza</h1>
          <span>.</span>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Asosiy</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>Biz Haqimizda</NavLink></li>
            <li><NavLink to="/menu" className={({ isActive }) => isActive ? "active" : ""}>Menyu</NavLink></li>
            <li><NavLink to="/gallery" className={({ isActive }) => isActive ? "active" : ""}>Galereya</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Aloqa</NavLink></li>

          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>

        <div className="d-flex align-items-center gap-3">
          <Link to="/cart" className="position-relative d-flex align-items-center" style={{ color: "var(--heading-color)", textDecoration: "none" }}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span 
                className="position-absolute translate-middle badge rounded-pill bg-danger"
                style={{ top: "0px", left: "100%", fontSize: "0.65rem" }}
              >
                {cartCount}
              </span>
            )}
          </Link>
          {admin ? (
            <button className="btn-getstarted" onClick={() => { logout(); navigate('/'); }}>Chiqish</button>
          ) : (
            <Link className="btn-getstarted" to="/contact">Stol Band Qilish</Link>
          )}
        </div>
      </div>
    </header>
  );
}
