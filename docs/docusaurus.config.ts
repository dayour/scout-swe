import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Scout SWE",
  tagline: "SWE framework and SDK for the DarbotLM Scout control plane",
  url: "https://dayour.github.io",
  baseUrl: "/scout-swe/",
  organizationName: "dayour",
  projectName: "scout-swe",
  deploymentBranch: "main",
  onBrokenLinks: "throw",
  favicon: "img/favicon.svg",
  headTags: [
    {
      tagName: "script",
      attributes: {},
      innerHTML: `(() => {
  const requested = new URLSearchParams(window.location.search).get("clawpilotTheme");
  const param = requested === "dark" || requested === "light" ? requested : null;
  const theme =
    param || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (param) {
    try {
      window.localStorage.setItem("theme", param);
    } catch {}
    document.documentElement.setAttribute("data-theme-choice", param);
  }
  document.documentElement.setAttribute("data-theme", theme);
})();`,
    },
    {
      tagName: "meta",
      attributes: {
        name: "description",
        content: "Framework, SDK, runtime, APIM, and automation documentation for Scout SWE.",
      },
    },
  ],
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },
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
        sitemap: {
          changefreq: "weekly",
          priority: 0.6,
          filename: "sitemap.xml",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
    navbar: {
      title: "Scout SWE",
      items: [
        { to: "/", label: "Docs", position: "left" },
        { href: "https://github.com/dayour/scout-swe", label: "GitHub", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright ${new Date().getFullYear()} Scout SWE contributors.`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
