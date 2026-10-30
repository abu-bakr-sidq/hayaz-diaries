import { ImageResponse } from "next/og";
import { DiaryIcon, monogramFont } from "@/lib/brand-icon";

const serif = await monogramFont;

// A bold 32px cut for browser tabs and the full mark at 64px.
export function generateImageMetadata() {
  return [
    { id: "32", contentType: "image/png", size: { width: 32, height: 32 } },
    { id: "64", contentType: "image/png", size: { width: 64, height: 64 } },
  ];
}

// The diary on a transparent tile, so the tab shows the book itself.
export default async function Icon({ id }: { id: Promise<string | number> }) {
  const small = (await id) === "32";
  const px = small ? 32 : 64;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DiaryIcon scale={px / 64} small={small} />
      </div>
    ),
    { width: px, height: px, fonts: [{ name: "Serif", data: serif, style: "italic", weight: 400 }] },
  );
}
