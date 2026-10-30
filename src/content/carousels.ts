// Studio53 carousel sets written by S. Thasneem. Each set: a cover, five
// mistake/fix slides and a "save this" closer.

export type Carousel = {
  id: string;
  title: string;
  items: { mistake: string; fix: string }[];
};

const set = (id: string, title: string, pairs: [string, string][]): Carousel => ({
  id,
  title,
  items: pairs.map(([mistake, fix]) => ({ mistake, fix })),
});

export const carousels: Carousel[] = [
  set("leads", "5 Meta Ads Mistakes Killing Your Leads", [
    ["Too many targeting restrictions.", "Use broader suggestions. Keep location as the main limit."],
    ["Using Traffic campaigns for lead generation.", "Use the Leads objective."],
    ["Excluding leads who haven’t converted yet.", "Exclude buyers — not every previous lead."],
    ["Splitting your budget across too many ad sets.", "Keep the structure simple. One ad set is often enough."],
    ["Not sending sales data back to Meta.", "Use Conversions API to send CRM outcomes back to Meta."],
  ]),
  set("numbers", "5 Meta Ads Numbers That Are Lying to You", [
    ["Trusting “CTR (All).”", "Check link CTR instead."],
    ["Judging yesterday’s CPL.", "Look at a wider date range."],
    ["Pausing placements by CPL.", "Judge the overall campaign result."],
    ["Celebrating video views.", "Check deeper watch time."],
    ["Trusting only Meta’s lead count.", "Match it with your CRM."],
  ]),
  set("site-visits", "5 Meta Ads Mistakes Killing Your Site Visits", [
    ["Optimising only for form fills.", "Send site visits back from your CRM."],
    ["Using “More Volume.”", "Test “Higher Intent” + one budget question."],
    ["Ignoring placement quality.", "Check which placements bring better leads."],
    ["Editing campaigns every day.", "Batch changes and let them stabilise."],
    ["Hiding buying details.", "Show price, BHK and location."],
  ]),
  set("settings", "5 Settings Every Real Estate Ad Account Gets Wrong", [
    ["Leaving creative enhancements unchecked.", "Review each enhancement before publishing."],
    ["Ignoring your age breakdown.", "Check which age groups actually convert."],
    ["Not excluding existing buyers.", "Upload your buyer list as an exclusion."],
    ["Running ads without instant follow-up.", "Use WhatsApp auto-replies when needed."],
    ["Keeping the default thank-you action.", "Send leads to call or WhatsApp."],
  ]),
  set("lead-forms", "5 Lead Form Mistakes Wasting Your Ad Budget", [
    ["No intro screen.", "Show price and location first."],
    ["Budget as a text box.", "Give budget options to choose from."],
    ["Not asking buying timeline.", "Ask when they plan to buy."],
    ["Unverified phone numbers.", "Verify the number before submission."],
    ["Checking leads manually.", "Connect your forms to your CRM."],
  ]),
  set("tracking", "5 Tracking Mistakes Hiding Your Real Results", [
    ["Counting page refreshes as leads.", "Fire the lead event only on real submits."],
    ["No URL tracking on your ads.", "Add UTMs to every link."],
    ["Sending weak match data.", "Send phone and email with each event."],
    ["Using the wrong attribution window.", "Check results with a suitable click window."],
    ["Not tagging lead sources.", "Save source and placement in your CRM."],
  ]),
  set("budget", "5 Budget Mistakes Real Estate Developers Make", [
    ["Splitting a small budget too much.", "Run 1–2 ad sets."],
    ["Doubling budget overnight.", "Increase it gradually."],
    ["Budget too low for learning.", "Give each ad set enough conversion volume."],
    ["Panicking over one expensive day.", "Judge spend over a wider period."],
    ["Switching ads off completely.", "Reduce budget instead of going dark."],
  ]),
];
