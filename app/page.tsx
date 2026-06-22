import Hero from "./components/Hero";
import StatsGrid from "./components/StatsGrid";
import Drivers from "./components/Drivers";
import Standings from "./components/Standings";
import Faq from "./components/Faq";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import { getNextRace } from "@/lib/f1/nextRace";

export default async function Home() {
  const nextRace = await getNextRace();

  return (
    <div className="lightApp">
      <main>
        <Hero nextRace={nextRace} />
        <StatsGrid nextRace={nextRace} />
        <Drivers />
        <Standings />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
