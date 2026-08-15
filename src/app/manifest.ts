import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EcoQadam — Climate Learning & Action",
    short_name: "EcoQadam",
    description: "Xorazm o‘quvchilari uchun iqlim ta’limi va ekologik harakat platformasi.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8f6",
    theme_color: "#123e35",
    orientation: "portrait-primary",
    lang: "uz",
    categories: ["education", "environment", "productivity"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
