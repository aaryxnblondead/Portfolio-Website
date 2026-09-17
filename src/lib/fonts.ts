import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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