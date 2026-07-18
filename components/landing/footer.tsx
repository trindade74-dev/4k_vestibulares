import Image from "next/image";
import Link from "next/link";
import { IconBrandWhatsapp, IconMapPin } from "@tabler/icons-react";
import { MAPS_URL, WHATSAPP_URL } from "@/lib/links";

export function Footer() {
  return (
    <footer id="contato" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/4k-logo.svg" alt="" width={36} height={36} />
            <span className="text-base font-semibold text-ink">
              4K Vestibulares
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            O pré-vestibular que mais aprova na UnB, em Taguatinga. Turmas para
            PAS, ENEM e MED.
          </p>
        </div>

        <nav aria-label="Acesso à plataforma">
          <h2 className="text-sm font-semibold text-ink">Plataforma</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/login"
                className="text-muted transition-colors hover:text-roxo"
              >
                Ambiente do Aluno
              </Link>
            </li>
            <li>
              <Link
                href="/login?perfil=professor"
                className="text-muted transition-colors hover:text-roxo"
              >
                Ambiente do Professor
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-ink">Contato</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-roxo"
              >
                <IconBrandWhatsapp className="size-4.5" aria-hidden />
                WhatsApp: (61) 9563-2944
              </a>
            </li>
            <li>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver localização da 4K no Google Maps"
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-roxo"
              >
                <IconMapPin className="size-4.5" aria-hidden />
                Taguatinga, Distrito Federal
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row md:px-8">
          <p>© 2026 4K Vestibulares. Todos os direitos reservados.</p>
          <Link
            href="/politica-de-privacidade"
            className="transition-colors hover:text-roxo"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
