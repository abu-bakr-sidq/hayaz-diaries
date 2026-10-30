import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Hayaz Diaries — S. Thasneem, content writer & SEO analyst in Chennai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));

// Read at module scope so the image can be prerendered at build time.
const [serif, serifItalic, mono, portrait] = await Promise.all([
  asset("InstrumentSerif-Regular.ttf"),
  asset("InstrumentSerif-Italic.ttf"),
  asset("CourierPrime-Regular.ttf"),
  asset("portrait.png"),
]);
const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f3ede3", color: "#14110f", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 70,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(205,185,156,0.75), rgba(243,237,227,0) 70%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 0 56px 64px", width: 760 }}>
          <div style={{ display: "flex", fontFamily: "Courier", fontSize: 20, letterSpacing: 4, color: "#6b6258" }}>
            VOL. 01 — THE WRITER’S ISSUE
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Serif", fontSize: 250, lineHeight: 0.8, letterSpacing: -10 }}>HAYAZ</div>
            <div style={{ display: "flex", fontFamily: "SerifItalic", fontSize: 104, color: "#6b1f2c", marginTop: 6, marginLeft: 210 }}>diaries_</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", fontFamily: "Serif", fontSize: 46, lineHeight: 1 }}>Words that stop the scroll.</div>
            <div style={{ display: "flex", fontFamily: "Courier", fontSize: 20, letterSpacing: 2, color: "#6b6258" }}>
              S. THASNEEM · CONTENT WRITER & SEO ANALYST · CHENNAI
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={portraitSrc} width={458} height={600} alt="" style={{ position: "absolute", right: 70, bottom: 0 }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, style: "normal", weight: 400 },
        { name: "SerifItalic", data: serifItalic, style: "italic", weight: 400 },
        { name: "Courier", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
