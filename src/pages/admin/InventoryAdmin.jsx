import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function InventoryAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  async function saveStock(id) {
    setSaving(true);
    await updateDoc(doc(db, "products", id), {
      stock: Number(editStock),
      updatedAt: serverTimestamp(),
    });
    setSaving(false);
    setEditingId(null);
    loadProducts();
  }

  function stockBadge(stock) {
    if (stock == null) return <span className="badge bg-secondary">N/A</span>;
    if (stock === 0) return <span className="badge bg-danger">Out of stock</span>;
    if (stock <= 5) return <span className="badge bg-warning text-dark">Low: {stock}</span>;
    return <span className="badge bg-success">{stock} in stock</span>;
  }

  return (
    <div>
      <div className="admin-topbar">
        <h5 className="mb-0 fw-bold">Inventory</h5>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={p.imageUrl || "/logo1.png"}
                            alt={p.name}
                            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                          />
                          <span className="fw-semibold">{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">{p.category}</span>
                      </td>
                      <td>{p.price != null ? `$${p.price}` : "—"}</td>
                      <td>{stockBadge(p.stock)}</td>
                      <td>
                        {editingId === p.id ? (
                          <div className="d-flex gap-2 align-items-center">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm"
                              style={{ width: 90 }}
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                            />
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => saveStock(p.id)}
                              disabled={saving}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setEditingId(p.id);
                              setEditStock(p.stock ?? 0);
                            }}
                          >
                            <i className="fas fa-edit me-1"></i>Update Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
