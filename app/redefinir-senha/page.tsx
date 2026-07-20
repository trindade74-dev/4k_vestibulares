import type { Metadata } from "next";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { RedefinirForm } from "./redefinir-form";

export const metadata: Metadata = {
  title: "Redefinir senha — 4K Vestibulares",
  description: "Defina uma nova senha para sua conta na Plataforma 4K.",
};

export default function RedefinirSenhaPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-20">
      <div className="absolute inset-x-0 top-0 flex items-center justify-end p-4">
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
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          Redefinir senha
        </h1>
        <p className="mt-2 text-sm text-muted">
          Escolha uma nova senha para acessar a plataforma.
        </p>
        <RedefinirForm />
      </div>
    </main>
  );
}
