import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { seedDatabase } from "../../firebase/seed";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, offers: 0, orders: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [prodSnap, offerSnap, orderSnap, pendingSnap, recentSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(query(collection(db, "offers"), where("active", "==", true))),
      getDocs(collection(db, "orders")),
      getDocs(query(collection(db, "orders"), where("status", "==", "pending"))),
      getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5))),
    ]);

    setStats({
      products: prodSnap.size,
      offers: offerSnap.size,
      orders: orderSnap.size,
      pending: pendingSnap.size,
    });

    setRecentOrders(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const allProducts = prodSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setLowStock(allProducts.filter((p) => p.stock != null && p.stock <= 5));
  }

  async function handleSeed() {
    setSeeding(true);
    setSeedMsg("");
    try {
      const result = await seedDatabase();
      setSeedMsg(result.message);
      if (!result.skipped) load();
    } catch (e) {
      setSeedMsg("Error: " + e.message);
    } finally {
      setSeeding(false);
    }
  }

  const statCards = [
    { label: "Total Products", value: stats.products, icon: "fas fa-box-open", color: "primary", to: "/admin/products" },
    { label: "Active Offers", value: stats.offers, icon: "fas fa-tag", color: "success", to: "/admin/offers" },
    { label: "Total Orders", value: stats.orders, icon: "fas fa-file-invoice", color: "info", to: "/admin/orders" },
    { label: "Pending Orders", value: stats.pending, icon: "fas fa-clock", color: "warning", to: "/admin/orders" },
  ];

  const statusColor = { pending: "warning", confirmed: "info", completed: "success", cancelled: "danger" };

  return (
    <div>
      <div className="admin-topbar d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-bold">Dashboard</h5>
        {stats.products === 0 && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleSeed}
            disabled={seeding}
            title="Seed products & offers into Firestore (runs once)"
          >
            <i className="fas fa-database me-1"></i>
            {seeding ? "Seeding…" : "Seed Database"}
          </button>
        )}
      </div>

      <div className="p-4">
        {seedMsg && (
          <div className="alert alert-info alert-dismissible mb-4">
            {seedMsg}
            <button type="button" className="btn-close" onClick={() => setSeedMsg("")} />
          </div>
        )}

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          {statCards.map((card) => (
            <div className="col-sm-6 col-xl-3" key={card.label}>
              <Link to={card.to} className="text-decoration-none">
                <div className="card border-0 shadow-sm h-100 dashboard-stat-card">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div
                      className={`text-${card.color} bg-${card.color} bg-opacity-10 rounded-3 p-3`}
                      style={{ fontSize: "1.5rem", lineHeight: 1 }}
                    >
                      <i className={card.icon}></i>
                    </div>
                    <div>
                      <div className="fs-3 fw-bold text-dark">{card.value}</div>
                      <div className="text-muted small">{card.label}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row g-3">
          {/* Recent Orders */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Recent Orders</h6>
                <Link to="/admin/orders" className="small">View all</Link>
              </div>
              <div className="card-body p-0">
                {recentOrders.length === 0 ? (
                  <p className="text-muted text-center py-4 small">No orders yet.</p>
                ) : (
                  <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th>Client</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={o.id}>
                          <td className="fw-semibold">{o.clientName || "—"}</td>
                          <td>${o.total?.toFixed(2) ?? "—"}</td>
                          <td>
                            <span className={`badge bg-${statusColor[o.status] || "secondary"} text-capitalize`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="text-muted">
                            {o.createdAt?.toDate
                              ? o.createdAt.toDate().toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Low Stock + Quick Actions */}
          <div className="col-lg-5 d-flex flex-column gap-3">
            {/* Low Stock */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">
                  <i className="fas fa-exclamation-triangle text-warning me-2"></i>Low Stock
                </h6>
                <Link to="/admin/inventory" className="small">Manage</Link>
              </div>
              <div className="card-body">
                {lowStock.length === 0 ? (
                  <p className="text-muted small mb-0">All products have sufficient stock.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {lowStock.map((p) => (
                      <li key={p.id} className="d-flex justify-content-between align-items-center py-1 border-bottom small">
                        <span>{p.name}</span>
                        <span className={`badge ${p.stock === 0 ? "bg-danger" : "bg-warning text-dark"}`}>
                          {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-0">
                <h6 className="fw-bold mb-0">Quick Actions</h6>
              </div>
              <div className="card-body d-flex flex-column gap-2">
                <Link to="/admin/orders" className="btn btn-primary btn-sm">
                  <i className="fas fa-plus me-2"></i>New Order
                </Link>
                <Link to="/admin/products" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-box-open me-2"></i>Manage Products
                </Link>
                <Link to="/admin/offers" className="btn btn-outline-success btn-sm">
                  <i className="fas fa-tag me-2"></i>Manage Offers
                </Link>
                <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-eye me-2"></i>View Live Site
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
