import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fbff",
          color: "#07111f",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "88px", height: "88px", borderRadius: "18px", background: "#7dd3fc", color: "#07111f", fontSize: "36px", fontWeight: 800 }}>IA</div>
          <div style={{ display: "flex", fontSize: "38px", fontWeight: 800 }}>IAMM</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", maxWidth: "880px", fontSize: "76px", lineHeight: 1.04, fontWeight: 800, letterSpacing: "0" }}>AI automation for modern businesses</div>
          <div style={{ display: "flex", marginTop: "30px", maxWidth: "820px", color: "#475569", fontSize: "30px", lineHeight: 1.35 }}>Save time, reduce manual work, and build smarter workflows with practical AI systems.</div>
        </div>
        <div style={{ display: "flex", gap: "18px", color: "#1e293b", fontSize: "24px", fontWeight: 700 }}>
          <span>AI Automation</span>
          <span>Workflow Optimization</span>
          <span>Digital Solutions</span>
        </div>
      </div>
    ),
    size,
  );
}
