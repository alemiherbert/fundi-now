export const BRAND_HEX = "#2a5bd7";

/** App icon drawn for next/og ImageResponse (inline styles only). */
export function AppIcon({ size, maskable = false }: { size: number; maskable?: boolean }) {
  // Maskable icons keep the glyph inside the central safe zone and fill the whole square.
  const glyph = size * (maskable ? 0.46 : 0.56);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_HEX,
        borderRadius: maskable ? 0 : size * 0.22,
      }}
    >
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    </div>
  );
}
