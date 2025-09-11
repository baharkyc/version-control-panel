/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      colors: {
        "background-color": "#1e1e2e",
        "primary-dark-color": "#434190",
        "secondary-dark-color": "#1e3a8a",
      }
    },
  },
  plugins: [],
}

