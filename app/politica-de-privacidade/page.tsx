import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/landing/footer";
import { WHATSAPP_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Política de Privacidade — 4K Vestibulares",
  description:
    "Saiba como o 4K Vestibulares coleta, usa e protege as suas informações pessoais em nossas plataformas.",
};

/**
 * Página de leitura longa: tipografia Inter, largura de leitura (~65ch),
 * sem grid quadriculado (DESIGN.md — grid nunca atrás de texto de estudo
 * ou leitura). Tema claro/escuro via tokens, como todo o resto.
 */
export default function PoliticaDePrivacidade() {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="pagina-leitura flex-1">
        <article className="mx-auto max-w-[65ch] px-4 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Política de Privacidade
          </h1>

          <p className="mt-6 text-base leading-relaxed text-ink">
            A sua privacidade é importante para nós. É política do 4K
            Vestibulares respeitar a sua privacidade em relação a qualquer
            informação sua que possamos coletar em nossas plataformas.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-ink">
            Coleta de dados
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Solicitamos informações pessoais apenas quando realmente precisamos
            delas para lhe fornecer um serviço. Fazemos isso por meios justos e
            legais, com o seu conhecimento e consentimento. Também informamos
            por que estamos coletando e como a informação será usada.
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Retemos as informações coletadas apenas pelo tempo necessário para
            fornecer o serviço solicitado.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-ink">
            Proteção de dados
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Quando armazenamos dados, protegemos dentro de meios comercialmente
            aceitáveis para evitar perdas e roubos, bem como acesso,
            divulgação, cópia, uso ou modificação não autorizados.
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Não compartilhamos informações de identificação pessoal
            publicamente ou com terceiros, exceto quando exigido por lei.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-ink">
            Sites de terceiros
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Nosso site pode ter links para sites externos que não são operados
            por nós. Esteja ciente de que não temos controle sobre o conteúdo e
            as práticas desses sites e não podemos aceitar responsabilidade por
            suas respectivas políticas de privacidade.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-ink">
            Publicidade e cookies
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink">
            O serviço Google AdSense que usamos para veicular publicidade usa
            um cookie DoubleClick para veicular anúncios mais relevantes em
            toda a web e limitar o número de vezes que um determinado anúncio é
            exibido para você.
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Os cookies de rastreamento de afiliados permitem creditar
            corretamente os nossos parceiros pelas indicações feitas a você.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-ink">
            Compromisso do usuário
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink">
            O usuário se compromete a fazer uso adequado dos conteúdos e das
            informações que o 4K Vestibulares oferece, e ainda a:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-relaxed text-ink">
            <li>
              não se envolver em atividades que sejam ilegais ou contrárias à
              boa fé e à ordem pública;
            </li>
            <li>
              não difundir conteúdo de caráter ilícito ou contrário aos
              direitos humanos;
            </li>
            <li>
              não causar danos aos sistemas físicos (hardware) e lógicos
              (software) da plataforma.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold text-ink">
            Mais informações
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Esperamos que esteja esclarecido. Se você ainda tiver alguma
            dúvida sobre esta política, fale com a gente pelo{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-roxo underline underline-offset-4 transition-colors hover:opacity-80"
            >
              WhatsApp
            </a>
            .
          </p>

          <p className="mt-10 border-t border-border pt-6 text-sm text-muted">
            Esta política é efetiva a partir de 24 de novembro de 2025.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
