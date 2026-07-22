import Link from "next/link";
import { IconBell } from "@tabler/icons-react";

/**
 * Sino de avisos no cabeçalho (não na barra inferior — essa já tem 5 itens).
 * Componente simples de navegação: não precisa de estado no cliente. O
 * pontinho de não lidos usa roxo, nunca verde (DESIGN.md: verde só em
 * ação/acerto).
 */
export function SinoAvisos({ naoLidos }: { naoLidos: number }) {
  const temNaoLidos = naoLidos > 0;

  return (
    <Link
      href="/aluno/avisos"
      aria-label={
        temNaoLidos
          ? `Avisos (${naoLidos} não ${naoLidos === 1 ? "lido" : "lidos"})`
          : "Avisos"
      }
      className="relative inline-flex size-11 items-center justify-center rounded-xl border border-border text-ink transition-colors hover:bg-surface-alt"
    >
      <IconBell className="size-5" stroke={1.75} />
      {temNaoLidos && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 flex size-2.5 rounded-full bg-roxo ring-2 ring-surface"
        />
      )}
    </Link>
  );
}
