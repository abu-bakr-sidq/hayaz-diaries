import type { StaticImageData } from "next/image";
import searchConsole from "@/assets/images/tools/search-console.webp";
import analytics from "@/assets/images/tools/analytics.webp";
import moz from "@/assets/images/tools/moz.webp";
import googleAds from "@/assets/images/tools/google-ads.webp";
import schema from "@/assets/images/tools/schema.webp";
import googleG from "@/assets/images/tools/google-g.webp";
import html5 from "@/assets/images/tools/html5.webp";
import css3 from "@/assets/images/tools/css3.webp";

export type Tool = {
  id: string;
  name: string;
  note: string;
  image: StaticImageData;
  /** Flat-lay placement on desktop: image centre (x, y) and width, as % of the canvas. */
  spot: { x: number; y: number; w: number; rotate: number };
  depth: number;
};

// Laid out like a knolling flat-lay: four big tools across the top, the
// smaller ones below, and the bag holding the middle.
export const tools: Tool[] = [
  {
    id: "search-console",
    name: "Google Search Console",
    note: "where Google tells me what it really thinks",
    image: searchConsole,
    spot: { x: 9, y: 25, w: 14, rotate: -6 },
    depth: 1.1,
  },
  {
    id: "analytics",
    name: "Google Analytics",
    note: "traffic, behaviour & the plot twists",
    image: analytics,
    spot: { x: 29.5, y: 21, w: 13.5, rotate: 4 },
    depth: 0.7,
  },
  {
    id: "moz",
    name: "Moz",
    note: "backlinks & domain authority checks",
    image: moz,
    spot: { x: 70.5, y: 21, w: 13.5, rotate: -3 },
    depth: 0.9,
  },
  {
    id: "google-ads",
    name: "Google Ads",
    note: "keyword planner’s home",
    image: googleAds,
    spot: { x: 91, y: 26, w: 13.5, rotate: 6 },
    depth: 1.3,
  },
  {
    id: "schema",
    name: "Schema Markup",
    note: "structured data, so search reads it right",
    image: schema,
    spot: { x: 10, y: 71, w: 14, rotate: 3 },
    depth: 1.2,
  },
  {
    id: "google-g",
    name: "Google",
    note: "the one reader I always optimise for",
    image: googleG,
    spot: { x: 29, y: 70, w: 7.5, rotate: -8 },
    depth: 0.6,
  },
  {
    id: "html5",
    name: "HTML5",
    note: "enough to fix a meta tag myself",
    image: html5,
    spot: { x: 70, y: 69, w: 7, rotate: -7 },
    depth: 1,
  },
  {
    id: "css3",
    name: "CSS3",
    note: "…and enough to not break it",
    image: css3,
    spot: { x: 89, y: 71, w: 7, rotate: 8 },
    depth: 0.8,
  },
];
