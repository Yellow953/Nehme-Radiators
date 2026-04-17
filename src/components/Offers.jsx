import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const WHATSAPP = "9613662887";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const q = query(
          collection(db, "offers"),
          where("active", "==", true)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOffers(data);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  if (!loading && offers.length === 0) return null;

  return (
    <section className="offers-section bg-secondary-light" id="offers">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="section-title text-center">Special Offers</h2>
            <p className="lead">
              Take advantage of our current promotions and save on quality
              radiator services
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="row">
            {offers.map((offer) => (
              <div className="col-md-6 col-lg-4 mb-4" key={offer.id}>
                <div className="offer-card position-relative">
                  <div className="offer-header">
                    <h5 className="my-5 text-white">{offer.title}</h5>
                  </div>
                  <div className="offer-body text-center">
                    <p className="mb-4">{offer.description}</p>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                        `I want to claim the ${offer.title} offer`
                      )}`}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Claim Offer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
