import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "fas fa-tachometer-alt", end: true },
  { to: "/admin/products", label: "Products", icon: "fas fa-box-open" },
  { to: "/admin/offers", label: "Offers", icon: "fas fa-tag" },
  { to: "/admin/orders", label: "Orders", icon: "fas fa-file-invoice" },
  { to: "/admin/inventory", label: "Inventory", icon: "fas fa-warehouse" },
];

export default function AdminLayout() {
  const [checking, setChecking] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin/login");
      setChecking(false);
    });
    return unsub;
  }, [navigate]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await signOut(auth);
    navigate("/admin/login");
  }

  if (checking) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ maxWidth: "100vw", overflow: "hidden" }}>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logo1.png" alt="Logo" width="36" />
            <span className="sidebar-logo-text text-white-50 small">Admin Panel</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => mobileOpen ? setMobileOpen(false) : setCollapsed((c) => !c)}
            title={mobileOpen ? "Close sidebar" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`fas ${mobileOpen ? "fa-times" : collapsed ? "fa-angles-right" : "fa-angles-left"}`}></i>
          </button>
        </div>

        {/* Nav */}
        <nav className="nav flex-column mt-2 flex-grow-1">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className="nav-link" title={collapsed ? label : undefined}>
              <i className={icon}></i>
              <span className="nav-link-text">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="btn btn-outline-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt flex-shrink-0"></i>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`admin-content flex-grow-1 ${collapsed ? "sidebar-collapsed" : ""}`}>
        {/* Mobile topbar hamburger */}
        <div className="d-md-none bg-white border-bottom px-3 py-2 d-flex align-items-center gap-3" style={{ position: "sticky", top: 0, zIndex: 98 }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <img src="/logo1.png" alt="Logo" height="28" />
          <span className="fw-bold small">Nehme Radiators Admin</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
