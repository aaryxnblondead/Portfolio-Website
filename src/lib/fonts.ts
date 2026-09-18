import { Fraunces } from "next/font/google";

// Loaded as the true variable font (no fixed `weight` array) so the
// opsz / SOFT / WONK axes are actually present in the served file.
// A static-weight instance (the old config) carries none of these axes,
// which is why "wonk" never showed up no matter what CSS was applied to it.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "optional",
  fallback: ["Georgia", "serif"],
});

import { Archivo } from "next/font/google";
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-archivo",
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

export { fraunces, archivo, spaceMono };