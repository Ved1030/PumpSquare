export const industries = [
  {
    id: "chemical",
    name: "Chemical",
    description: "Pumpsquare pumps handle a wide range of chemicals including acids, alkalis, solvents, and petrochemicals. Our positive displacement pumps provide precise metering and transfer for chemical processing plants.",
    applications: [
      "Acid and alkali transfer",
      "Solvent recovery",
      "Petrochemical processing",
      "Polymer production",
      "Specialty chemicals"
    ]
  },
  {
    id: "building",
    name: "Building",
    description: "Our pumps serve the building and construction industry with reliable solutions for concrete additives, waterproofing materials, and HVAC systems.",
    applications: [
      "Concrete additive dosing",
      "Waterproofing material transfer",
      "HVAC heating and cooling",
      "Fire protection systems",
      "Plumbing and drainage"
    ]
  },
  {
    id: "pharmaceutical",
    name: "Pharmaceutical",
    description: "Pumpsquare's sanitary and hygienic pumps meet stringent pharmaceutical industry requirements for sterile processing, CIP/SIP compliance, and gentle product handling.",
    applications: [
      "Active ingredient transfer",
      "Sterile filtration",
      "Vaccine production",
      "API manufacturing",
      "Bioprocessing"
    ]
  },
  {
    id: "beverage-food",
    name: "Beverage & Food",
    description: "Our food-grade and sanitary pumps handle delicate food products, beverages, and ingredients with gentle pumping action that preserves product quality and integrity.",
    applications: [
      "Dairy processing",
      "Beverage production and bottling",
      "Sauce and condiment manufacturing",
      "Chocolate and confectionery",
      "Bakery ingredient handling"
    ]
  },
  {
    id: "varnish-paint",
    name: "Varnish & Paint",
    description: "Pumpsquare pumps handle high-viscosity paints, varnishes, coatings, and resins with precision metering and transfer capabilities for the coatings industry.",
    applications: [
      "Paint and coating production",
      "Resin and polymer transfer",
      "Pigment dispersion",
      "Varnish manufacturing",
      "Ink production"
    ]
  },
  {
    id: "sewage-technology",
    name: "Sewage Technology",
    description: "Our progressive cavity and lobe pumps excel in wastewater and sewage treatment applications, handling solids-laden fluids with reliability and low maintenance.",
    applications: [
      "Sludge transfer and dewatering",
      "Sewage lifting stations",
      "Wastewater treatment plants",
      "Industrial effluent handling",
      "Biogas plant feeding"
    ]
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Pumpsquare provides pumping solutions for agricultural applications including irrigation, fertilizer dosing, and crop protection chemical transfer.",
    applications: [
      "Irrigation systems",
      "Fertilizer and pesticide dosing",
      "Animal waste management",
      "Crop sprayer systems",
      "Greenhouse climate control"
    ]
  },
  {
    id: "paper",
    name: "Paper",
    description: "Our pumps serve the pulp and paper industry with robust solutions for stock preparation, coating, and chemical recovery processes.",
    applications: [
      "Pulp transfer",
      "Coating preparation",
      "Chemical recovery",
      "Bleaching chemical dosing",
      "Waste paper recycling"
    ]
  }
];

export const industryRegistry = industries.map(i => ({
  id: i.id,
  name: i.name
}));

export function findIndustryById(id) {
  return industries.find(i => i.id === id);
}

export function searchIndustries(query) {
  const lowerQuery = query.toLowerCase();
  return industries.filter(i => 
    i.name.toLowerCase().includes(lowerQuery) ||
    i.description.toLowerCase().includes(lowerQuery) ||
    i.applications.some(app => app.toLowerCase().includes(lowerQuery))
  );
}

export function getAllIndustryNames() {
  return industries.map(i => i.name);
}