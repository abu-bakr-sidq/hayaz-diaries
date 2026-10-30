import type { MetadataRoute } from "next";
import { description, profile } from "@/content/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.brand} — ${profile.name}`,
    short_name: profile.brand,
    description,
    start_url: "/",
    display: "standalone",
    background_color: "#f3ede3",
    theme_color: "#6b1f2c",
    icons: [{ src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
