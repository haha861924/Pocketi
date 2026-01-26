/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "pixel-primary": "#D4A5A5",
        "pixel-secondary": "#9C8AA5",
        "pixel-accent": "#A5B9C4",
        "pixel-highlight": "#E8D4A2",
        "pixel-success": "#A5C4A5",
        "bg-light": "#F5F1E8",
        "bg-dark": "#3A3A4A",
        "bg-card-light": "#FEFDFB",
        "bg-card-dark": "#4A4A5A",
        "text-light": "#4A4A5A",
        "text-dark": "#E8E4D8",
        "text-muted-light": "#8A8A9A",
        "text-muted-dark": "#B8B4A8",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
        mono: ['"Space Mono"', "monospace"],
      },
      borderRadius: {
        "pixel-sm": "8px",
        "pixel-md": "12px",
        "pixel-lg": "16px",
        "pixel-xl": "24px",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        pixel: "4px 4px 0px rgba(0, 0, 0, 0.1)",
        "pixel-hover": "6px 6px 0px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
