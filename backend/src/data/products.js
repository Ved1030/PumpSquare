export const products = [
  {
    id: "progressive-cavity-pumps",
    name: "Progressive Cavity Pumps",
    aliases: ["progressive cavity pump", "pc pumps", "pc pump", "eccentric screw pump", "eccentric screw pumps"],
    href: "/products/progressive-cavity-pumps",
    description: "Progressive cavity pumps are positive displacement pumps that use a helical rotor and a double-threaded helical stator to create a continuous flow. These pumps are ideal for handling viscous, abrasive, and shear-sensitive fluids.",
    series: ["Standard Series", "Heavy Duty Series", "Sanitary Series"],
    features: [
      "Smooth, pulsation-free flow",
      "Self-priming capability",
      "Handles viscous and abrasive fluids",
      "Low shear rate for sensitive products",
      "Reversible flow direction",
      "Compact design with high efficiency"
    ],
    applications: [
      "Wastewater treatment",
      "Chemical processing",
      "Food and beverage",
      "Oil and gas",
      "Paper and pulp",
      "Ceramics and mining"
    ],
    specifications: {
      "Capacity": ["Up to 500 m³/hr"],
      "Pressure": ["Up to 48 bar"],
      "Temperature": ["-20°C to 150°C"],
      "Viscosity": ["Up to 1,000,000 cSt"],
      "Sizes": ["25mm to 300mm"],
      "Drive": ["Direct coupled, belt drive, VFD"]
    },
    materials: {
      "Stator": "Natural rubber, NBR, EPDM, Viton, PTFE",
      "Rotor": "Chrome plated steel, Stainless steel 316, Hardened tool steel",
      "Body": "Cast iron, Stainless steel 316, Alloy steel"
    }
  },
  {
    id: "triple-screw-pumps",
    name: "Triple Screw Pumps",
    aliases: ["triple screw pump", "three screw pump", "three screw pumps"],
    href: "/products/triple-screw-pumps",
    description: "Triple screw pumps are high-performance positive displacement pumps with three intermeshing screws. They provide smooth, pulsation-free flow and are ideal for lubricating oil, hydraulic, and fuel applications.",
    series: ["Low Pressure Series", "Medium Pressure Series", "High Pressure Series"],
    features: [
      "Extremely low noise and vibration",
      "High efficiency across wide operating range",
      "Pulsation-free continuous flow",
      "Self-lubricating screw design",
      "Bidirectional operation capability",
      "Compact and robust construction"
    ],
    applications: [
      "Power generation lubrication",
      "Marine engine lubrication",
      "Hydraulic systems",
      "Fuel oil transfer",
      "Industrial gearboxes",
      "Turbine lubrication"
    ],
    specifications: {
      "Capacity": ["Up to 1,500 m³/hr"],
      "Pressure": ["Up to 100 bar"],
      "Temperature": ["-10°C to 180°C"],
      "Viscosity": ["2 to 760 cSt"],
      "Sizes": ["40mm to 400mm"],
      "Drive": ["Direct coupled, motor mounted"]
    },
    materials: {
      "Screws": "Hardened alloy steel, Nitride treated",
      "Casing": "Cast iron, Ductile iron, Steel",
      "Bearings": "Product lubricated, External lubrication optional"
    }
  },
  {
    id: "external-gear-pumps",
    name: "External Gear Pumps",
    aliases: ["external gear pump", "gear pump", "gear pumps"],
    href: "/products/external-gear-pumps",
    description: "External gear pumps use two identical gears rotating against each other to create flow. They are simple, reliable, and widely used for clean, lubricating fluids in industrial applications.",
    series: ["Standard Series", "High Pressure Series", "Magnetically Coupled Series"],
    features: [
      "Simple, robust construction",
      "High pressure capability",
      "Bidirectional operation",
      "Compact design",
      "Cost-effective solution",
      "Easy maintenance"
    ],
    applications: [
      "Hydraulic power units",
      "Lubrication systems",
      "Fuel oil systems",
      "Chemical dosing",
      "Cooling systems",
      "Filtration systems"
    ],
    specifications: {
      "Capacity": ["Up to 300 m³/hr"],
      "Pressure": ["Up to 250 bar"],
      "Temperature": ["-20°C to 200°C"],
      "Viscosity": ["10 to 100,000 cSt"],
      "Sizes": ["15mm to 150mm"],
      "Drive": ["Direct coupled, close coupled, bell housing"]
    },
    materials: {
      "Gears": "Hardened steel, Cast iron, Stainless steel",
      "Body": "Cast iron, Ductile iron, Stainless steel",
      "Bearings": "Product lubricated, External optional"
    }
  },
  {
    id: "twin-screw-pumps",
    name: "Twin Screw Pumps",
    aliases: ["twin screw pump", "twin screw pumps", "two screw pump", "two screw pumps"],
    href: "/products/twin-screw-pumps",
    description: "Twin screw pumps feature two intermeshing screws that provide smooth, non-pulsating flow. They excel in handling multiphase fluids and are widely used in oil & gas, marine, and process industries.",
    series: ["Standard Series", "Multiphase Series", "Hygienic Series"],
    features: [
      "Handles multiphase flow (gas/liquid)",
      "Self-priming with high suction lift",
      "Low NPSH requirements",
      "Non-contacting screws - no wear",
      "CIP/SIP capable (hygienic series)",
      "Wide viscosity range"
    ],
    applications: [
      "Crude oil transfer",
      "Multiphase production",
      "Ship loading/unloading",
      "Tank farm operations",
      "Food and pharmaceutical",
      "Chemical processing"
    ],
    specifications: {
      "Capacity": ["Up to 2,000 m³/hr"],
      "Pressure": ["Up to 80 bar"],
      "Temperature": ["-40°C to 200°C"],
      "Viscosity": ["1 to 1,000,000 cSt"],
      "Sizes": ["50mm to 500mm"],
      "Drive": ["Direct coupled, belt drive, gearbox"]
    },
    materials: {
      "Screws": "Hardened steel, Stainless steel, Coated options",
      "Casing": "Cast steel, Stainless steel, Duplex steel",
      "Seals": "Mechanical seals, Magnetic coupling"
    }
  },
  {
    id: "internal-gear-pumps",
    name: "Internal Gear Pumps",
    aliases: ["internal gear pump", "internal gear pumps"],
    href: "/products/internal-gear-pumps",
    description: "Internal gear pumps use a rotor and idler gear with internal meshing. They provide smooth, low-pulsation flow and are excellent for high-viscosity fluids including asphalt, chocolate, and adhesives.",
    series: ["Standard Series", "Jacketted Series", "Sealless Magnetic Drive"],
    features: [
      "Handles extremely high viscosity",
      "Smooth, low-pulsation flow",
      "Single point end clearance adjustment",
      "Jacketted options for temperature control",
      "Sealless magnetic drive available",
      "Bidirectional operation"
    ],
    applications: [
      "Asphalt and bitumen",
      "Chocolate and confectionery",
      "Adhesives and sealants",
      "Resins and polymers",
      "Heavy fuel oil",
      "Surfactants and soaps"
    ],
    specifications: {
      "Capacity": ["Up to 500 m³/hr"],
      "Pressure": ["Up to 14 bar"],
      "Temperature": ["-20°C to 250°C"],
      "Viscosity": ["Up to 1,000,000 cSt"],
      "Sizes": ["25mm to 250mm"],
      "Drive": ["Direct coupled, belt drive, gear reducer"]
    },
    materials: {
      "Gears": "Cast iron, Steel, Stainless steel, Bronze",
      "Casing": "Cast iron, Ductile iron, Stainless steel",
      "Bearings": "Product lubricated, External optional"
    }
  },
  {
    id: "gerotor-pumps",
    name: "Gerotor Pumps",
    aliases: ["gerotor pump", "gerotor pumps"],
    href: "/products/gerotor-pumps",
    description: "Gerotor pumps use an inner rotor with external teeth and an outer rotor with internal teeth. They are compact, efficient, and widely used in automotive and industrial lubrication systems.",
    series: ["Standard Series", "High Speed Series", "Custom Profile Series"],
    features: [
      "Extremely compact design",
      "High volumetric efficiency",
      "Low noise operation",
      "Smooth flow characteristics",
      "Cost-effective for OEM volumes",
      "Custom profiles available"
    ],
    applications: [
      "Engine lubrication",
      "Transmission systems",
      "Hydraulic power steering",
      "Fuel injection systems",
      "Industrial lubrication",
      "Cooling circuits"
    ],
    specifications: {
      "Capacity": ["Up to 100 L/min"],
      "Pressure": ["Up to 50 bar"],
      "Temperature": ["-40°C to 150°C"],
      "Viscosity": ["10 to 5,000 cSt"],
      "Sizes": ["10mm to 80mm"],
      "Drive": ["Direct coupled, spline drive, press fit"]
    },
    materials: {
      "Rotors": "Powdered metal, Hardened steel",
      "Body": "Aluminum, Cast iron, Steel",
      "Port plates": "Bronze, Composite materials"
    }
  },
  {
    id: "trochoidal-gear-pumps",
    name: "Trochoidal Gear Pumps",
    aliases: ["trochoidal gear pump", "trochoidal gear pumps", "trochoidal pump", "trochoidal pumps"],
    href: "/products/trochoidal-gear-pumps",
    description: "Trochoidal gear pumps use cycloidal gear profiles for exceptionally smooth, low-pulsation flow. They are ideal for precision metering and high-pressure hydraulic applications.",
    series: ["Standard Series", "High Precision Series", "High Pressure Series"],
    features: [
      "Exceptionally low flow pulsation",
      "High pressure capability",
      "Precision metering accuracy",
      "Low noise and vibration",
      "Long service life",
      "Compact footprint"
    ],
    applications: [
      "Precision metering",
      "High-pressure hydraulics",
      "Fuel injection systems",
      "Chemical dosing",
      "Test rigs and laboratories",
      "Aerospace hydraulics"
    ],
    specifications: {
      "Capacity": ["Up to 200 L/min"],
      "Pressure": ["Up to 300 bar"],
      "Temperature": ["-20°C to 180°C"],
      "Viscosity": ["5 to 10,000 cSt"],
      "Sizes": ["8mm to 60mm"],
      "Drive": ["Direct coupled, motor mounted"]
    },
    materials: {
      "Gears": "Hardened tool steel, Carbide options",
      "Body": "High strength steel, Stainless steel",
      "Bearings": "Hydrodynamic, Roller bearings"
    }
  },
  {
    id: "shuttle-block-pumps",
    name: "Shuttle Block Pumps",
    aliases: ["shuttle block pump", "shuttle block pumps", "radial piston pump", "radial piston pumps"],
    href: "/products/shuttle-block-pumps",
    description: "Shuttle block pumps (also known as radial piston pumps) use multiple pistons in a rotating cylinder block. They provide extremely high pressure capability and are used in demanding industrial and mobile hydraulic applications.",
    series: ["Fixed Displacement", "Variable Displacement", "Multiple Flow Series"],
    features: [
      "Extremely high pressure capability",
      "High volumetric efficiency",
      "Low noise at high pressure",
      "Multiple outlet options",
      "Through-drive capability",
      "Variable displacement available"
    ],
    applications: [
      "High-pressure hydraulics",
      "Presses and forming machines",
      "Injection molding",
      "Die casting machines",
      "Test rigs",
      "Marine deck machinery"
    ],
    specifications: {
      "Capacity": ["Up to 500 L/min"],
      "Pressure": ["Up to 700 bar"],
      "Temperature": ["-20°C to 100°C"],
      "Viscosity": ["10 to 2,000 cSt"],
      "Sizes": ["Various frame sizes"],
      "Drive": ["Direct coupled, flange mounted"]
    },
    materials: {
      "Pistons": "Hardened steel, Carbide coated",
      "Cylinder block": "Hardened steel",
      "Body": "High strength cast iron, Steel"
    }
  },
  {
    id: "external-lobe-pumps",
    name: "External Lobe Pumps",
    aliases: ["external lobe pump", "external lobe pumps", "lobe pump", "lobe pumps", "rotary lobe pump", "rotary lobe pumps"],
    href: "/products/external-lobe-pumps",
    description: "External lobe pumps use two or more lobes rotating in opposite directions. They provide gentle, low-shear pumping action ideal for food, pharmaceutical, and biotechnology applications.",
    series: ["Sanitary Series", "Industrial Series", "High Viscosity Series"],
    features: [
      "Gentle product handling",
      "CIP/SIP capable",
      "Low shear rate",
      "Handles solids and particulates",
      "Reversible flow",
      "Easy maintenance and cleaning"
    ],
    applications: [
      "Dairy processing",
      "Beverage production",
      "Pharmaceutical manufacturing",
      "Biotechnology",
      "Cosmetics and personal care",
      "Sauces and condiments"
    ],
    specifications: {
      "Capacity": ["Up to 300 m³/hr"],
      "Pressure": ["Up to 15 bar"],
      "Temperature": ["-20°C to 150°C"],
      "Viscosity": ["Up to 500,000 cSt"],
      "Sizes": ["25mm to 200mm"],
      "Drive": ["Direct coupled, gearbox, VFD"]
    },
    materials: {
      "Lobes": "Stainless steel 316L, Non-metallic options",
      "Body": "Stainless steel 316L, Electropolished",
      "Seals": "EPDM, Viton, PTFE, FEP encapsulated"
    }
  }
];

export const productRegistry = products.map(p => ({
  id: p.id,
  name: p.name,
  aliases: p.aliases,
  href: p.href
}));

export function findProductById(id) {
  return products.find(p => p.id === id);
}

export function findProductByNameOrAlias(query) {
  const lowerQuery = query.toLowerCase();
  return products.find(p => 
    p.name.toLowerCase() === lowerQuery ||
    p.aliases.some(alias => alias.toLowerCase() === lowerQuery) ||
    p.name.toLowerCase().includes(lowerQuery) ||
    p.aliases.some(alias => lowerQuery.includes(alias.toLowerCase()))
  );
}

export function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.applications.some(app => app.toLowerCase().includes(lowerQuery))
  );
}

export function getAllProductNames() {
  return products.map(p => p.name);
}