import { Archivo } from "next/font/google";
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-archivo",
  display: "optional",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

/**
 * Second Archivo instance carrying the width axis. The TLOP wall alternates
 * condensed and expanded cuts of one word; without wdth every pass renders
 * the same width and the effect dies (Gate 2 in the brief). Body text keeps
 * using the instance above, so nothing else changes cut.
 */
const archivoWdth = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  weight: "variable",
  variable: "--font-archivo-wdth",
  display: "optional",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

import { Space_Mono } from "next/font/google";
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "optional",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

export { archivo, archivoWdth, spaceMono };
