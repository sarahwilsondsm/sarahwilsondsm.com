const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: [
    ".eleventy.js",
    "./src/**/*.{html,njk,md}",
    "./src/**/*.11ty.js",
    "./src/_data/plaiceholder.js",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: {
        DEFAULT: "#ebdfda",
        50: "#fbf9f8",
        100: "#ebdfda",
        200: "#ddc9c1",
        300: "#cfb3a7",
        400: "#c9a89a",
        500: "#c29d8e",
        600: "#b48774",
        700: "#a6715b",
        800: "#8d5f4c",
        900: "#5a3d31",
        950: "#34231c",
      },
      secondary: {
        DEFAULT: "#ebe8da",
        50: "#f9f8f3",
        100: "#ebe8da",
        200: "#e4e0cd",
        400: "#d6d0b4",
        500: "#cfc8a7",
        600: "#bbb181",
        700: "#a6995b",
        800: "#8d824c",
        900: "#675f38",
        950: "#413c23",
      },
      tertiary: {
        DEFAULT: "#dfdaeb",
        50: "#eae7f2",
        100: "#dfdaeb",
        200: "#beb4d6",
        400: "#a89ac9",
        500: "#9d8ec2",
        600: "#8774b4",
        700: "#715ba6",
        800: "#5f4c8d",
        900: "#4e3f74",
        950: "#2c2341",
      },
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
    },
    extend: {
      fontSize: {
        "size-sm": ".875rem",
      },
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
