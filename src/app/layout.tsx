import "@/styles/globals.css";
import "@/styles/components.css";
import { fraunces, archivo, spaceMono } from "@/lib/fonts";

export const metadata = {
  title: {
    default: "Aaryan Singh | Portfolio",
    template: "%s | Aaryan Singh",
  },
  description: "Applied machine learning engineer based in Mumbai. Works on retrieval systems, on-device inference, and generative models for financial time series.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://aaryansingh.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2EEE6",
  backgroundColor: "#F2EEE6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${fraunces.variable} ${archivo.variable} ${spaceMono.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href="https://aaryansingh.com/" />
      </head>
      <body className="bg-paper text-ink font-archivo" lang="en-IN">
        <a
          href="#main"
          className="skip-link"
        >
          Skip to main content
        </a>

        {children}

        <SchemaJSON />
      </body>
    </html>
  );
}

function SchemaJSON() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Aaryan Singh",
          url: "https://aaryansingh.com",
          sameAs: [
            "https://github.com/aaryxnblondead",
            "https://www.linkedin.com/in/aaryan-singh-1b068828b/",
          ],
          email: "aaryansingh2810@gmail.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Mumbai",
            addressCountry: "IN",
          },
          jobTitle: "Applied Machine Learning Engineer",
        }),
      }}
    />
  );
}