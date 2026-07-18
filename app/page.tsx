import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/landing/hero";
import { ProvaSocial } from "@/components/landing/prova-social";
import { Metodo } from "@/components/landing/metodo";
import { Resultados } from "@/components/landing/resultados";
import { Depoimentos } from "@/components/landing/depoimentos";
import { Suporte } from "@/components/landing/suporte";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="flex-1">
        <Hero />
        <ProvaSocial />
        <Metodo />
        <Resultados />
        <Depoimentos />
        <Suporte />
      </main>
      <Footer />
    </>
  );
}
