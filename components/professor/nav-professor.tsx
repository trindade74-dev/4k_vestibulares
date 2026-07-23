"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendarEvent,
  IconFiles,
  IconHome,
  IconLogout,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { sair } from "@/lib/auth/actions";

type ItemNav = {
  href: string;
  rotulo: string;
  Icone: typeof IconHome;
  /** Segmento cujo prefixo marca o item como ativo. */
  segmento: string;
};

/**
 * 4 itens hoje (Início, Materiais, Monitorias, Avisos) — mesmo padrão de
 * crescimento fatia a fatia da nav do aluno (Questões, Redação e Recursos
 * chegam nas próximas fases).
 */
const ITENS: ItemNav[] = [
  {
    href: "/professor",
    rotulo: "Início",
    Icone: IconHome,
    segmento: "/professor",
  },
  {
    href: "/professor/materiais",
    rotulo: "Materiais",
    Icone: IconFiles,
    segmento: "/professor/materiais",
  },
  {
    href: "/professor/monitorias",
    rotulo: "Monitorias",
    Icone: IconCalendarEvent,
    segmento: "/professor/monitorias",
  },
  {
    href: "/professor/avisos",
    rotulo: "Avisos",
    Icone: IconSpeakerphone,
    segmento: "/professor/avisos",
  },
];

/**
 * Marca ativo por segmento — casa exato ou subrota (`seg/…`), evitando que
 * "/professor" acenda em tudo.
 */
function ehAtivo(pathname: string, item: ItemNav): boolean {
  const seg = item.segmento;
  if (seg === "/professor") return pathname === "/professor";
  return pathname === seg || pathname.startsWith(`${seg}/`);
}

function LogoMarca() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-roxo text-sm font-bold text-on-dark">
      4K
    </span>
  );
}

function BotaoSair({ compacto = false }: { compacto?: boolean }) {
  return (
    <form action={sair}>
      {compacto ? (
        <button
          type="submit"
          aria-label="Sair da conta"
          className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:bg-surface-alt hover:text-ink"
        >
          <IconLogout className="size-5" stroke={1.75} />
        </button>
      ) : (
        <button
          type="submit"
          className="flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-muted transition-colors hover:bg-surface-alt hover:text-ink"
        >
          <IconLogout className="size-5" stroke={1.75} />
          Sair
        </button>
      )}
    </form>
  );
}

export function NavProfessor() {
  const pathname = usePathname();

  return (
    <>
      {/* Rail lateral fina — tablet/desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col items-center border-r border-border bg-surface py-4 md:flex">
        <Link href="/professor" aria-label="Ir para o início">
          <LogoMarca />
        </Link>

        <nav aria-label="Navegação do professor" className="mt-6 flex flex-1 flex-col gap-1">
          {ITENS.map((item) => {
            const ativo = ehAtivo(pathname, item);
            return (
              <Link
                key={item.rotulo}
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={`flex w-14 flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-medium transition-colors ${
                  ativo
                    ? "bg-surface-alt text-roxo"
                    : "text-muted hover:bg-surface-alt hover:text-ink"
                }`}
              >
                <item.Icone className="size-5" stroke={1.75} />
                {item.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-2">
          <ThemeToggle />
          <BotaoSair />
        </div>
      </aside>

      {/* Barra superior — mobile */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:hidden">
        <Link href="/professor" aria-label="Ir para o início">
          <LogoMarca />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <BotaoSair compacto />
        </div>
      </header>

      {/* Barra inferior fixa — mobile */}
      <nav
        aria-label="Navegação do professor"
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {ITENS.map((item) => {
          const ativo = ehAtivo(pathname, item);
          return (
            <Link
              key={item.rotulo}
              href={item.href}
              aria-current={ativo ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 px-0.5 py-2.5 text-[10px] font-medium leading-none transition-colors ${
                ativo ? "text-roxo" : "text-muted"
              }`}
            >
              <item.Icone className="size-6" stroke={1.75} />
              <span className="max-w-full truncate">{item.rotulo}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
