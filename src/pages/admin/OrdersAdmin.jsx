import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
  increment,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const STATUS_COLOR = { pending: "warning", confirmed: "info", completed: "success", cancelled: "danger" };

const emptyOrder = {
  clientName: "",
  clientPhone: "",
  clientAddress: "",
  notes: "",
  status: "pending",
  discount: 0,
  items: [],
};

function calcSubtotal(items) {
  return items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.unitPrice) || 0), 0);
}

function calcTotal(items, discount) {
  return calcSubtotal(items) - (Number(discount) || 0);
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function statusBadge(status) {
  return (
    <span className={`badge bg-${STATUS_COLOR[status] || "secondary"} text-capitalize`}>{status}</span>
  );
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyOrder);
  const [editId, setEditId] = useState(null);
  const [originalItems, setOriginalItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [catalog, setCatalog] = useState([]);

  async function loadOrders() {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  async function loadCatalog() {
    const snap = await getDocs(collection(db, "products"));
    setCatalog(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => {
    loadOrders();
    loadCatalog();
  }, []);

  function openNew() {
    setForm(emptyOrder);
    setEditId(null);
    setOriginalItems([]);
    setShowModal(true);
  }

  function openEdit(order) {
    const items = order.items || [];
    setForm({
      clientName: order.clientName || "",
      clientPhone: order.clientPhone || "",
      clientAddress: order.clientAddress || "",
      notes: order.notes || "",
      status: order.status || "pending",
      discount: order.discount || 0,
      items,
    });
    setOriginalItems(items);
    setEditId(order.id);
    setShowModal(true);
  }

  function addProduct(productId) {
    if (!productId) return;
    const p = catalog.find((x) => x.id === productId);
    if (!p) return;
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        { productId: p.id, productName: p.name, qty: 1, unitPrice: p.price ?? 0 },
      ],
    }));
  }

  function removeItem(idx) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  function updateItem(idx, field, value) {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));
  }

  async function adjustStock(items, sign) {
    // sign: -1 to deduct, +1 to restore
    const batch = writeBatch(db);
    for (const item of items) {
      if (!item.productId) continue;
      const product = catalog.find((p) => p.id === item.productId);
      if (!product || product.stock == null) continue;
      batch.update(doc(db, "products", item.productId), {
        stock: increment(sign * (Number(item.qty) || 0)),
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  }

  async function handleSave(e) {
    e.preventDefault();
    if (form.items.length === 0) {
      alert("Please add at least one product.");
      return;
    }
    setSaving(true);
    try {
      const subtotal = calcSubtotal(form.items);
      const total = calcTotal(form.items, form.discount);
      const data = { ...form, subtotal, total, updatedAt: serverTimestamp() };

      if (editId) {
        // Restore old stock, deduct new stock
        await adjustStock(originalItems, +1);
        await adjustStock(form.items, -1);
        await updateDoc(doc(db, "orders", editId), data);
      } else {
        await adjustStock(form.items, -1);
        await addDoc(collection(db, "orders"), { ...data, createdAt: serverTimestamp() });
      }

      setShowModal(false);
      loadOrders();
      loadCatalog(); // Refresh catalog to reflect updated stock
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this order?")) return;
    const order = orders.find((o) => o.id === id);
    if (order?.items) await adjustStock(order.items, +1); // Restore stock
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
    loadCatalog();
  }

  async function updateStatus(order, status) {
    await updateDoc(doc(db, "orders", order.id), { status, updatedAt: serverTimestamp() });
    loadOrders();
  }

  const subtotal = calcSubtotal(form.items);
  const total = calcTotal(form.items, form.discount);

  // Group catalog by category for the dropdown
  const catalogByCategory = catalog.reduce((acc, p) => {
    const cat = p.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div>
      <div className="admin-topbar d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-bold">Orders / Invoices</h5>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          <i className="fas fa-plus me-2"></i>New Order
        </button>
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
                    <th>Date</th>
                    <th>Client</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="text-muted small">{formatDate(o.createdAt)}</td>
                      <td className="fw-semibold">{o.clientName}</td>
                      <td>{o.clientPhone}</td>
                      <td>{o.items?.length || 0}</td>
                      <td className="fw-bold">${(o.total || 0).toFixed(2)}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 130 }}
                          value={o.status}
                          onChange={(e) => updateStatus(o, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => setViewOrder(o)} title="View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(o)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(o.id)} title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── View / Invoice Modal ── */}
      {viewOrder && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="d-flex align-items-center gap-3">
                  <img src="/logo1.png" alt="Logo" height="48" />
                  <div>
                    <h5 className="mb-0 fw-bold">Nehme Radiators</h5>
                    <small className="text-muted">Invoice / Order Summary</small>
                  </div>
                </div>
                <button className="btn-close" onClick={() => setViewOrder(null)} />
              </div>
              <div className="modal-body">
                <hr className="mt-2" />
                <div className="row mb-4">
                  <div className="col-sm-6">
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Bill To</p>
                    <p className="fw-bold mb-0">{viewOrder.clientName}</p>
                    {viewOrder.clientPhone && <p className="mb-0">{viewOrder.clientPhone}</p>}
                    {viewOrder.clientAddress && <p className="mb-0 text-muted">{viewOrder.clientAddress}</p>}
                  </div>
                  <div className="col-sm-6 text-sm-end mt-3 mt-sm-0">
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Order Details</p>
                    <p className="mb-1"><strong>Date:</strong> {formatDate(viewOrder.createdAt)}</p>
                    <p className="mb-0"><strong>Status:</strong> {statusBadge(viewOrder.status)}</p>
                  </div>
                </div>
                {viewOrder.notes && (
                  <div className="alert alert-light border small mb-4">
                    <i className="fas fa-sticky-note me-2 text-muted"></i>{viewOrder.notes}
                  </div>
                )}
                <table className="table table-bordered align-middle">
                  <thead style={{ background: "#09162d", color: "white" }}>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewOrder.items?.map((item, i) => (
                      <tr key={i}>
                        <td className="text-muted small">{i + 1}</td>
                        <td>{item.productName}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-end">${Number(item.unitPrice).toFixed(2)}</td>
                        <td className="text-end fw-semibold">
                          ${(Number(item.qty) * Number(item.unitPrice)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    {viewOrder.discount > 0 && (
                      <>
                        <tr>
                          <td colSpan={4} className="text-end text-muted">Subtotal</td>
                          <td className="text-end">${(viewOrder.subtotal || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-end text-muted">Discount</td>
                          <td className="text-end text-danger">−${Number(viewOrder.discount).toFixed(2)}</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td colSpan={4} className="text-end fw-bold fs-6">Total</td>
                      <td className="text-end fw-bold fs-6">${(viewOrder.total || 0).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-secondary" onClick={() => setViewOrder(null)}>Close</button>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <i className="fas fa-print me-2"></i>Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── New / Edit Order Modal ── */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header" style={{ background: "#09162d" }}>
                <div className="d-flex align-items-center gap-3">
                  <img src="/logo1.png" alt="Logo" height="36" />
                  <h5 className="modal-title text-white mb-0">
                    {editId ? "Edit Order" : "New Order"}
                  </h5>
                </div>
                <button className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body p-0">

                  {/* ── Client Info ── */}
                  <div className="p-4 border-bottom">
                    <p className="text-uppercase fw-bold text-muted small mb-3">
                      <i className="fas fa-user me-2"></i>Client Information
                    </p>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold small">Client Name <span className="text-danger">*</span></label>
                        <input
                          className="form-control"
                          placeholder="e.g. Tony Haber"
                          required
                          value={form.clientName}
                          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold small">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="fas fa-phone"></i></span>
                          <input
                            className="form-control"
                            placeholder="+961 ..."
                            value={form.clientPhone}
                            onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold small">Status</label>
                        <select
                          className="form-select"
                          value={form.status}
                          onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-8">
                        <label className="form-label fw-semibold small">Address</label>
                        <div className="input-group">
                          <span className="input-group-text"><i className="fas fa-map-marker-alt"></i></span>
                          <input
                            className="form-control"
                            placeholder="Street, City, Lebanon"
                            value={form.clientAddress}
                            onChange={(e) => setForm({ ...form, clientAddress: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold small">Notes</label>
                        <input
                          className="form-control"
                          placeholder="Optional notes..."
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Order Items ── */}
                  <div className="p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                      <p className="text-uppercase fw-bold text-muted small mb-0">
                        <i className="fas fa-list me-2"></i>Order Items
                      </p>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 240 }}
                        value=""
                        onChange={(e) => { addProduct(e.target.value); e.target.value = ""; }}
                      >
                        <option value="" disabled>+ Add product…</option>
                        {Object.entries(catalogByCategory).map(([cat, products]) => (
                          <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}{p.stock != null ? ` (stock: ${p.stock})` : ""}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {form.items.length === 0 ? (
                      <div className="text-center py-5 bg-light rounded border text-muted">
                        <i className="fas fa-box-open fs-3 mb-2 d-block opacity-50"></i>
                        No items yet. Select a product from the dropdown above.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: "40%" }}>Product</th>
                              <th style={{ width: "12%" }}>Qty</th>
                              <th style={{ width: "20%" }}>Unit Price ($)</th>
                              <th style={{ width: "18%" }} className="text-end">Subtotal</th>
                              <th style={{ width: "10%" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.items.map((item, idx) => {
                              const product = catalog.find((p) => p.id === item.productId);
                              return (
                                <tr key={idx}>
                                  <td>
                                    <div className="fw-semibold small">{item.productName}</div>
                                    {product?.stock != null && (
                                      <div className={`small ${product.stock <= 5 ? "text-danger" : "text-muted"}`}>
                                        {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      min="1"
                                      className="form-control form-control-sm"
                                      value={item.qty}
                                      onChange={(e) => updateItem(idx, "qty", e.target.value)}
                                      required
                                    />
                                  </td>
                                  <td>
                                    <div className="input-group input-group-sm">
                                      <span className="input-group-text">$</span>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="form-control"
                                        placeholder="0.00"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                                        required
                                      />
                                    </div>
                                  </td>
                                  <td className="text-end fw-semibold">
                                    ${((Number(item.qty) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}
                                  </td>
                                  <td className="text-end">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => removeItem(idx)}
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Totals */}
                    {form.items.length > 0 && (
                      <div className="mt-3 ms-auto" style={{ maxWidth: 320 }}>
                        <div className="d-flex justify-content-between py-2 border-top">
                          <span className="text-muted">Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center py-2 border-top">
                          <span className="text-muted">Discount ($)</span>
                          <div className="input-group input-group-sm" style={{ width: 130 }}>
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="form-control text-end"
                              value={form.discount}
                              onChange={(e) => setForm({ ...form, discount: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-between py-2 border-top fw-bold fs-5">
                          <span>Total</span>
                          <span className="text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving
                      ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                      : <><i className="fas fa-save me-2"></i>{editId ? "Update Order" : "Create Order"}</>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
