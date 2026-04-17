import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const empty = { title: "", description: "", active: true };

export default function OffersAdmin() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadOffers() {
    const snap = await getDocs(collection(db, "offers"));
    setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { loadOffers(); }, []);

  function openNew() {
    setForm(empty);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(offer) {
    setForm({ title: offer.title, description: offer.description, active: offer.active });
    setEditId(offer.id);
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "offers", editId), { ...form, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "offers"), { ...form, createdAt: serverTimestamp() });
      }
      setShowModal(false);
      loadOffers();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this offer?")) return;
    await deleteDoc(doc(db, "offers", id));
    loadOffers();
  }

  async function toggleActive(offer) {
    await updateDoc(doc(db, "offers", offer.id), { active: !offer.active });
    loadOffers();
  }

  return (
    <div>
      <div className="admin-topbar d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-bold">Offers</h5>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          <i className="fas fa-plus me-2"></i>Add Offer
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
                    <th>Title</th>
                    <th>Description</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => (
                    <tr key={o.id}>
                      <td className="fw-semibold">{o.title}</td>
                      <td className="text-muted">{o.description}</td>
                      <td>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={o.active}
                            onChange={() => toggleActive(o)}
                          />
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(o)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(o.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {offers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">No offers yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit Offer" : "Add Offer"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Title *</label>
                    <input
                      className="form-control"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      required
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="activeCheck"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="activeCheck">
                      Active (show on website)
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Offer"}
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
