/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/content/**/*.mdx",
  ],
  // Disable all default Tailwind styles
  // We use only custom CSS classes defined in globals.css
  // This ensures slate-800, rounded-2xl, shadow-sm, etc. are unreachable
  corePlugins: [],
  theme: {
    // Only our custom color tokens exist
    colors: {
      paper: "#F2EEE6",
      "paper-sunk": "#E9E4D9",
      ink: "#171412",
      "ink-muted": "#6B635A",
      rule: "#D4CCBD",
      accent: "#C3431B",
      "accent-cold": "#2C4A3E",
    },
    // No default font stack
    fontFamily: {},
    // No default type scale
    fontSize: {},
    // No default border radius
    borderRadius: {},
    // No default shadow scale
    boxShadow: {},
  },
  plugins: [],
};