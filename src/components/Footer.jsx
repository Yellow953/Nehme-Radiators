export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg col-md-6 mb-5 mb-lg-0">
            <div className="text-center">
              <img src="/logo1.png" alt="Nehme Radiators Logo" width="100" height="100" className="mb-4" />
              <img src="/logo2.png" alt="Nehme Radiators Logo" style={{ width: "80%" }} />
            </div>
          </div>

          <div className="col-lg col-md-6 mb-4 mb-lg-0">
            <h5>About Nehme Radiators</h5>
            <p>
              Lebanon's premier radiator repair and manufacturing specialists with
              over 55 years of experience serving automotive, industrial and
              commercial clients.
            </p>
            <div className="social-icons mt-4">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="https://wa.me/+9613662887"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>

          <div className="col-lg col-md-6 mb-4 mb-lg-0">
            <h5>Services</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#services">Radiator Repair</a></li>
              <li className="mb-2"><a href="#services">Custom Manufacturing</a></li>
              <li className="mb-2"><a href="#services">Installation</a></li>
              <li className="mb-2"><a href="#services">Maintenance</a></li>
            </ul>
          </div>

          <div className="col-lg col-md-6 mb-4 mb-lg-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#about">About Us</a></li>
              <li className="mb-2"><a href="#services">Services</a></li>
              <li className="mb-2"><a href="#products">Products</a></li>
              <li className="mb-2"><a href="#testimonials">Testimonials</a></li>
              <li className="mb-2"><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="col-lg col-md-6 mb-4 mb-lg-0">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="https://maps.app.goo.gl/yTPYbmHzMFdL2W3q8" target="_blank" rel="noreferrer" className="nav-link">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Mkalless Main Road Industrial area Nehme Building, Beirut, Lebanon
                </a>
              </li>
              <li className="mb-2"><i className="fas fa-phone me-2"></i>+961 1 683 029</li>
              <li className="mb-2"><i className="fas fa-phone me-2"></i>+961 1 683 049</li>
              <li className="mb-2"><i className="fas fa-phone me-2"></i>+961 3 662 887</li>
              <li className="mb-2"><i className="fas fa-envelope me-2"></i>info@nehmeradiators.com</li>
              <li className="mb-2"><i className="fas fa-clock me-2"></i>Mon-Fri: 8AM-4PM, Sat: 8AM-1PM</li>
            </ul>
          </div>
        </div>

        <hr className="bg-light my-5" />

        <div className="row">
          <div className="col-12">
            <p className="text-center mb-0">
              © 2025 Nehme Radiators. All Rights Reserved. Developed by{" "}
              <a href="https://yellowtech.dev" target="_blank" rel="noreferrer" className="text-decoration-none text-warning">
                YellowTech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
