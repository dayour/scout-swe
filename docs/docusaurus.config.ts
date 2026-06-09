import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Scout SWE",
  tagline: "SWE framework and SDK for the DarbotLM Scout control plane",
  url: "https://dayour.github.io",
  baseUrl: "/scout-swe/",
  organizationName: "dayour",
  projectName: "scout-swe",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  i18n: { defaultLocale: "en", locales: ["en"] },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/dayour/scout-swe/tree/main/docs/",
        },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: "Scout SWE",
      items: [
        { to: "/", label: "Docs", position: "left" },
        { href: "https://github.com/dayour/scout-swe", label: "GitHub", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      copyright: "MIT (c) 2026 Daryl Yourk. Built with Docusaurus.",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
