export function Still({
  src,
  alt,
  caption,
  aspect = "4 / 5",
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <figure className={["still", className].filter(Boolean).join(" ")} style={{ "--still-aspect": aspect } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="still-img" src={src} alt={alt} loading="lazy" decoding="async" />
      {caption ? <figcaption className="still-caption">{caption}</figcaption> : null}
    </figure>
  );
}

export function StillPair({ children }: { children: React.ReactNode }) {
  return <div className="still-pair">{children}</div>;
}
