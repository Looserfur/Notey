/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f7f6",
          100: "#e4ebe8",
          200: "#c8d6d0",
          500: "#3d5a50",
          700: "#243d36",
          900: "#13241f",
        },
        accent: {
          DEFAULT: "#0d9488",
          soft: "#ccfbf1",
          dark: "#0f766e",
        },
        interim: "#94a3b8",
      },
    },
  },
  plugins: [],
};
