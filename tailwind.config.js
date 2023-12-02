const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,njk,md}", "./src/**/*.11ty.js", "./src/_data/plaiceholder.js"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: {
        DEFAULT: "#ebdfda",
        lightest: "#e6f2eb",
        light: "#CCE4D6",
        dark: "#002E14",
        50: "#00ef78",
        100: "#00c864",
        200: "#00a150",
        300: "#008d47",
        400: "#007a3d",
        500: "#063",
        600: "#005229",
        700: "#003f1f",
        800: "#002b16",
        900: "#00180c",
      },
      secondary: {
        DEFAULT: "#990000",
        lightest: "#f2efef",
        light: "#FAE8E7",
        400: "#ee3b2b",
        500: "#990000",
        600: "#720000",
        700: "#5e0000",
        800: "#4b0000",
        900: "#370000",
      },
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
    },
    fontFamily: {
      sans: ["Source Sans Pro", "Arial", "Helvetica", "sans-serif"],
      serif: ["Source Serif Pro", "Times New Roman", "Times", "serif"],
    },
    backgroundImage: {
      "hero-lg": "url('../img/hero.jpg')",
      "hero-sm": "url('../img/hero-mobile.webp')",
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@plaiceholder/tailwindcss"),
  ],
};
