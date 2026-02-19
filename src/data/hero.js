/**
 * Hero / About Data
 * -------------------------------------------------------
 * Edit this file to update your bio, titles, and social links.
 */

const hero = {
  firstName: "Khang",
  lastName: "Phan",
  greeting: "Hello, I'm",
  profileImage: "/anh.jpg?height=1000&width=800",

  titles: [
    "Full-Stack Developer",
    "UI/UX Designer",
    "Software Engineer",
    "AI Engineer",
  ],

  bio: "I'm Khang, a Computer Science student at USF who lives off coffee, code, and curiosity. I love turning random ideas into full-stack projects, tinkering with AI, and seeing things actually work after hours of debugging (best feeling ever). I'm always chasing new challenges that make me learn, build, and maybe break a few things along the way",

  stats: [
    { value: "4+", label: "Roles" },
    { value: "\u221E", label: "Projects" },   // infinity symbol
    { value: "24/7", label: "Learning" },
  ],

  socialLinks: [
    { type: "Mail",     text: "Contact Me",   href: "mailto:khang18@usf.edu",                color: "from-blue-500 to-blue-600" },
    { type: "Github",   text: "View Projects", href: "https://github.com/khangpt2k6",        color: "from-neutral-700 to-neutral-900" },
    { type: "Linkedin", text: "LinkedIn",       href: "https://linkedin.com/in/tuankhangphan", color: "from-blue-600 to-blue-700" },
    { type: "FileText", text: "Resume",         href: "https://leetcode.com/u/KHcqTUn9ld/",   color: "from-green-600 to-emerald-600" },
  ],
};

export default hero;
