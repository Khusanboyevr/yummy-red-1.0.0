import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { admin, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { to: '/', label: 'Asosiy' },
    { to: '/about', label: 'Biz Haqimizda' },
    { to: '/menu', label: 'Menyu' },
    { to: '/combos', label: 'Combo' },
    { to: '/gallery', label: 'Galereya' },
    { to: '/contact', label: 'Aloqa' },
  ];

  return (
    <>
      <header id="header" className="header d-flex align-items-center sticky-top">
        <div
          className="container position-relative d-flex align-items-center justify-content-between"
          style={{ gap: '8px' }}
        >
          {/* Logo */}
          <Link to="/" className="logo d-flex align-items-center" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <h1 className="sitename mb-0">GoPizza</h1>
            <span>.</span>
          </Link>

          {/* Desktop Nav */}
          <nav id="navmenu" className="navmenu d-none d-xl-flex" style={{ flex: 1 }}>
            <ul className="d-flex align-items-center gap-3 list-unstyled mb-0">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side actions */}
          <div className="d-flex align-items-center" style={{ gap: '10px', flexShrink: 0 }}>
            {/* Cart icon */}
            <Link
              to="/cart"
              className="position-relative d-flex align-items-center"
              style={{ color: 'var(--heading-color)', textDecoration: 'none' }}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span
                  className="position-absolute translate-middle badge rounded-pill bg-danger"
                  style={{ top: '0px', left: '100%', fontSize: '0.65rem' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Stol Band Qilish - hide on very small screens, show on sm+ */}
            <div className="d-none d-sm-block">
              {admin ? (
                <button className="btn-getstarted" onClick={() => { logout(); navigate('/'); }}>
                  Admin Chiqish
                </button>
              ) : user ? (
                <Link className="btn-getstarted" to="/account">
                  Hisobim
                </Link>
              ) : (
                <Link className="btn-getstarted" to="/login">
                  Kirish
                </Link>
              )}
            </div>

            {/* Burger button - only on mobile */}
            <button
              className="d-xl-none"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--heading-color)'
              }}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1040,
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '260px',
          background: '#fff',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          zIndex: 1050,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          overflowY: 'auto',
        }}
      >
        {/* Drawer header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--heading-color)' }}>
            GoPizza<span style={{ color: 'var(--accent-color)' }}>.</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--heading-color)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav>
          <ul className="list-unstyled mb-0">
            {navLinks.map(({ to, label }) => (
              <li key={to} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  style={({ isActive }) => ({
                    display: 'block',
                    padding: '12px 0',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: isActive ? 'var(--accent-color)' : 'var(--heading-color)',
                    textDecoration: 'none',
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Stol Band Qilish in drawer */}
        <div className="mt-4">
          {admin ? (
            <button
              className="btn-getstarted w-100"
              onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
            >
              Admin Chiqish
            </button>
          ) : user ? (
            <Link className="btn-getstarted d-block text-center" to="/account" onClick={() => setMobileOpen(false)}>
              Hisobim
            </Link>
          ) : (
            <Link className="btn-getstarted d-block text-center" to="/login" onClick={() => setMobileOpen(false)}>
              Kirish
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
