import { useIntersectionObserver, usePrefersReducedMotion } from "@/lib/hooks";
import { use } from "react";

interface WipeInProps {
  children: React.ReactNode;
  delay?: boolean;
  className?: string;
}

export function WipeIn({ children, delay = false, className }: WipeInProps) {
  const [ref, isVisible] = useIntersectionObserver();
  const prefersReduced = usePrefersReducedMotion();

  const classes = [
    "relative",
    className || "",
  ];

  const ruleClasses = [
    "absolute left-0 top-0 h-px w-full bg-rule transition-[clip-path] duration-[420ms]",
    "cubic-bezier(0.16,_1,_0.3,_1) forwards",
  ];

  const headlineClasses = [
    "relative",
    className || "",
    isVisible ? "opacity-100" : "opacity-0",
    "transition-opacity duration-[200ms] ease-out",
  ];

  if (delay) {
    headlineClasses.push(isVisible ? "delay-[80ms]" : "");
  }

  if (prefersReduced) {
    // Render final states immediately with no animation
    return (
      <div ref={ref} className={classes.join(" ")}>
        <div className="h-px w-full bg-rule mb-2" />
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={classes.join(" ")}>
      {!isVisible ? (
        <div className="h-px w-full bg-rule mb-2" />
      ) : (
        <div
          className={[
            "h-px w-full bg-rule mb-2 origin-left",
            "animate-[wipe_420ms_cubic-bezier(0.16,_1,_0.3,_1)_forwards]",
          ].join(" ")}
        />
      )}
      <div className={headlineClasses.join(" ")}>{children}</div>
    </div>
  );
}

export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={[
        className || "",
        "transition-opacity duration-[200ms] ease-out",
        isVisible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
}