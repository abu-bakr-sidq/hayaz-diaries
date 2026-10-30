// Reel & ad scripts written by S. Thasneem. Copy is kept as written, with only
// spacing/typo fixes; template placeholders like "[Number]" are dropped.

export type BrandKey = "studio53" | "urbancore" | "signshop";

export type Beat = {
  tag: "Hook" | "Body" | "Question" | "CTA";
  time?: string;
  vo: string;
  onScreen?: string;
};

export type Script = {
  id: string;
  brand: BrandKey;
  title: string;
  lang: "English" | "Tanglish";
  format: string;
  beats: Beat[];
};

export const brands: Record<BrandKey, { name: string; initials: string; about: string }> = {
  studio53: { name: "Studio53", initials: "53", about: "Meta ads education for real estate developers" },
  urbancore: { name: "UrbanCore", initials: "UC", about: "Real estate advisory, Chennai" },
  signshop: { name: "The Sign Shop", initials: "SS", about: "Elevations, LED walls & name boards, Chennai" },
};

export const scripts: Script[] = [
  {
    id: "candy-crush",
    brand: "studio53",
    title: "Leads from Candy Crush",
    lang: "English",
    format: "Meta ads reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Developers love a low CPL. But what if those leads are coming from Candy Crush?" },
      { tag: "Body", vo: "It’s called Audience Network. Your ad shows up inside games and random apps." },
      { tag: "Body", vo: "Someone tries to close your ad, misses, and taps it. Meta counts that as a lead." },
      { tag: "Body", vo: "And since junk leads are the cheapest, Meta sends more of your budget there." },
      { tag: "Body", vo: "So start tagging every lead in your CRM by placement. If Audience Network isn’t bringing site visits, turn it off." },
      { tag: "Body", vo: "Your CPL may go up. That’s fine. You pay your bills with site visits, not cheap leads." },
      { tag: "CTA", vo: "Follow Studio53 to avoid mistakes like this in your real estate ads." },
    ],
  },
  {
    id: "old-number",
    brand: "studio53",
    title: "The 15-year-old number",
    lang: "English",
    format: "Meta ads reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Developers complain, “We are getting spam leads, we are getting spam leads, we are getting spam leads.” Of course you’ll get spam leads if you call a 15-year-old number." },
      { tag: "Body", vo: "Meta auto-fills the phone number from the person’s profile. That number could be old, wrong, or not even theirs." },
      { tag: "Body", vo: "Some people even type fake numbers on purpose. So your sales team calls, nobody picks up, and the lead gets tagged ‘spam.’" },
      { tag: "Body", vo: "OTP verification solves this. The person has to enter a code sent to their phone before the form submits." },
      { tag: "Body", vo: "No real number, no code, no lead. So every lead that reaches your sales team is a real person with a working number." },
      { tag: "CTA", vo: "Follow Studio53 so your sales team only calls real buyers." },
    ],
  },
  {
    id: "five-km",
    brand: "studio53",
    title: "The 5 km radius myth",
    lang: "English",
    format: "Meta ads reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Developers, you think a 5 km radius means Meta only shows your ad to people living there? Haha. What a joke." },
      { tag: "Body", vo: "Meta shows your ad to people living there and anyone who was recently there. Office commuters, cab drivers, someone who came for a wedding." },
      { tag: "Body", vo: "So that 5 km circle you drew so carefully? It was never really 5 km." },
      { tag: "Body", vo: "And the tighter you make it, the harder you make Meta’s job. Small area, small audience, the same few people again and again." },
      { tag: "Body", vo: "You’re trying to do Meta’s job. Your job is different. Put the right information in your ad. The price. The BHK. The location. Who this home is for." },
      { tag: "Body", vo: "Speak to the right buyer in your creative, and Meta will find the right audience for you." },
      { tag: "CTA", vo: "Follow Studio53 to avoid mistakes like this in your real estate ads." },
    ],
  },
  {
    id: "luxury-story",
    brand: "studio53",
    title: "Everyone sells ‘luxury living’",
    lang: "English",
    format: "Meta ads reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Developers, I want to know what you mean by ‘luxury living.’ Every project is telling the same luxury story." },
      { tag: "Body", vo: "With broad and Advantage+ audiences, Meta decides who sees your ad by watching who reacts to it." },
      { tag: "Body", vo: "‘Luxury living’ over a pretty render? Everyone reacts. Students, renters, dreamers. So Meta finds you more of them." },
      { tag: "Body", vo: "Actually, your ad has to do the filtering. Show the price, the BHK, the size and the location." },
      { tag: "Body", vo: "So the wrong people scroll past. The right people stop. And Meta learns who to find." },
      { tag: "CTA", vo: "Follow Studio53 for more real estate Meta Ads breakdowns." },
    ],
  },
  {
    id: "before-you-invest",
    brand: "urbancore",
    title: "Before you invest your money…",
    lang: "Tanglish",
    format: "Real estate reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Indha money-ah earn panna neenga evlo kashtapattiruppeenga. So invest panradhukku munnaadi… konjam yosichittu pannunga.", onScreen: "Before you invest your savings…" },
      { tag: "Body", vo: "Neraya per enna pannuvaanga-na… friend oruthar ‘Indha property-ah semma deal, so vaangidu’-nu sonna podhum. Adha nambi kanna moodittu invest panniduvom." },
      { tag: "Body", vo: "Aana konjam varusham kazhichu paatha… money property-la maatitu irukkum. Appo advice sonna friend-lam kaanama poiruppanga." },
      { tag: "Body", vo: "So, first oru vishayam clear pannikkonga… ungalukku enna venum?" },
      { tag: "Body", vo: "Monthly rental income venuma? Appo rental return vara madhiri property-a paakanum.", onScreen: "Want rental income?" },
      { tag: "Body", vo: "Ungaloda family future-kaga wealth build pannanuma? Appo long-term growth potential irukkura options-a paakanum.", onScreen: "Want long-term growth?" },
      { tag: "Body", vo: "Simple-ah sonna… unga savings-ku oru plan irukkanum. Guess panni invest panna koodadhu." },
      { tag: "Body", vo: "URBANCORE-la, first unga goal enna-nu understand pannuvom. Adhukku apram, unga goal-ku suit aagura investment options-a discuss pannuvom.", onScreen: "Your goal first. Always." },
      { tag: "CTA", vo: "So, summa yaaravadhu sonnaanga-nu invest pannadheenga. Vaanga, pesuvom… unga goal enna-nu understand panni, adhukku etha maadhiri plan pannalaam.", onScreen: "DM URBANCORE" },
    ],
  },
  {
    id: "first-home",
    brand: "urbancore",
    title: "Buying your first home? Don’t do it alone.",
    lang: "Tanglish",
    format: "Real estate reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "First time veedu vaanga poringala? Appo thaniya decide pannadheenga.", onScreen: "Buying a new home in Chennai?" },
      { tag: "Body", vo: "Enna nadakkum theriyuma? Oru pakkam ten projects… innoru pakkam ten builders… ellaarume avanga avanga project dhaan best-nu solluvaanga.", onScreen: "New launches • New projects" },
      { tag: "Body", vo: "Site visit panni panni veetukku varumbodhu… clarity varradhukku badhila, innum confusion dhaan adhihama varumey." },
      { tag: "Body", vo: "Idhu unga life-la romba periya decision. So yaaravadhu pressure kuduthanga-nu avasara pattu decide pannama." },
      { tag: "Body", vo: "URBANCORE-la, unga side-la irundhu oru family member maadhiri naanga guide pannuvom.", onScreen: "We stand with you like family" },
      { tag: "Body", vo: "Currently available-a irukkura best offers-a compare panni, unga budget-ku suitable-aana options-a kaamippom." },
      { tag: "Body", vo: "Actually unga needs-ku suit aagala-na… sale miss aanaalum parava illa-nu straight-ah solliduvom.", onScreen: "Honest advice. Best offers." },
      { tag: "Body", vo: "And most importantly… engalukku neenga extra-ah 1 rubai kooda pay panna vena.", onScreen: "₹0 from your pocket" },
      { tag: "CTA", vo: "Unga family-ku enna venum-nu sollunga. Serndhu pesi, unga family-ku right home-a theadalam.", onScreen: "DM URBANCORE" },
    ],
  },
  {
    id: "backup-home",
    brand: "urbancore",
    title: "A backup home in Chennai",
    lang: "Tanglish",
    format: "NRI real estate reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Neenga abroad-la work pannitu irukkeengala? Oru vishayam honest-ah kekkaren…", onScreen: "For NRIs living abroad" },
      { tag: "Body", vo: "Pala varsham-ah anga work panni, family-ku money anuppi, anga oru thani life-ah build pannitu irukkeenga." },
      { tag: "Body", vo: "Aana unexpected-ah oru naal India-ku thirumbi vara vendiya situation vandhaa?", onScreen: "What if you had to come back?" },
      { tag: "Body", vo: "Job maaralaam… rules maaralaam… situation eppadi venumnaalum maaralaam." },
      { tag: "Body", vo: "Appo Chennai-la unga own home irundhaa… adhu oru proper backup-ah irukkum.", onScreen: "Your safety net back home" },
      { tag: "Body", vo: "Neenga abroad-la irukkumbodhu rent income-ah varum. Thirumbi India-ku vandha, unga own home ungalukaaga ready-ah irukkum.", onScreen: "Earn rent while you’re away" },
      { tag: "Body", vo: "URBANCORE-la property select panradhu, documents verify panradhu, ipdi entire process-ah handle panradhu… ellame naanga paathukkurom.", onScreen: "Chosen right. Legally verified." },
      { tag: "CTA", vo: "Neenga abroad-la enga irundhaalum parava illa. Chennai-la unga own home pathi innikke pesalaam.", onScreen: "WhatsApp URBANCORE" },
    ],
  },
  {
    id: "brutal-questions",
    brand: "urbancore",
    title: "10 brutal questions — Nivara 101",
    lang: "English",
    format: "Founder-led interview reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "10 brutal questions. Let’s find out if you should buy a flat at Nivara 101 or not. I’m Bharat from Urban Core, so let’s get straight to it." },
      { tag: "Question", vo: "Taj is also building homes on the same Nelson Manickam Road. So why should buyers choose Nivara 101?" },
      { tag: "Question", vo: "Compared to the rest of Nelson Manickam Road, Nivara 101 is priced a little higher. How do you justify that?" },
      { tag: "Question", vo: "If I want to buy a flat at Nivara 101, what’s the all-inclusive price? Any hidden charges?" },
      { tag: "Question", vo: "With amenities like a pool, spa and cinema, how much will the monthly maintenance be?" },
      { tag: "Question", vo: "If I rent out the flat, how much monthly rent can I expect on Nelson Manickam Road?" },
      { tag: "Question", vo: "If I buy at Nivara 101 today, what will it be worth in 5 years?" },
      { tag: "Question", vo: "If I decide to sell later, will it be easy to find a buyer?" },
      { tag: "Question", vo: "The project is right next to the river. Is there a flooding risk during heavy rain? What precautions have you taken?" },
      { tag: "Question", vo: "Be honest. Who is Nivara 101 not for?" },
      { tag: "Question", vo: "What does Nivara 101 have that other projects don’t? And why buy specifically from Rattha Realty?" },
      { tag: "CTA", vo: "For pricing, availability and more details, click the link below and speak with our team." },
    ],
  },
  {
    id: "six-boards",
    brand: "signshop",
    title: "Six name boards in five years",
    lang: "Tanglish",
    format: "ACP name board reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Oru name board-a 5 years-la 6 vaati maathuringala?" },
      { tag: "Body", vo: "Kaaranam, idha yaarumey unga kitta solla maatanga: enna brand LED, evlo power supply, ACP evlo mm, enna quality acrylic-nu." },
      { tag: "Body", vo: "Front-la paatha same maadhiri dhaan theriyum. But 7–8 months-laye light dim aagum, board fade aagum." },
      { tag: "Body", vo: "The Sign Shop-la quality materials dhaan. Oru vaati pannaley, 5 years maintenance tension illa." },
      { tag: "CTA", vo: "Chennai-la irukkingana, quote-ku keela irukura link-a click pannunga." },
    ],
  },
  {
    id: "twenty-vs-sixty",
    brand: "signshop",
    title: "₹20,000 vs ₹60,000",
    lang: "Tanglish",
    format: "ACP name board reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Same size, same design, and same lighting. Aana oru ACP name board ₹20,000, innonnu ₹60,000. Adhu yen?" },
      { tag: "Body", vo: "Difference ulla irukura products-la dhaan irukku." },
      { tag: "Body", vo: "Showrooms, cafés, shops interiors-ku lakhs-la selavu pannitu, customer first paakura name board-la mattum yen compromise pannanum?" },
      { tag: "Body", vo: "The Sign Shop-la quality materials-oda pannuvom, so unga board eppovum first naal maadhiri bright-a dhaan irukkum." },
      { tag: "CTA", vo: "So Chennai-la irukeengana, quote-ku keela irukura link-a click pannunga." },
    ],
  },
  {
    id: "ice-cream",
    brand: "signshop",
    title: "The ice-cream craving",
    lang: "Tanglish",
    format: "Storytelling reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Oru nameboard oru brand-ah maatha mudiyumnu nambuveengala?" },
      { tag: "Body", vo: "Oru naal sudden-ah ice cream craving vandhudhu-nu vechukonga. Neenga eppavume pogura shop-kku dhaan poreenga." },
      { tag: "Body", vo: "Aana vazhila oru pudhusa vandha shop-oda nameboard, lighting, overall look ungaloda attention-ah attract pannudhu." },
      { tag: "Body", vo: "‘Oru thadava try pannalaame’-nu solli anga poidreenga." },
      { tag: "Body", vo: "Inga change aanadhu ice cream illa… andha shop kudutha first impression." },
      { tag: "Body", vo: "Oru powerful nameboard unga brand-ah people notice panna vaikkum." },
      { tag: "CTA", vo: "Unga business-kum ippadi oru attention-grabbing nameboard venumna, Sign Shop-ah contact pannunga." },
    ],
  },
  {
    id: "not-4k",
    brand: "signshop",
    title: "Big screen ≠ 4K",
    lang: "Tanglish",
    format: "LED video wall reel",
    beats: [
      { tag: "Hook", time: "0–3 sec", vo: "Periya screen na 4K-nu nenaikkureengala?" },
      { tag: "Body", vo: "12 adi LED wall vaangureenganna, adhu 4K-nu nenaikkureenga." },
      { tag: "Body", vo: "LED wall resolution-ah size-um pixel pitch-um dhaan decide pannum." },
      { tag: "Body", vo: "Ex: 4 metre width, P2.5 screen. 4,000-ah 2.5-aala divide panna, 1,600 pixels dhaan." },
      { tag: "Body", vo: "Adhanaala 4K video pottaa waste. Screen size-ku exact-ah content ready pannanum." },
      { tag: "Body", vo: "Unga video editor kitta “screen resolution enna?”-nu mudhalla sollunga." },
      { tag: "CTA", vo: "Apdiye unga requirement-ah enga kitta sollunga." },
    ],
  },
];

export const tickerHooks = {
  english: [
    "Developers love a low CPL. But what if those leads are coming from Candy Crush?",
    "Before you choose a home, choose the builder.",
    "Every project is telling the same luxury story.",
    "Only 101 homes, in the heart of Chennai.",
  ],
  tanglish: [
    "Oru name board-a 5 years-la 6 vaati maathuringala?",
    "First time veedu vaanga poringala?",
    "Periya screen na 4K-nu nenaikkureengala?",
    "Oru test. Indha board-ah 3 second paarunga.",
  ],
};
