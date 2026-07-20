import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar — 4K Vestibulares",
  description:
    "Acesse a Plataforma 4K Vestibulares: entre com sua conta, crie um cadastro ou recupere sua senha.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-20">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <IconArrowLeft size={16} aria-hidden />
          Voltar ao site
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 sm:p-8">
        <Image
          src="/4k-logo.svg"
          alt="4K Vestibulares"
          width={52}
          height={52}
          priority
          className="mx-auto mb-6"
        />
        <LoginForm linkInvalido={erro === "link-invalido"} />
      </div>
    </main>
  );
}
