import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateColumns: {
        "5": "repeat(5, minmax(0, 1fr))",
      },
      colors: {
        pkdBlue: "#10112B",
        typeNormal: "#C1BCB6",
        typeFire: "#FC671A",
        typeWater: "#0083C2",
        typeElectric: "#FCDC00",
        typeGrass: "#35D32F",
        typeIce: "#1DC1DD",
        typeFighting: "#FCB600",
        typePoison: "#B04EC4",
        typeGround: "#C6883D",
        typeFlying: "#93D5E8",
        typePsychic: "#F16177",
        typeBug: "#C2D501",
        typeRock: "#CBC594",
        typeGhost: "#805474",
        typeDark: "#5C514F",
        typeDragon: "#406CA9",
        typeSteel: "#72C3D5",
        typeFairy: "#F3B1DB",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      width: {
        "5%": "5%",
        "10%": "10%",
        "15%": "15%",
        "20%": "20%",
        "25%": "25%",
        "30%": "30%",
        "40%": "40%",
        "50%": "50%",
        "60%": "60%",
        "65%": "65%",
        "70%": "70%",
        "75%": "75%",
        "80%": "80%",
        "85%": "85%",
        "90%": "90%",
        "100%": "100%",
      },
      height: {
        "5%": "5%",
        "10%": "10%",
        "20%": "20%",
        "25%": "25%",
        "30%": "30%",
        "40%": "40%",
        "43%": "43%",
        "50%": "50%",
        "60%": "60%",
        "70%": "70%",
        "75%": "75%",
        "80%": "80%",
        "90%": "90%",
        "100%": "100%",
      },
      screens: {
        xs: "320px", //  Mobile View
        sm: "376px", //  Mobile View
        smd: "576px", //  Mobile View
        md: "768px", // Tablet View
        lg: "992px", //Laptop View
        xl: "1280px", // Laptop
        "2xl": "1536px", // Desktop
        "3xl": "1900px", // Desktop
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
