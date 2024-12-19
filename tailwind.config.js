// const { PlusJakartaSans_600SemiBold } = require('@expo-google-fonts/plus-jakarta-sans');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        plusjakartasans: ["PlusJakartaSans_400Regular", "sans-serif"],
        plusjakartasans_700bold: ["PlusJakartaSans_700Bold", "sans-serif"],
        plusjakartasans_600semibold: ["PlusJakartaSans_600SemiBold", "sans-serif"],
        plusjakartasans_500medium: ["PlusJakartaSans_500Medium", "sans-serif"],
      },
      colors: {
        primary: "#57BE5E",
        secondary: "#000000",
        gray: "#858585",
      }
    },
  },
  plugins: [],
};
