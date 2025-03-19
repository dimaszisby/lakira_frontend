/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /*
       * Font Family Setup
       * Using "Quicksand" and "Plus Jakarta Sans" as the main fonts
       */
      fontFamily: {
        // Use the CSS variables set in your layout file
        sans: [
          "var(--font-quicksand)",
          "var(--font-plus-jakarta)",
          "sans-serif",
        ],
        quicksand: ["var(--font-quicksand)", "sans-serif"],
        jakarta: ["var(--font-plus-jakarta)", "sans-serif"],
      },

      /*
       * Unified Font Sizes with line-heights
       * Named using 'fs-' prefix for consistency
       */
      fontSize: {
        "fs-h1": ["3rem", { lineHeight: "1.2" }], // 48px with custom line height
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

      /*
       * Font Weights
       */
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      /*
       * Unified Color System
       * Using CSS variables from :root for dynamic theming
       */
      colors: {
        // Example core brand colors
        core: {
          primary: "var(--core-primary)",
          secondary: "var(--core-secondary)",
          accent: "var(--core-accent)",
        },

        // Example text color tokens
        text: {
          emphasis: "var(--text-emphasis)",
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          overline: "var(--text-tertiary)",
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

        // Example background color tokens
        background: {
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
          tertiary: "var(--background-tertiary)",
          overlay: "var(--background-overlay)",
          disabled: "var(--background-disabled)",
        },

        // Example border color tokens
        border: {
          DEFAULT: "var(--border-default)",
          active: "var(--border-active)",
          error: "var(--border-error)",
          focus: "var(--border-focus)",
        },

        // Example button color tokens
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

        // Example textfield color tokens
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
