import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import { MatriculaWizard } from "@/components/matricula/matricula-wizard";

export const metadata: Metadata = {
  title: "Matrícula — 4K Vestibulares",
  description:
    "Faça sua pré-matrícula no 4K Vestibulares em poucos passos e confirme sua vaga direto pelo WhatsApp.",
};

/**
 * Página de formulário (não de leitura longa, mas reaproveita
 * `.pagina-leitura` só para a navbar renderizar sólida desde o topo —
 * não há hero mesh escuro aqui). Sem grid quadriculado: DESIGN.md diz
 * que grid nunca vai atrás de formulário.
 */
export default function MatriculaPage() {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="pagina-leitura flex-1">
        <div className="mx-auto max-w-xl px-4 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
          <div className="text-center">
            <h1 className="titulo-impacto text-3xl text-ink sm:text-4xl">
              Matrícula
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Preencha seus dados em 4 passos rápidos. No final, você fala
              direto com a gente pelo WhatsApp para confirmar sua vaga.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
            <MatriculaWizard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
