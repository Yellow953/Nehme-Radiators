import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const WHATSAPP = "9613662887";

function waLink(productName) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `I want to ask you about the ${productName}`
  )}`;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(
          collection(db, "products"),
          where("visible", "==", true)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ["industrial", "commercial", "automotive", "other"];

  return (
    <section className="py-5 bg-secondary-light" id="products">
      <div className="container py-5">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="section-title text-center">Our Products</h2>
            <p className="lead">High-quality radiators for every application</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted">No products available yet.</p>
        ) : (
          <>
            {categories.map((cat) => {
              const catProducts = products.filter((p) => p.category === cat);
              if (catProducts.length === 0) return null;
              return <div key={cat} id={cat} />;
            })}
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
              {categories.flatMap((cat) =>
                products
                  .filter((p) => p.category === cat)
                  .map((product) => (
                    <div className="col" key={product.id}>
                      <div className="card h-100">
                        <img
                          src={product.imageUrl || "/logo1.png"}
                          className="card-img-top product-image"
                          alt={product.name}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{product.name}</h5>
                          {product.price && (
                            <p className="fw-bold text-primary mb-1">
                              ${product.price}
                            </p>
                          )}
                          <p className="card-text flex-grow-1">{product.description}</p>
                          <a
                            href={waLink(product.name)}
                            className="btn-shop-now mt-2"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fab fa-whatsapp"></i>Shop Now
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
