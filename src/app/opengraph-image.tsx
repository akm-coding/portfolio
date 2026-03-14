import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"
export const alt = "Aung Kaung Myat - Full Stack Developer"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          Aung Kaung Myat
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            marginBottom: 32,
          }}
        >
          Full Stack Developer
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["React Native", "TypeScript", "Next.js"].map((tech) => (
            <div
              key={tech}
              style={{
                fontSize: 20,
                color: "#71717a",
                border: "1px solid #27272a",
                borderRadius: 8,
                padding: "8px 16px",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
