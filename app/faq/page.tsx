import type { Metadata } from "next";
import FooterInfoPage from "../components/FooterInfoPage";
import { footerPages } from "../footerPageContent";

const page = footerPages.faq;

export const metadata: Metadata = {
  title: `${page.label} | LIGHTS OUT`,
  description: page.subtitle,
};

export default function FaqPage() {
  return <FooterInfoPage page={page} />;
}
