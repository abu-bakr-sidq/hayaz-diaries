import Cover from "@/components/sections/Cover";
import Contents from "@/components/sections/Contents";
import Ticker from "@/components/sections/Ticker";
import Writer from "@/components/sections/Writer";
import HookLab from "@/components/sections/HookLab";
import Reels from "@/components/sections/Reels";
import SwipeFile from "@/components/sections/SwipeFile";
import SeoDesk from "@/components/sections/SeoDesk";
import UnderTheHood from "@/components/sections/UnderTheHood";
import InHerBag from "@/components/sections/InHerBag";
import Journey from "@/components/sections/Journey";
import Wall from "@/components/sections/Wall";
import WriteToMe from "@/components/sections/WriteToMe";
import Footer from "@/components/layout/Footer";
import MotionController from "@/components/motion/MotionController";

export default function Home() {
  return (
    <>
      <main id="main">
        <Cover />
        <Contents />
        <Ticker />
        <Writer />
        <HookLab />
        <Reels />
        <SwipeFile />
        <SeoDesk />
        <UnderTheHood />
        <InHerBag />
        <Journey />
        <Wall />
        <WriteToMe />
      </main>
      <Footer />
      <MotionController />
    </>
  );
}
