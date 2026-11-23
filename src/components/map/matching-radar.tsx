export function MatchingRadar() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div className="relative size-28">
        {[0, 0.8, 1.6].map((delay) => (
          <span
            key={delay}
            className="fn-radar absolute inset-0 rounded-full bg-primary/30"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}
