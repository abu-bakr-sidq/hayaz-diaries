import { ImageResponse } from "next/og";
import { DiaryIcon, monogramFont } from "@/lib/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const serif = await monogramFont;

// Home-screen tiles can't be transparent, so the diary sits on the site's paper.
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 6,
          background: "radial-gradient(circle at 50% 40%, #fbf8f2, #f3ede3 50%, #e2d7c4)",
        }}
      >
        <DiaryIcon scale={2.3} />
      </div>
    ),
    { ...size, fonts: [{ name: "Serif", data: serif, style: "italic", weight: 400 }] },
  );
}
