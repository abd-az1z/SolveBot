import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
            colors: {
        "brand-green": "#389f38",
        "background-light": "#f7f9fc",
        "text-dark": "#1f2937",
      },
    },
  },
  plugins: [daisyui],
}


