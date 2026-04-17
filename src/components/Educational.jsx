const facts = [
  {
    icon: "fas fa-flag",
    title: "Proudly Lebanese Quality",
    text: "Nehme Radiators manufactures high quality radiators that exceed market standards at competitive prices, proudly made in Lebanon.",
  },
  {
    icon: "fas fa-car",
    title: "Complete Car Service",
    text: "We can service your car from A to Z. There are times you just need us and not the mechanic for all your radiator and cooling system needs.",
  },
  {
    icon: "fas fa-temperature-low",
    title: "Radiator Function",
    text: "A radiator's primary role is to cool down the engine coolant, preventing overheating and ensuring optimal engine performance.",
  },
  {
    icon: "fas fa-clock",
    title: "Coolant Replacement",
    text: "The coolant/anti-freeze must be replaced every 30,000 km or every year to maintain optimal cooling system performance.",
  },
  {
    icon: "fas fa-user-cog",
    title: "Professional Maintenance",
    text: "Your cooling system must be checked yearly by a professional technician to ensure durability and prevent costly repairs.",
  },
  {
    icon: "fas fa-shield-alt",
    title: "Quality Assurance",
    text: "With over 55 years of experience, we guarantee the highest quality materials and workmanship in every radiator we produce and service.",
  },
];

export default function Educational() {
  return (
    <section className="educational-section" id="educational">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-lg-8 mx-auto">
            <h2 className="section-title text-center">Did You Know?</h2>
            <p className="lead">Important facts about radiators and our services</p>
          </div>
        </div>
        <div className="row">
          {facts.map((fact) => (
            <div className="col-md-6 col-lg-4 mb-4" key={fact.title}>
              <div className="fact-box">
                <div className="fact-icon">
                  <i className={fact.icon}></i>
                </div>
                <h4>{fact.title}</h4>
                <p>{fact.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
