export type Capability = {
  slug: string;
  title: string;
  kicker: string;
  body: string;
  focus: string[];
  /** The search a client might type when they need this. */
  query: string;
};

export const capabilities: Capability[] = [
  {
    slug: "on-page",
    title: "On-Page SEO",
    kicker: "Search Visibility",
    body: "Keyword research, search intent analysis, meta tags, content optimization, and SERP analysis to improve website visibility.",
    focus: ["Keywords", "Meta Tags", "SERP Analysis"],
    query: "how do i rank higher on google",
  },
  {
    slug: "technical",
    title: "Technical SEO",
    kicker: "Website Health",
    body: "Technical issue identification, crawlability, indexation, mobile SEO, and website optimization.",
    focus: ["Crawling", "Indexing", "Site Health"],
    query: "why is my website not showing up",
  },
  {
    slug: "off-page",
    title: "Off-Page SEO",
    kicker: "Authority Building",
    body: "Backlink analysis and link-building support designed to strengthen website authority and organic presence.",
    focus: ["Backlinks", "Link Building", "Authority"],
    query: "how to build domain authority",
  },
  {
    slug: "analytics",
    title: "Analytics",
    kicker: "Performance Tracking",
    body: "Monitoring organic traffic, rankings, and user behaviour through Google Analytics and Google Search Console.",
    focus: ["Google Analytics", "Search Console", "Reporting"],
    query: "where is my traffic coming from",
  },
];

export const skills = [
  { title: "SEO", body: "On-page, off-page and technical SEO, keyword research, search intent analysis and SEO strategy." },
  { title: "Analytics", body: "Google Analytics, Google Search Console, traffic and ranking analysis, user behaviour insights." },
  { title: "Technical SEO", body: "Indexing, crawling, site health, website optimization, mobile SEO and site speed." },
  { title: "Link Building", body: "Backlink analysis and basic backlink strategy to support domain authority." },
  { title: "SEO Content", body: "SEO content writing, content optimization and content strategy support." },
  { title: "SEO Reporting", body: "Weekly and monthly reports with insights, recommendations and performance tracking." },
  { title: "Competitor Analysis", body: "Competitor and SERP analysis to find the search opportunities others miss." },
  { title: "Meta Optimization", body: "Meta tags and content tuned to lift search visibility and click-through rates." },
  { title: "Web Basics", body: "Basic HTML & CSS — enough to fix what an SEO audit finds." },
];
