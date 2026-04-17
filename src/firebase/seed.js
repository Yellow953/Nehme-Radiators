import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

const products = [
  {
    name: "Industrial Radiators",
    category: "industrial",
    description: "Heavy-duty radiators built for industrial machinery and large-scale cooling systems. Custom-manufactured to your specifications.",
    price: null,
    stock: null,
    imageUrl: "/industrial-radiators.png",
    visible: true,
  },
  {
    name: "Commercial Radiators",
    category: "commercial",
    description: "Reliable radiators for buses, trucks, generators, and commercial vehicles. Built to handle demanding daily operations.",
    price: null,
    stock: null,
    imageUrl: "/commercial-radiators.png",
    visible: true,
  },
  {
    name: "Automotive Radiators",
    category: "automotive",
    description: "High-quality radiators for all car makes and models. Expert repair and replacement for optimal engine cooling.",
    price: null,
    stock: null,
    imageUrl: "/1.jpg",
    visible: true,
  },
  {
    name: "Radiator Caps",
    category: "automotive",
    description: "Replacement radiator caps for all vehicle types. Maintains proper system pressure for efficient cooling.",
    price: null,
    stock: null,
    imageUrl: "/caps.png",
    visible: true,
  },
  {
    name: "Brass Tanks",
    category: "automotive",
    description: "Durable brass radiator tanks, custom-fabricated or replacement. Corrosion-resistant and built to last.",
    price: null,
    stock: null,
    imageUrl: "/brass-tanks.png",
    visible: true,
  },
  {
    name: "Plastic Tanks",
    category: "automotive",
    description: "High-quality plastic radiator tanks for modern vehicles. Precision-fit replacements to restore factory performance.",
    price: null,
    stock: null,
    imageUrl: "/plastic-tanks.png",
    visible: true,
  },
  {
    name: "Deutschol Antifreez",
    category: "other",
    description: "Premium antifreeze coolant that protects your engine from extreme temperatures and corrosion year-round.",
    price: null,
    stock: null,
    imageUrl: "/Deutschol Antifreez.png",
    visible: true,
  },
  {
    name: "Deutschol 15W40 Diesel Oil",
    category: "other",
    description: "High-performance diesel engine oil providing superior protection and extended engine life for heavy-duty engines.",
    price: null,
    stock: null,
    imageUrl: "/Deutschol 15W40 Diesel Oil.png",
    visible: true,
  },
  {
    name: "Deutschol PC MAX I 10W40 Oil",
    category: "other",
    description: "Multi-grade engine oil engineered for modern diesel engines, delivering excellent performance and fuel economy.",
    price: null,
    stock: null,
    imageUrl: "/Deutschol PC MAX I 1040 10W40 Oil.png",
    visible: true,
  },
  {
    name: "Deutschol PC MAX IV 5W30 Oil",
    category: "other",
    description: "Fully synthetic low-viscosity engine oil for modern passenger cars, reducing fuel consumption and emissions.",
    price: null,
    stock: null,
    imageUrl: "/Deutschol PC MAX IV 0530 5W30 oil.png",
    visible: true,
  },
  {
    name: "Holts Radiator Leak Repair",
    category: "other",
    description: "Fast-acting radiator sealant that permanently repairs leaks without draining the system. Safe for all metals and plastics.",
    price: null,
    stock: null,
    imageUrl: "/Holts Radiator Leak Repair.png",
    visible: true,
  },
  {
    name: "Holts Sealit Coolant Leak Repair",
    category: "other",
    description: "Advanced formula coolant leak sealer that finds and seals leaks in the entire cooling system.",
    price: null,
    stock: null,
    imageUrl: "/Holts Sealit Coolant Leak Repair.png",
    visible: true,
  },
  {
    name: "Holts Cooling System Cleaner",
    category: "other",
    description: "Removes scale, rust, and sludge from the entire cooling system, restoring efficiency and preventing overheating.",
    price: null,
    stock: null,
    imageUrl: "/Holts Cooling System Cleaner.png",
    visible: true,
  },
  {
    name: "Holts Intensive Cleaning Screen Wash",
    category: "other",
    description: "Concentrated screen wash for crystal-clear visibility in all weather conditions. Removes dirt, grease, and road film.",
    price: null,
    stock: null,
    imageUrl: "/Holts Intensive Cleaning Screen Wash.png",
    visible: true,
  },
  {
    name: "Redex Petrol System Cleaner",
    category: "other",
    description: "Cleans fuel injectors, carburettors, and intake valves to restore engine performance and improve fuel efficiency.",
    price: null,
    stock: null,
    imageUrl: "/Redex Petrol System Cleaner.png",
    visible: true,
  },
];

const offers = [
  {
    title: "Free Maintenance Checkup",
    description: "Get a complimentary cooling system inspection with any radiator repair or replacement service. Our experts will assess hoses, thermostat, water pump, and coolant levels at no extra charge.",
    active: true,
  },
  {
    title: "Free Anti-Freeze with Radiator Service",
    description: "Receive a free bottle of premium antifreeze coolant when you bring your vehicle in for a full radiator service. Keep your engine protected through every season.",
    active: true,
  },
  {
    title: "Free Windshield Fluid",
    description: "Every customer who visits our workshop gets a complimentary bottle of windshield washer fluid. A small gift to keep your vision clear on Lebanese roads.",
    active: true,
  },
];

export async function seedDatabase() {
  const existing = await getDocs(collection(db, "products"));
  if (existing.size > 0) {
    return { skipped: true, message: "Database already has products — skipping seed." };
  }

  const productPromises = products.map((p) =>
    addDoc(collection(db, "products"), { ...p, createdAt: serverTimestamp() })
  );
  const offerPromises = offers.map((o) =>
    addDoc(collection(db, "offers"), { ...o, createdAt: serverTimestamp() })
  );

  await Promise.all([...productPromises, ...offerPromises]);
  return { skipped: false, message: `Seeded ${products.length} products and ${offers.length} offers.` };
}
