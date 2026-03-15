/**
 * Footer / Contact Data
 * -------------------------------------------------------
 * Edit this file to update contact info and social links.
 */

const footer = {
  name: "Kevin Phan",
  copyright: "Tuan Kevin Phan",
  tagline: "Built with passion & dedication",

  socialLinks: [
    { type: "github",   href: "https://github.com/khangpt2k6",        label: "GitHub Profile" },
    { type: "linkedin", href: "https://linkedin.com/in/kvphan27", label: "LinkedIn Profile" },
    { type: "email",    href: "mailto:khang18@usf.edu",                label: "Email Contact" },
  ],

  contact: {
    email: "khang18@usf.edu",
    phone: "813-570-4370",
    location: "Tampa, Florida, United States",
  },

  navLinks: [
    { to: "/", hash: "#about",      label: "About" },
    { to: "/", hash: "#experience", label: "Experience" },
    { to: "/", hash: "#projects",   label: "Projects" },
    { to: "/", hash: "#skills",     label: "Skills" },
    { to: "/lab",                    label: "Lab" },
  ],
};

export default footer;
