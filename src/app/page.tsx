import { PhotoBelt } from "@/components/PhotoBelt";
import { ProgrammeNav } from "@/components/programme/ProgrammeNav";
import { SiteFooter } from "@/components/programme/SiteFooter";
import { HomeHero } from "@/components/programme/HomeHero";
import { SelectedWork } from "@/components/programme/SelectedWork";
import { STRIP_ITEMS } from "@/lib/programme-photos";

export const metadata = {
  title: "Aaryan Singh | Machine learning systems",
  description: "Aaryan Singh builds applied machine learning systems for the edge, the cloud, and the space between.",
};

export default function HomePage() {
  return (
    <div className="pHome">
      <ProgrammeNav
        mark="AS / 26"
        links={[
          { label: "Work", href: "/work" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "#contact" },
        ]}
      />

      <main id="main">
        <HomeHero />
        <SelectedWork />
        <PhotoBelt label="Reading + group frames + Samvad run" start={1} items={STRIP_ITEMS} />
      </main>

      <SiteFooter />
    </div>
  );
}
