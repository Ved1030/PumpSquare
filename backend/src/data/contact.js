export const contactInfo = {
  address: {
    lines: [
      "Plot No. 1903, Phase IV,",
      "G.I.D.C Estate, Via Anand,",
      "Vithal Udyog Nagar - 388121,",
      "Gujarat, India."
    ],
    full: "Plot No. 1903, Phase IV, G.I.D.C Estate, Via Anand, Vithal Udyog Nagar - 388121, Gujarat, India.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Vithal+Udyog+Nagar%2C+GIDC+Estate%2C+Anand%2C+Gujarat+388121%2C+India"
  },
  phones: [
    { label: "+91 93272 64813", href: "tel:+919327264813" },
    { label: "+91 80000 78677", href: "tel:+918000078677" }
  ],
  emails: {
    primary: "info@pumpsquare.com",
    footer: "response@pdpumpindia.com"
  },
  website: {
    label: "pumpsquare.com",
    href: "https://pumpsquare.com"
  },
  contactPage: "/contact",
  quotePage: "/contact",
  webmail: "http://webmail.pumpsquare.com/"
};

export function formatAddress() {
  return contactInfo.address.lines.join("\n");
}

export function getContactSummary() {
  return {
    address: contactInfo.address.full,
    phones: contactInfo.phones.map(p => p.label).join(", "),
    email: contactInfo.emails.primary,
    website: contactInfo.website.href
  };
}