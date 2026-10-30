import type { StaticImageData } from "next/image";
import parakkat from "@/assets/images/work/parakkat.webp";
import ttdc from "@/assets/images/work/ttdc.webp";
import olga from "@/assets/images/work/olga.webp";
import banasura from "@/assets/images/work/banasura.webp";
import ihm from "@/assets/images/work/ihm.webp";
import studio53 from "@/assets/images/work/studio53.webp";
import signshop from "@/assets/images/work/signshop.webp";

/** Desktop pin-up position: left/top as % of the board, width in board-width %. */
type Spot = { left: string; top: string; w: number; rotate: number };

export type WallPage = {
  kind: "page";
  id: string;
  name: string;
  place: string;
  platform: "Instagram" | "Facebook";
  stat: string;
  image: StaticImageData;
  spot: Spot;
};

export type WallNote = {
  kind: "note";
  label: string;
  id: string;
  name: string;
  what: string;
  detail: string;
  tone: "rose" | "sand" | "champagne" | "paper";
  spot: Spot;
};

// Two rows on the board; each brand's script note is pinned beside its page.
export const wall: (WallPage | WallNote)[] = [
  {
    kind: "page",
    id: "parakkat",
    name: "Parakkat Nature Resort",
    place: "Munnar, Kerala",
    platform: "Instagram",
    stat: "805K followers",
    image: parakkat,
    spot: { left: "1.5%", top: "5%", w: 17, rotate: -4 },
  },
  {
    kind: "page",
    id: "ttdc",
    name: "TTDC",
    place: "Tamil Nadu Tourism Dev. Corp",
    platform: "Instagram",
    stat: "57.3K followers",
    image: ttdc,
    spot: { left: "21%", top: "8%", w: 17, rotate: 5 },
  },
  {
    kind: "page",
    id: "studio53-ig",
    name: "Studio53",
    place: "Advertising agency",
    platform: "Instagram",
    stat: "2.8K followers",
    image: studio53,
    spot: { left: "41%", top: "3%", w: 17, rotate: -3 },
  },
  {
    kind: "note",
    label: "Scripts for",
    id: "studio53",
    name: "Studio53",
    what: "8 ad scripts + 7 carousels",
    detail: "Meta ads education for real estate developers.",
    tone: "champagne",
    spot: { left: "59.5%", top: "9%", w: 11.5, rotate: 4 },
  },
  {
    kind: "page",
    id: "olga",
    name: "Olga Hills Resort",
    place: "Vagamon, Kerala",
    platform: "Instagram",
    stat: "4.6K followers",
    image: olga,
    spot: { left: "75%", top: "4%", w: 17, rotate: 3 },
  },
  {
    kind: "page",
    id: "banasura",
    name: "Banasura Hill Resort",
    place: "Wayanad, Kerala",
    platform: "Facebook",
    stat: "4.5K followers",
    image: banasura,
    spot: { left: "2%", top: "54%", w: 17, rotate: 3 },
  },
  {
    kind: "note",
    label: "Scripts for",
    id: "urbancore",
    name: "UrbanCore",
    what: "7 reel scripts",
    detail: "Real estate advisory — Tanglish & English, incl. Nivara 101.",
    tone: "sand",
    spot: { left: "20.5%", top: "52%", w: 11.5, rotate: -3 },
  },
  {
    kind: "page",
    id: "signshop-ig",
    name: "The Sign Shop",
    place: "OMR, Chennai",
    platform: "Instagram",
    stat: "966 followers",
    image: signshop,
    spot: { left: "33.5%", top: "55%", w: 17, rotate: -4 },
  },
  {
    kind: "note",
    label: "Scripts for",
    id: "signshop",
    name: "The Sign Shop",
    what: "25 reel scripts",
    detail: "Elevations, LED walls & name boards — in Tanglish.",
    tone: "rose",
    spot: { left: "51.5%", top: "51%", w: 11.5, rotate: 3 },
  },
  {
    kind: "page",
    id: "ihm",
    name: "IHM Australia",
    place: "Institute of Health & Management",
    platform: "Facebook",
    stat: "122K followers",
    image: ihm,
    spot: { left: "64.5%", top: "54%", w: 17, rotate: -5 },
  },
  {
    kind: "note",
    label: "Day job",
    id: "codux",
    name: "Codux Digital",
    what: "SEO Analyst",
    detail: "Feb 2024 — present. Rankings, audits & reports.",
    tone: "paper",
    spot: { left: "84%", top: "53%", w: 11.5, rotate: 6 },
  },
];
