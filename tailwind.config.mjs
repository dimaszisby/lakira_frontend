/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Supports scalable project structure
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js App Router support
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Legacy Pages Router support
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // UI components and design system
  ],
  theme: {
    extend: {
      // Font Family Configuration (Using CSS Variables)
      fontFamily: {
        sans: [
          "var(--font-quicksand)",
          "var(--font-plus-jakarta)",
          "sans-serif",
        ],
        quicksand: ["var(--font-quicksand)", "sans-serif"],
        jakarta: ["var(--font-plus-jakarta)", "sans-serif"],
      },

      // Font Sizes with Line Height
      fontSize: {
        "fs-h1": ["3rem", { lineHeight: "1.2" }], // 48px
        "fs-h2": ["2.25rem", { lineHeight: "1.3" }], // 36px
        "fs-h3": ["1.75rem", { lineHeight: "1.4" }], // 28px
        "fs-h4": ["1.5rem", { lineHeight: "1.5" }], // 24px
        "fs-h5": ["1.25rem", { lineHeight: "1.6" }], // 20px
        "fs-h6": ["1.125rem", { lineHeight: "1.6" }], // 18px
        "fs-body1": ["1rem", { lineHeight: "1.6" }], // 16px
        "fs-body2": ["0.875rem", { lineHeight: "1.5" }], // 14px
        "fs-caption": ["0.75rem", { lineHeight: "1.3" }], // 12px
        "fs-overline": ["0.75rem", { lineHeight: "1.3" }], // 12px
        "fs-button": ["1rem", { lineHeight: "1.6" }], // 16px
        "fs-button-sm": ["0.875rem", { lineHeight: "1.6" }], // 14px
        "fs-input-label": ["0.875rem", { lineHeight: "1.5" }], // 14px
        "fs-footer": ["0.75rem", { lineHeight: "1.3" }], // 12px
        "fs-tooltip": ["0.75rem", { lineHeight: "1.3" }], // 12px
        "fs-alert": ["1rem", { lineHeight: "1.5" }], // 16px
        "fs-navigation-item": ["1rem", { lineHeight: "1.5" }], // 16px
        "fs-badge": ["0.625rem", { lineHeight: "1.3" }], // 10px
        "fs-link": ["0.875rem", { lineHeight: "1.5" }], // 14px
      },

      // Font Weights
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // Color System (Using CSS Variables for Theme Management)
      colors: {
        core: {
          primary: "var(--core-primary)",
          secondary: "var(--core-secondary)",
          accent: "var(--core-accent)",
        },
        text: {
          emphasis: "var(--text-emphasis)",
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          overline: "var(--text-overline)",
          error: "var(--text-error)",
          placeholder: "var(--text-placeholder)",
          disabled: "var(--text-disabled)",
          inverted: "var(--text-inverted)",
        },
        status: {
          error: {
            bg: "var(--status-error-bg)",
            DEFAULT: "var(--status-error)",
            emphasis: "var(--status-error-emphasis)",
          },
          success: {
            bg: "var(--status-success-bg)",
            DEFAULT: "var(--status-success)",
            emphasis: "var(--status-success-emphasis)",
          },
          warning: {
            bg: "var(--status-warning-bg)",
            DEFAULT: "var(--status-warning)",
            emphasis: "var(--status-warning-emphasis)",
          },
          info: {
            bg: "var(--status-info-bg)",
            DEFAULT: "var(--status-info)",
            emphasis: "var(--status-info-emphasis)",
          },
        },
        background: {
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
          tertiary: "var(--background-tertiary)",
          overlay: "var(--background-overlay)",
          disabled: "var(--background-disabled)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          active: "var(--border-active)",
          error: "var(--border-error)",
          focus: "var(--border-focus)",
        },
        button: {
          bg: {
            DEFAULT: "var(--button-bg)",
            secondary: "var(--button-bg-secondary)",
            accent: "var(--button-bg-accent)",
            disabled: "var(--button-bg-disabled)",
            destructive: "var(--button-bg-destructive)",
          },
          fg: {
            DEFAULT: "var(--button-fg)",
            secondary: "var(--button-fg-secondary)",
            accent: "var(--button-fg-accent)",
            disabled: "var(--button-fg-disabled)",
            destructive: "var(--button-fg-destructive)",
          },
        },
        textfield: {
          bg: "var(--textfield-bg)",
          fg: "var(--textfield-fg)",
          disabled: "var(--textfield-bg-disabled)",
          border: "var(--textfield-border)",
          borderActive: "var(--textfield-border-active)",
          borderError: "var(--textfield-border-error)",
        },
      },
    },
  },
  plugins: [],
};
