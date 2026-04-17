import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";

const CATEGORIES = ["industrial", "commercial", "automotive", "other"];

const empty = {
  name: "",
  description: "",
  price: "",
  category: "other",
  stock: "",
  visible: true,
  imageUrl: "",
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef();

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  function openNew() {
    setForm(empty);
    setEditId(null);
    setImageFile(null);
    setPreview("");
    setShowModal(true);
  }

  function openEdit(product) {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "other",
      stock: product.stock ?? "",
      visible: product.visible ?? true,
      imageUrl: product.imageUrl || "",
    });
    setEditId(product.id);
    setImageFile(null);
    setPreview(product.imageUrl || "");
    setShowModal(true);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const data = {
        ...form,
        price: form.price ? Number(form.price) : null,
        stock: form.stock !== "" ? Number(form.stock) : null,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, "products", editId), data);
      } else {
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }

      setShowModal(false);
      loadProducts();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }

  async function toggleVisible(product) {
    await updateDoc(doc(db, "products", product.id), { visible: !product.visible });
    loadProducts();
  }

  return (
    <div>
      <div className="admin-topbar d-flex align-items-center justify-content-between">
        <h5 className="mb-0 fw-bold">Products</h5>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          <i className="fas fa-plus me-2"></i>Add Product
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
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Visible</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={p.imageUrl || "/logo1.png"}
                          alt={p.name}
                          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                        />
                      </td>
                      <td className="fw-semibold">{p.name}</td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">{p.category}</span>
                      </td>
                      <td>{p.price != null ? `$${p.price}` : "—"}</td>
                      <td>{p.stock ?? "—"}</td>
                      <td>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={p.visible}
                            onChange={() => toggleVisible(p)}
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEdit(p)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        No products yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editId ? "Edit Product" : "Add Product"}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Name *</label>
                    <input
                      className="form-control"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="text-capitalize">
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                  <div className="col-md-9">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Stock</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      ref={fileRef}
                      onChange={handleImageChange}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-2 rounded"
                        style={{ height: 120, objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="visibleCheck"
                        checked={form.visible}
                        onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="visibleCheck">
                        Show on website
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Product"}
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
