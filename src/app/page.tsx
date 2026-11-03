import Cover from "@/components/sections/Cover";
import Contents from "@/components/sections/Contents";
import Ticker from "@/components/sections/Ticker";
import Writer from "@/components/sections/Writer";
import HookLab from "@/components/sections/HookLab";
import Reels from "@/components/sections/Reels";
import SwipeFile from "@/components/sections/SwipeFile";
import SeoDesk from "@/components/sections/SeoDesk";
import LiveSites from "@/components/sections/LiveSites";
import UnderTheHood from "@/components/sections/UnderTheHood";
import InHerBag from "@/components/sections/InHerBag";
import Journey from "@/components/sections/Journey";
import Certified from "@/components/sections/Certified";
import Wall from "@/components/sections/Wall";
import WriteToMe from "@/components/sections/WriteToMe";
import Footer from "@/components/layout/Footer";
import MotionController from "@/components/motion/MotionController";
import { getInstagramStats } from "@/lib/instagram";

export default async function Home() {
  const ig = await getInstagramStats();
  return (
    <>
      <main id="main">
        <Cover followers={ig.followers} posts={ig.posts} />
        <Contents />
        <Ticker />
        <Writer />
        <HookLab />
        <Reels />
        <SwipeFile />
        <SeoDesk />
        <LiveSites />
        <UnderTheHood />
        <InHerBag />
        <Journey />
        <Certified />
        <Wall />
        <WriteToMe />
      </main>
      <Footer />
      <MotionController />
    </>
  );
}
