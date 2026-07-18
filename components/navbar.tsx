"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/login", rotulo: "Ambiente do Aluno" },
  { href: "/login?perfil=professor", rotulo: "Ambiente do Professor" },
  { href: "#contato", rotulo: "Contato" },
];

export function Navbar() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const sentinelaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  // Sentinela no topo da página: quando sai da viewport, a navbar
  // troca de transparente (sobre o mesh) para glass. Sem scroll listener.
  useEffect(() => {
    const el = sentinelaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setRolou(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Menu mobile aberto exige fundo sólido, mesmo no topo
  const transparente = !rolou && !aberto;

  return (
    <>
      <div
        ref={sentinelaRef}
        aria-hidden
        className="pointer-events-none absolute top-0 h-6 w-px"
      />
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
          transparente ? "nav-topo" : "nav-blur border-border"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl"
            onClick={() => setAberto(false)}
          >
            <Image
              src="/4k-logo.svg"
              alt=""
              width={38}
              height={38}
              priority
              className="size-9 md:size-10"
            />
            <span
              className={`text-base font-semibold tracking-tight ${
                transparente ? "text-on-dark" : "text-ink"
              }`}
            >
              4K Vestibulares
            </span>
          </Link>

          {/* Desktop */}
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.rotulo}
                href={link.href}
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-alt"
              >
                {link.rotulo}
              </Link>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              ref={botaoRef}
              type="button"
              aria-expanded={aberto}
              aria-controls="menu-mobile"
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              onClick={() => setAberto((v) => !v)}
              className="inline-flex size-11 items-center justify-center rounded-xl border border-border text-ink transition-colors hover:bg-surface-alt"
            >
              {aberto ? (
                <IconX className="size-5" aria-hidden />
              ) : (
                <IconMenu2 className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>

        {aberto && (
          <nav
            id="menu-mobile"
            aria-label="Principal"
            className="border-t border-border bg-surface px-4 py-3 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <li key={link.rotulo}>
                  <Link
                    href={link.href}
                    onClick={() => setAberto(false)}
                    className="block rounded-xl px-3.5 py-3 text-base font-medium text-ink transition-colors hover:bg-surface-alt"
                  >
                    {link.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
