import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab icon — Upwork green with U mark */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14A800",
          borderRadius: 8,
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "Arial, sans-serif",
          letterSpacing: -1,
        }}
      >
        U
      </div>
    ),
    { ...size }
  );
}
