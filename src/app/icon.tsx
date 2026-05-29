import { ImageResponse } from "next/og";

import { loadContent } from "@/content/load";
import { ownerInitials } from "@/lib/owner-name";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Icon() {
  const { site } = loadContent();
  const initials = ownerInitials(site.ownerName);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: "-0.05em",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {initials}
    </div>,
    size,
  );
}
