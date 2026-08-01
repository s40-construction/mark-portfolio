import { ImageResponse } from "next/og";

export const alt = "Mark Keneth Bonquin - Frontend Developer";
export const contentType = "image/png";
export const size = { height: 630, width: 1200 };

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ alignItems: "stretch", background: "#f8f7f2", color: "#292825", display: "flex", height: "100%", padding: "66px", position: "relative", width: "100%" }}>
        <div style={{ border: "1px solid rgba(41,40,37,0.2)", display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "42px" }}>
          <div style={{ color: "#6d6b66", display: "flex", fontFamily: "monospace", fontSize: "18px", textTransform: "uppercase" }}>Portfolio / 2026</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "serif", fontSize: "96px", letterSpacing: "0", lineHeight: 0.85 }}>Mark Keneth</div>
            <div style={{ color: "#236bb7", display: "flex", fontFamily: "serif", fontSize: "96px", letterSpacing: "0", lineHeight: 0.85, marginLeft: "72px" }}>Bonquin</div>
          </div>
          <div style={{ color: "#4e4c47", display: "flex", fontFamily: "monospace", fontSize: "18px", textTransform: "uppercase" }}>Frontend Developer / Information Systems Graduate</div>
        </div>
      </div>
    ),
    size,
  );
}