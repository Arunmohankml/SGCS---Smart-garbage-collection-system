import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "transparent",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 22 C40 12, 60 12, 72 22" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M35 30 C44 23, 56 23, 65 30" stroke="#93c5fd" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M50 36 C35 36, 24 47, 24 61 C24 77, 50 95, 50 95 C50 95, 76 77, 76 61 C76 47, 65 36, 50 36 Z" fill="#2563eb" />
          <circle cx="50" cy="58" r="14" fill="white" />
          <circle cx="50" cy="58" r="8.5" fill="#2563eb" />
          <circle cx="53.5" cy="55" r="2.5" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
