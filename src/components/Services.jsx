const services = [
  {
    icon: "fas fa-tools",
    title: "Radiator Repair",
    description:
      "Expert repair services for all types of radiators. We fix leaks, replace valves, and restore functionality.",
  },
  {
    icon: "fas fa-industry",
    title: "Custom Manufacturing",
    description:
      "Radiator design and production tailored to your specific requirements and space constraints.",
  },
  {
    icon: "fas fa-truck",
    title: "Maintenance & Installation",
    description:
      "Professional installation, regular maintenance, and efficiency optimization services to extend your radiator's lifespan.",
  },
];

export default function Services() {
  return (
    <section className="py-5" id="services">
      <div className="container py-5">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="section-title text-center">Our Services</h2>
            <p className="lead">
              Comprehensive radiator solutions for automotive, commercial, and
              industrial applications
            </p>
          </div>
        </div>
        <div className="row">
          {services.map((service) => (
            <div className="col-md-4" key={service.title}>
              <div className="service-box text-center">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h4>{service.title}</h4>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
