"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChartRadar,
  IconHome,
  IconLogout,
  IconTargetArrow,
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

const ITENS: ItemNav[] = [
  { href: "/aluno", rotulo: "Início", Icone: IconHome, segmento: "/aluno" },
  {
    href: "/aluno/quiz",
    rotulo: "Quiz",
    Icone: IconTargetArrow,
    segmento: "/aluno/quiz",
  },
  {
    href: "/aluno#desempenho",
    rotulo: "Desempenho",
    Icone: IconChartRadar,
    segmento: "#desempenho",
  },
];

/** Marca ativo por segmento de rota (o link de âncora nunca vira "ativo"). */
function ehAtivo(pathname: string, item: ItemNav): boolean {
  if (item.segmento.startsWith("#")) return false;
  if (item.segmento === "/aluno") return pathname === "/aluno";
  return pathname.startsWith(item.segmento);
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

export function NavAluno() {
  const pathname = usePathname();

  return (
    <>
      {/* Rail lateral fina — tablet/desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col items-center border-r border-border bg-surface py-4 md:flex">
        <Link href="/aluno" aria-label="Ir para o início">
          <LogoMarca />
        </Link>

        <nav aria-label="Navegação do aluno" className="mt-6 flex flex-1 flex-col gap-1">
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
        <Link href="/aluno" aria-label="Ir para o início">
          <LogoMarca />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <BotaoSair compacto />
        </div>
      </header>

      {/* Barra inferior fixa — mobile */}
      <nav
        aria-label="Navegação do aluno"
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {ITENS.map((item) => {
          const ativo = ehAtivo(pathname, item);
          return (
            <Link
              key={item.rotulo}
              href={item.href}
              aria-current={ativo ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                ativo ? "text-roxo" : "text-muted"
              }`}
            >
              <item.Icone className="size-6" stroke={1.75} />
              {item.rotulo}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
