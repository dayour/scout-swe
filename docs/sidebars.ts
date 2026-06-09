import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    "intro",
    "getting-started",
    "architecture",
    {
      type: "category",
      label: "Packages",
      items: ["sdk", "a2a", "runtime"],
    },
    {
      type: "category",
      label: "Platform",
      items: ["apim", "automations", "policy"],
    },
  ],
};

export default sidebars;
