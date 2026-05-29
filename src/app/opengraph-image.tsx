import { ImageResponse } from "next/og";

import { loadContent } from "@/content/load";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Resume";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  const { site } = loadContent();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          opacity: 0.55,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        Resume
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            display: "flex",
          }}
        >
          {site.ownerName}
        </div>
        <div
          style={{
            fontSize: 42,
            marginTop: 32,
            opacity: 0.7,
            lineHeight: 1.2,
            display: "flex",
          }}
        >
          {site.tagline}
        </div>
      </div>
    </div>,
    size,
  );
}
