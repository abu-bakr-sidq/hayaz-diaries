import type { StaticImageData } from "next/image";
import spamLeads from "@/assets/reels/studio53-spam-leads.jpg";
import siteVisits from "@/assets/reels/studio53-site-visits.jpg";
import learningPhase from "@/assets/reels/studio53-learning-phase.jpg";
import cheaperLeads from "@/assets/reels/studio53-cheaper-leads.jpg";
import goodName from "@/assets/reels/signshop-good-name.jpg";
import showroom from "@/assets/reels/signshop-showroom.jpg";
import basihaPrice from "@/assets/reels/basiha-price.jpg";
import basihaPcod from "@/assets/reels/basiha-pcod.jpg";
import kettleCake from "@/assets/reels/diary-kettle-cake.jpg";
import worthTheHype from "@/assets/reels/diary-worth-the-hype.jpg";

// Her scripts as they went live. Titles follow the posts' own captions; the
// files in /public/reels are 720p H.264 with the index up front, so they start
// streaming straight away.

export type ReelBrand = "studio53" | "signshop" | "basiha" | "diary";

export const reelBrands: Record<ReelBrand, { name: string; short: string }> = {
  studio53: { name: "Studio53", short: "53" },
  signshop: { name: "The Sign Shop", short: "SS" },
  basiha: { name: "Basiha Fitness", short: "BF" },
  diary: { name: "Her diary", short: "h" },
};

export type Reel = {
  id: string;
  brand: ReelBrand;
  title: string;
  format: string;
  lang?: "English" | "Tanglish";
  length: string;
  src: string;
  poster: StaticImageData;
  /** The Hook Lab script this reel was shot from. */
  script?: string;
};

export const reels: Reel[] = [
  {
    id: "spam-leads",
    brand: "studio53",
    title: "Are your Meta ads generating spam leads?",
    format: "Meta ads reel",
    lang: "English",
    length: "0:56",
    src: "/reels/studio53-spam-leads.mp4",
    poster: spamLeads,
    script: "old-number",
  },
  {
    id: "twenty-vs-sixty",
    brand: "signshop",
    title: "₹20,000 vs ₹60,000",
    format: "ACP name board reel",
    lang: "Tanglish",
    length: "0:39",
    src: "/reels/signshop-good-name.mp4",
    poster: goodName,
    script: "twenty-vs-sixty",
  },
  {
    id: "worth-the-hype",
    brand: "diary",
    title: "Worth the hype?",
    format: "Her own reel · with @yusra_couture_",
    length: "0:58",
    src: "/reels/diary-worth-the-hype.mp4",
    poster: worthTheHype,
  },
  {
    id: "price-kammi",
    brand: "basiha",
    title: "“Price kammi ah irundha, fake ah?”",
    format: "Product ad reel",
    lang: "Tanglish",
    length: "1:12",
    src: "/reels/basiha-price.mp4",
    poster: basihaPrice,
  },
  {
    id: "learning-phase",
    brand: "studio53",
    title: "Still stuck in the learning phase after weeks?",
    format: "Meta ads reel",
    lang: "English",
    length: "1:03",
    src: "/reels/studio53-learning-phase.mp4",
    poster: learningPhase,
  },
  {
    id: "showroom",
    brand: "signshop",
    title: "LED walls for the showroom entrance",
    format: "LED video wall reel",
    lang: "Tanglish",
    length: "0:28",
    src: "/reels/signshop-showroom.mp4",
    poster: showroom,
  },
  {
    id: "kettle-cake",
    brand: "diary",
    title: "Hostel ah kettle vachi cake pannom",
    format: "Her own reel",
    length: "1:06",
    src: "/reels/diary-kettle-cake.mp4",
    poster: kettleCake,
  },
  {
    id: "site-visits",
    brand: "studio53",
    title: "Cheap leads, but very few site visits?",
    format: "Meta ads reel",
    lang: "English",
    length: "0:48",
    src: "/reels/studio53-site-visits.mp4",
    poster: siteVisits,
  },
  {
    id: "kavalai-vendaam",
    brand: "basiha",
    title: "“Kavalai vendaam” — the PCOD reel",
    format: "Customer story reel",
    lang: "Tanglish",
    length: "0:56",
    src: "/reels/basiha-pcod.mp4",
    poster: basihaPcod,
  },
  {
    id: "cheaper-leads",
    brand: "studio53",
    title: "Cheaper leads that never become site visits?",
    format: "Meta ads reel",
    lang: "English",
    length: "0:48",
    src: "/reels/studio53-cheaper-leads.mp4",
    poster: cheaperLeads,
  },
];
