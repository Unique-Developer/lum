import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lumin Art – Professional Lighting Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0a2634 0%, #114f75 50%, #0a2634 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Light is not a product
          </p>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Lumin Art
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Professional Lighting Solutions
          </p>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              marginTop: 24,
            }}
          >
            Light House · 23 years of legacy
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
