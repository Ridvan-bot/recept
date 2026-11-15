import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recept",
    short_name: "Recept",
    description: "Hushållets recept — enkla att laga från mobilen.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3eadf",
    theme_color: "#c24e1d",
    lang: "sv",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
