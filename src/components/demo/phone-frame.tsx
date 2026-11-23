const W = 390;
const H = 844;
const BEZEL = 12;

/** A phone-sized iframe, scaled to fit the presenter's screen. */
export function PhoneFrame({ src, title, caption, scale }: { src: string; title: string; caption: string; scale: number }) {
  return (
    <figure className="flex flex-col items-center gap-3">
      <figcaption className="text-center">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-xs text-white/60">{caption}</p>
      </figcaption>
      <div style={{ width: (W + BEZEL * 2) * scale, height: (H + BEZEL * 2) * scale }}>
        <div
          className="origin-top-left rounded-[56px] bg-neutral-950 shadow-2xl ring-1 ring-white/15"
          style={{ width: W + BEZEL * 2, height: H + BEZEL * 2, padding: BEZEL, transform: `scale(${scale})` }}
        >
          <iframe src={src} title={title} className="block rounded-[44px] bg-white" style={{ width: W, height: H }} />
        </div>
      </div>
    </figure>
  );
}
