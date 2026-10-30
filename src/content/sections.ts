export type Folio = {
  id: string;
  no: string;
  title: string;
  teaser: string;
  page: string;
};

/** Every chapter of the "magazine", in page order. */
export const chapters: Folio[] = [
  { id: "writer", no: "01", title: "The Writer", teaser: "Dear diary, it’s me", page: "03" },
  { id: "hook-lab", no: "02", title: "Hook Lab", teaser: "Twelve scripts that play like reels", page: "04" },
  { id: "reels", no: "03", title: "Now Playing", teaser: "The scripts, shot and posted", page: "05" },
  { id: "swipe-file", no: "04", title: "Swipe File", teaser: "Carousels people actually save", page: "06" },
  { id: "seo-desk", no: "05", title: "The SEO Desk", teaser: "Words that rank", page: "08" },
  { id: "in-her-bag", no: "06", title: "In Her Bag", teaser: "The everyday toolkit", page: "10" },
  { id: "journey", no: "07", title: "The Journey", teaser: "Chapters so far", page: "11" },
  { id: "wall", no: "08", title: "The Wall", teaser: "Brands & pages I’ve worked on", page: "12" },
  { id: "write-to-me", no: "09", title: "Write to Me", teaser: "DM for collabs — or write a letter", page: "14" },
];

/** Folios shown in the running header, including the cover pages. */
export const folios: Folio[] = [
  { id: "cover", no: "00", title: "Cover", teaser: "", page: "01" },
  { id: "contents", no: "00", title: "In this issue", teaser: "", page: "02" },
  ...chapters,
  { id: "under-the-hood", no: "05", title: "Under the Hood", teaser: "", page: "09" },
];
