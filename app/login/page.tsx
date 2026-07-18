import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acesso à plataforma — 4K Vestibulares",
  description:
    "Ambiente do aluno e do professor da Plataforma 4K Vestibulares. Em construção.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ perfil?: string }>;
}) {
  const { perfil } = await searchParams;
  const titulo =
    perfil === "professor" ? "Ambiente do Professor" : "Ambiente do Aluno";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 text-center">
        <Image
          src="/4k-logo.svg"
          alt="4K Vestibulares"
          width={56}
          height={56}
          priority
          className="mx-auto"
        />
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          {titulo}
        </h1>
        <p className="mt-2 inline-block rounded-xl border border-[var(--revisar-border)] bg-[var(--revisar-bg)] px-3 py-1 text-sm font-medium text-[var(--revisar-text)]">
          Ambiente em construção
        </p>
        <p className="mt-4 text-sm text-muted">
          O acesso de alunos e professores chega em breve. Enquanto isso, fale
          com a gente pela página inicial.
        </p>
        <Link href="/" className="btn btn-contorno mt-6 w-full">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
