"use client";

import { useState, useEffect } from "react";
import { PataphysicalLink } from "./PataphysicalLink";
import { IconGithub, IconLinkedin, IconDocument, IconArrowUpRight } from "@/components/Icons";
import { useIntersectionObserver } from "@/lib/hooks";

/**
 * Floating contact dock — fixed to the left edge on desktop, collapses to a
 * slim tab. Opens on hover/focus to reveal Resume, LinkedIn, GitHub links.
 * Tracks resume clicks via a lightweight API call.
 */
export function ContactDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, isVisible] = useIntersectionObserver({ rootMargin: "0px 0px -100px 0px" });
  const [hasScrolled, setHasScrolled] = useState(false);

  // Show the dock only after user has scrolled past the hero
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleResumeClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the navigation happen, but fire a tracking request
    // We don't await this so navigation isn't blocked
    try {
      await fetch("/api/track-resume-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          referrer: document.referrer || "direct",
          userAgent: navigator.userAgent,
        }),
        keepalive: true, // Ensure request completes even if page unloads
      });
    } catch {
      // Silently fail — tracking should never break the user's navigation
    }
  };

  if (!hasScrolled) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab" && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={ref}
      className={`contact-dock${isOpen ? " is-open" : ""}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={(e) => {
        if (!isOpen && e.currentTarget.contains(e.relatedTarget)) return;
        setIsOpen(true);
      }}
      onBlur={(e) => {
        if (isOpen && e.currentTarget.contains(e.relatedTarget)) return;
        setIsOpen(false);
      }}
      onKeyDown={handleKeyDown}
      aria-label="Contact links"
      tabIndex={0}
    >
      <button
        className="contact-dock-tab"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="contact-dock-panel"
        aria-label={isOpen ? "Close contact links" : "Open contact links"}
      >
        <span className="contact-dock-tab-label">CONTACT</span>
        <IconDocument size={14} className="contact-dock-icon" aria-hidden="true" />
      </button>

      <div
        id="contact-dock-panel"
        className="contact-dock-panel"
        role="navigation"
        aria-label="Contact and resume links"
      >
        <div className="contact-dock-head">
          <h2 className="contact-dock-title">Channels</h2>
        </div>

        <ul className="contact-dock-list">
          <li className="contact-dock-item">
            <a
              href="https://docs.google.com/document/d/16M1f4rKG04_-VaWSqXPdNxOyHO0wSPo8Yv5USj5_vrQ/edit?usp=sharing"
              target="_blank"
              rel="noreferrer noopener"
              className="contact-dock-link"
              onClick={handleResumeClick}
            >
              <IconDocument size={14} aria-hidden="true" />
              <span>Resume</span>
              <IconArrowUpRight size={10} aria-hidden="true" />
            </a>
          </li>
          <li className="contact-dock-item">
            <a
              href="https://www.linkedin.com/in/aaryan-singh-1b068828b/"
              target="_blank"
              rel="noreferrer noopener"
              className="contact-dock-link"
            >
              <IconLinkedin size={14} aria-hidden="true" />
              <span>LinkedIn</span>
              <IconArrowUpRight size={10} aria-hidden="true" />
            </a>
          </li>
          <li className="contact-dock-item">
            <a
              href="https://github.com/aaryxnblondead/"
              target="_blank"
              rel="noreferrer noopener"
              className="contact-dock-link"
            >
              <IconGithub size={14} aria-hidden="true" />
              <span>GitHub</span>
              <IconArrowUpRight size={10} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}