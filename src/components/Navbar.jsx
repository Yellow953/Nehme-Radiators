export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src="/logo2.png" alt="Nehme Radiators Logo" className="logo-header" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Services
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#industrial">Industrial</a></li>
                <li><a className="dropdown-item" href="#commercial">Commercial</a></li>
                <li><a className="dropdown-item" href="#automotive">Automotive</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#products">Products</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#educational">Educational</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#offers">Offers</a>
            </li>
            <li className="nav-item ms-2">
              <a className="btn btn-primary" href="https://wa.me/+9613662887">
                <i className="fas fa-phone me-2"></i>Call Now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
