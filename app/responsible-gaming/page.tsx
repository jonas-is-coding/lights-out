import type { Metadata } from "next";
import FooterInfoPage from "../components/FooterInfoPage";
import { footerPages } from "../footerPageContent";

const page = footerPages["responsible-gaming"];

export const metadata: Metadata = {
  title: `${page.label} | LIGHTS OUT`,
  description: page.subtitle,
};

export default function ResponsibleGamingPage() {
  return <FooterInfoPage page={page} />;
}
