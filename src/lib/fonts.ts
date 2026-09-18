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

export { archivo, spaceMono };