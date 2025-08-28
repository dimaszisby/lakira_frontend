/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/types/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/services/**/*.{js,ts,jsx,tsx,mdx}",
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
     // fontSize: {
     //   "fs-h1": ["3rem", { lineHeight: "3.6" }], // 48px with custom line height
     //   "fs-h2": ["2.25rem", { lineHeight: "2.925" }], // 36px
     //   "fs-h3": ["1.75rem", { lineHeight: "2.45" }], // 28px
     //   "fs-h4": ["1.5rem", { lineHeight: "2.1" }], // 24px
     //   "fs-h5": ["1.25rem", { lineHeight: "1.75" }], // 20px
     //   "fs-h6": ["1.125rem", { lineHeight: "1.4625" }], // 18px
     //   "fs-body1": ["1rem", { lineHeight: "1.6" }], // 16px
     //   "fs-body2": ["0.875rem", { lineHeight: "1.4" }], // 14px
     //   "fs-caption": ["0.75rem", { lineHeight: "1.125" }], // 12px
     //   "fs-overline": ["0.75rem", { lineHeight: "0.875" }], // 12px
     //   "fs-button": ["1rem", { lineHeight: "1.2" }], // 16px
     //   "fs-button-sm": ["0.875rem", { lineHeight: "1.05" }], // 14px
     //   "fs-input-label": ["0.875rem", { lineHeight: "1.05" }], // 14px
     //   "fs-footer": ["0.75rem", { lineHeight: "1.05" }], // 12px
     //   "fs-tooltip": ["0.75rem", { lineHeight: "0.975" }], // 12px
     //   "fs-alert": ["1rem", { lineHeight: "1.4" }], // 16px
     //   "fs-navigation-item": ["1rem", { lineHeight: "1.3" }], // 16px
     //   "fs-badge": ["0.625rem", { lineHeight: "1.3" }], // 10px
     //   "fs-link": ["0.875rem", { lineHeight: "1.225" }], // 14px
     // },

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
          // Primary brand color
          primary: "var(--core-primary)",
          // Secondary brand color
          secondary: "var(--core-secondary)",
          // Accent color
          accent: "var(--core-accent)",
        },

        // Example text color tokens
        text: {
          // Emphasis text color
          emphasis: "var(--text-emphasis)",
          // Primary text color
          primary: "var(--text-primary)",
          // Secondary text color
          secondary: "var(--text-secondary)",
          // Tertiary text color
          tertiary: "var(--text-tertiary)",
          // Overline text color
          overline: "var(--text-tertiary)",
          // Error text color
          error: "var(--text-error)",
          // Placeholder text color
          placeholder: "var(--text-placeholder)",
          // Disabled text color
          disabled: "var(--text-disabled)",
          // Inverted text color
          inverted: "var(--text-inverted)",
        },
        status: {
          error: {
            // Error status background color
            bg: "var(--status-error-bg)",
            // Default error status color
            DEFAULT: "var(--status-error)",
            // Emphasis error status color
            emphasis: "var(--status-error-emphasis)",
          },
          success: {
            // Success status background color
            bg: "var(--status-success-bg)",
            // Default success status color
            DEFAULT: "var(--status-success)",
            // Emphasis success status color
            emphasis: "var(--status-success-emphasis)",
          },
          warning: {
            // Warning status background color
            bg: "var(--status-warning-bg)",
            // Default warning status color
            DEFAULT: "var(--status-warning)",
            // Emphasis warning status color
            emphasis: "var(--status-warning-emphasis)",
          },
          info: {
            // Info status background color
            bg: "var(--status-info-bg)",
            // Default info status color
            DEFAULT: "var(--status-info)",
            // Emphasis info status color
            emphasis: "var(--status-info-emphasis)",
          },
        },

        // Example background color tokens
        background: {
          // Primary background color
          primary: "var(--background-primary)",
          // Secondary background color
          secondary: "var(--background-secondary)",
          // Tertiary background color
          tertiary: "var(--background-tertiary)",
          // Overlay background color
          overlay: "var(--background-overlay)",
          // Disabled background color
          disabled: "var(--background-disabled)",
        },

        // Example border color tokens
        border: {
          // Default border color
          DEFAULT: "var(--border-default)",
          // Active border color
          active: "var(--border-active)",
          // Error border color
          error: "var(--border-error)",
          // Focus border color
          focus: "var(--border-focus)",
        },

        // Example button color tokens
        button: {
          bg: {
            // Default button background color
            DEFAULT: "var(--button-bg)",
            // Secondary button background color
            secondary: "var(--button-bg-secondary)",
            // Accent button background color
            accent: "var(--button-bg-accent)",
            // Disabled button background color
            disabled: "var(--button-bg-disabled)",
            // Destructive button background color
            destructive: "var(--button-bg-destructive)",
          },
          fg: {
            // Default button foreground color
            DEFAULT: "var(--button-fg)",
            // Secondary button foreground color
            secondary: "var(--button-fg-secondary)",
            // Accent button foreground color
            accent: "var(--button-fg-accent)",
            // Disabled button foreground color
            disabled: "var(--button-fg-disabled)",
            // Destructive button foreground color
            destructive: "var(--button-fg-destructive)",
          },
        },

        // Example textfield color tokens
        textfield: {
          // Textfield background color
          bg: "var(--textfield-bg)",
          // Textfield foreground color
          fg: "var(--textfield-fg)",
          // Textfield disabled background color
          disabled: "var(--textfield-bg-disabled)",
          // Textfield border color
          border: "var(--textfield-border)",
          // Textfield active border color
          borderActive: "var(--textfield-border-active)",
          // Textfield error border color
          borderError: "var(--textfield-border-error)",
        },

        // TODO: Add more colors as needed
      },
    },
  },
  plugins: [],
};
