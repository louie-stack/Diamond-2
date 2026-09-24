import Motion from "@/components/Motion";
import Loader from "@/components/Loader";
import SoundToggle from "@/components/SoundToggle";
import Newspaper from "@/components/Newspaper";
import Sting from "@/components/Sting";
import Nav from "@/components/Nav";
import Hero, { Ticker } from "@/components/Hero";
import { TheCase, EvidenceBoard, Wanted, Interrogation } from "@/components/Story";
import { Declassified, Memo, Transcript, Locker, CaseClosed, Surveillance, Footer } from "@/components/Files";

export default function Page() {
  return (
    <main>
      <Motion />
      <Loader />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <Hero />
      <Ticker />
      <Newspaper />
      <TheCase />
      <EvidenceBoard />
      <Sting />
      <Wanted />
      <Interrogation />
      <Declassified />
      <Memo />
      <Transcript />
      <Locker />
      <CaseClosed />
      <Surveillance />
      <Footer />
      <SoundToggle />
    </main>
  );
}
