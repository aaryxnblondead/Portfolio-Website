// Design tokens for the portfolio site
// This file is the single source of truth for all design values
// Edit this file to make visual changes - no need to edit components

export const tokens = {
  colors: {
    paper: "#F2EEE6",
    paperSunk: "#E9E4D9",
    ink: "#171412",
    inkMuted: "#5A534B",
    rule: "#D4CCBD",
    accent: "#A83A16",
    accentCold: "#2C4A3E",
  },
  typography: {
    scale: {
      masthead: {
        desktop: "6.5rem",
        mobile: "3rem",
        lineHeight: 0.88,
        tracking: "-0.03em",
        family: "fraunces",
        weight: 300,
        wonk: true,
      },
      h1: {
        desktop: "3.25rem",
        mobile: "2.125rem",
        lineHeight: 1.02,
        tracking: "-0.02em",
        family: "fraunces",
        weight: 400,
      },
      h2: {
        desktop: "1.875rem",
        mobile: "1.5rem",
        lineHeight: 1.15,
        tracking: "-0.01em",
        family: "fraunces",
        weight: 400,
      },
      standfirst: {
        desktop: "1.5rem",
        mobile: "1.25rem",
        lineHeight: 1.45,
        tracking: "-0.005em",
        family: "fraunces",
        weight: 300,
      },
      body: {
        size: "1.0625rem",
        lineHeight: 1.65,
        tracking: 0,
        family: "archivo",
        weight: 400,
      },
      small: {
        size: "0.875rem",
        lineHeight: 1.55,
        tracking: 0,
        family: "archivo",
        weight: 400,
      },
      meta: {
        size: "0.6875rem",
        lineHeight: 1.3,
        tracking: "0.14em",
        uppercase: true,
        family: "space-mono",
        weight: 400,
      },
      metric: {
        size: "1.5rem",
        lineHeight: 1.1,
        tracking: "-0.01em",
        family: "space-mono",
        weight: 700,
        tabularNums: true,
      },
    },
  },
  grid: {
    baseUnit: 8,
    columns: 12,
    maxWidth: "1200px",
    gutters: "24px",
    railColumns: 2,
    contentStart: 3,
    contentEnd: 10,
    mobileMargin: "20px",
    sectionGapDesktop: "128px",
    sectionGapMobile: "72px",
    relatedGapDesktop: "64px",
  },
  motion: {
    wipeDuration: "420ms",
    wipeEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
    wipeDelay: "80ms",
    fadeDuration: "200ms",
    fadeEasing: "ease-out",
    linkHover: "180ms",
  },
  spacing: {
    multiples: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 112, 128, 160, 192, 224, 256],
  },
  borderRadius: {
    base: 0,
    exception: "4px", // One deliberate exception
  },
};