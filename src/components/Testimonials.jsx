const testimonials = [
  {
    name: "Tony Haber",
    role: "",
    text: "I replaced my original Toyota Radiator with Nehme Radiators. A better Radiator was installed it was thicker metal and higher quality as they flushed everything and cleaned all with water every single place not one piece of rust was left.",
  },
  {
    name: "Layla Haddad",
    role: "Homeowner",
    text: "They repaired my antique radiator perfectly and at a reasonable price. I couldn't be happier with the results and would highly recommend their services.",
  },
  {
    name: "Samir Farah",
    role: "Building Manager",
    text: "We've been using Nehme Radiators for all our building's industrial generators needs for years. Their maintenance service keeps our systems running efficiently all winter.",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonial" id="testimonials">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="section-title text-center">What Our Clients Say</h2>
            <p className="lead">
              Trusted by businesses and vehicle owners throughout Lebanon
            </p>
          </div>
        </div>
        <div className="row">
          {testimonials.map((t) => (
            <div className="col-md-4 mb-4" key={t.name}>
              <div className="testimonial-card">
                <div className="d-flex align-items-center mb-4">
                  <img
                    src="/default_profile.png"
                    alt={t.name}
                    className="testimonial-img me-3"
                  />
                  <div>
                    <h5 className="mb-0">{t.name}</h5>
                    <span className="text-muted">{t.role}</span>
                  </div>
                </div>
                <p className="mb-0">"{t.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
