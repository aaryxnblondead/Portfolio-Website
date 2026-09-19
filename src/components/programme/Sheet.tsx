import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Grid primitives. Columns 1-2 carry numbers, 3-10 carry reading matter,
 * 11 carries deliberate breaks, 12 stays void. Nothing outside this file
 * should hand-write column placement for programme pages.
 */

type SheetProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Sheet({ as: Tag = "section", className = "", children, ...rest }: SheetProps) {
  return (
    <Tag className={`pSheet ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

type DivProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: ReactNode;
};

/** Columns 1-2. Section numbers, never prose. */
export function Rail({ className = "", children, ...rest }: DivProps) {
  return (
    <div className={`pRail ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Columns 3-10. Everything legible lives here. */
export function Content({ className = "", children, ...rest }: DivProps) {
  return (
    <div className={`pContent ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Column 11. Empty by default; deliberate breaks only. Hidden below 900px. */
export function Bleed({ className = "", children, ...rest }: DivProps) {
  return (
    <div className={`pBleed ${className}`} {...rest}>
      {children}
    </div>
  );
}

/** Escapes the sheet entirely. Once per page. */
export function FullBleed({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: SheetProps) {
  return (
    <Tag className={`pFull ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
