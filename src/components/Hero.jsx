export default function Hero() {
  return (
    <section className="hero">
      <div className="container text-center">
        <img src="/logo1.png" alt="Nehme Radiators" width="150" height="150" />
        <h1 className="text-white display-3 fw-bold mb-4">
          Expert radiator manufacturing and maintenance
        </h1>
        <p className="lead mb-5">
          Trusted specialists in radiator solutions for over 55 years. Quality
          service and custom manufacturing for all your overheating needs.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <a href="#services" className="btn btn-outline-light btn-lg px-4">
            Our Services
          </a>
        </div>
      </div>
    </section>
  );
}
