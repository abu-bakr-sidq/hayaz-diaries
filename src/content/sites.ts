import type { StaticImageData } from "next/image";
import aravind from "@/assets/images/sites/dr-aravinds-ivf.webp";
import omMuruga from "@/assets/images/sites/om-muruga.webp";
import xpert from "@/assets/images/sites/xpert-ro.webp";
import sriBuilding from "@/assets/images/sites/sri-building-restoration.webp";
import codux from "@/assets/images/sites/codux-digital.webp";

// Live sites from her SEO desk. `title` and `description` are what each page
// serves to Google (read from the live pages, Nov 2026); where a page has no
// meta description, its own lead copy stands in — Google does the same.
// `at` places each frame on the design-file canvas, in canvas units; every
// frame is 1440 wide and as tall as its screenshot.

export type Site = {
  id: string;
  name: string;
  url: string;
  sector: string;
  place?: string;
  title: string;
  description: string;
  /** Phrases the page title is written around. */
  keywords: string[];
  note?: string;
  image: StaticImageData;
  at: { x: number; y: number };
};

export const FRAME_W = 1440;

export const sites: Site[] = [
  {
    id: "dr-aravinds-ivf",
    name: "Dr. Aravind’s IVF",
    url: "https://www.draravindsivf.com/fertility-centre-in-coimbatore",
    sector: "Fertility care",
    place: "Coimbatore",
    title: "Fertility Hospital in Coimbatore | Dr. Aravind's IVF",
    description:
      "Looking for a fertility hospital in Coimbatore? Explore IVF, ICSI and IUI treatments at Dr. Aravind’s IVF. Connect with our team and book a consultation.",
    keywords: ["fertility hospital in Coimbatore", "IVF", "ICSI & IUI"],
    image: aravind,
    at: { x: 0, y: 0 },
  },
  {
    id: "codux-digital",
    name: "Codux Digital",
    url: "https://www.coduxdigital.com/",
    sector: "Digital marketing agency",
    place: "Chennai",
    title: "Digital Marketing Agency in Chennai | Website Development",
    description:
      "Codux Digital - Best SEO & Digital Marketing Company in Chennai offering SEO, website development services, graphic design services in chennai & IT internships.",
    keywords: ["digital marketing agency in Chennai", "website development", "SEO company"],
    note: "Her desk",
    image: codux,
    at: { x: 1640, y: 320 },
  },
  {
    id: "om-muruga",
    name: "Om Muruga Catering",
    url: "https://www.ommurugacatering.com/",
    sector: "Catering",
    place: "Madurai",
    title: "Best Catering in Madurai | Best Non Veg Catering in Madurai | Best Veg Catering in Madurai",
    description:
      "OM Muruga Catering Service - We are one of the best catering services in madurai. And we specialist in non veg food items, veg food items too",
    keywords: ["catering in Madurai", "non-veg catering", "veg catering"],
    image: omMuruga,
    at: { x: 3280, y: 60 },
  },
  {
    id: "sri-building-restoration",
    name: "Sri Building Restoration",
    url: "https://www.sri-building-restoration-services.com/",
    sector: "Building restoration",
    title: "Sri Building Restoration - Building Restoration Services | Building Contractor",
    description: "Revitalizing Landmarks, Restoring Memories. Breathing life back into the echoes of history, one meticulously restored building at a time.",
    keywords: ["building restoration services", "building contractor"],
    image: sriBuilding,
    at: { x: 0, y: 760 },
  },
  {
    id: "xpert-ro",
    name: "Xpert RO Systems",
    url: "https://www.rowaterpurifiersandplants.in/",
    sector: "Water treatment",
    place: "Chennai",
    title: "Waste Water Treatment Plants Chennai| Xpert RO Systems Chennai | Waste Water Recycling Plant chennai",
    description:
      "Xpert RO Systems provide wide range of water and waste water solutions like Effluent treatment plants, sewage treatment plants, RO plants .",
    keywords: ["waste water treatment plants Chennai", "RO plants", "waste water recycling plant"],
    image: xpert,
    at: { x: 3280, y: 785 },
  },
];

/** Frame height on the canvas, from the screenshot's own proportions. */
export const frameH = (s: Site) => Math.round((FRAME_W * s.image.height) / s.image.width);
