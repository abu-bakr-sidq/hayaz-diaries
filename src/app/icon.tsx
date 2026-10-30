import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const serif = await readFile(join(process.cwd(), "src/assets/og/InstrumentSerif-Italic.ttf"));

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6b1f2c",
          borderRadius: 16,
          color: "#f3ede3",
          fontFamily: "Serif",
          fontSize: 54,
          paddingBottom: 8,
        }}
      >
        h
      </div>
    ),
    { ...size, fonts: [{ name: "Serif", data: serif, style: "italic", weight: 400 }] },
  );
}
