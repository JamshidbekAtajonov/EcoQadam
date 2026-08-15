import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 112, background: "linear-gradient(145deg, #123e35, #278b68)", color: "white", fontSize: 290, fontWeight: 800, fontFamily: "sans-serif" }}>
      E
      <div style={{ position: "absolute", width: 120, height: 185, marginLeft: 210, marginTop: -185, borderRadius: "100% 0 100% 0", transform: "rotate(25deg)", background: "#73dc9f" }} />
    </div>,
    { ...size },
  );
}
