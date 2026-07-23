"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconBrandWhatsapp, IconCircleCheck } from "@tabler/icons-react";
import { enviarInscricao } from "@/lib/matricula/actions";
import {
  COMO_CONHECEU_OPCOES,
  CURSOS_PRETENDIDOS,
  ROTULO_SERIE_STATUS,
  ROTULO_TURNO,
  ROTULO_VESTIBULAR,
  type EstadoMatricula,
  type VestibularAlvo,
} from "@/lib/matricula/tipos";

const ESTADO_INICIAL: EstadoMatricula = {};
const TOTAL_PASSOS = 4;

const TITULOS_PASSO: Record<number, string> = {
  1: "Dados pessoais",
  2: "Formação",
  3: "Objetivo",
  4: "Quase lá",
};

/** Roda a validação HTML5 nativa (bolhas de erro do navegador) em todo
 * campo dentro do passo. `.every` para no primeiro inválido — o navegador
 * já foca e mostra a bolha nele; ao corrigir, o próximo clique valida o
 * seguinte. */
function validarCampos(container: HTMLElement | null): boolean {
  if (!container) return true;
  const campos = Array.from(
    container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea"),
  );
  return campos.every((campo) => campo.reportValidity());
}

/**
 * Wizard de pré-matrícula em 4 passos, um único `<form>` (os passos
 * escondidos ficam no DOM via `hidden`, não desmontados — senão o
 * FormData do submit final perde os campos dos passos anteriores).
 * Navegação entre passos é client-side (useState); só o botão do
 * passo 4 é `type="submit"`, que dispara a server action.
 */
export function MatriculaWizard() {
  const [passo, setPasso] = useState(1);
  const [mostrarVestibularOutro, setMostrarVestibularOutro] = useState(false);
  const [mostrarCursoOutro, setMostrarCursoOutro] = useState(false);
  const [mostrarComoConheceuOutro, setMostrarComoConheceuOutro] =
    useState(false);

  const passo1Ref = useRef<HTMLDivElement>(null);
  const passo2Ref = useRef<HTMLDivElement>(null);
  const passo3Ref = useRef<HTMLDivElement>(null);

  const [estado, acao, enviando] = useActionState(
    enviarInscricao,
    ESTADO_INICIAL,
  );

  // Abre o WhatsApp uma única vez quando o envio dá certo (ref, não state,
  // pra não disparar de novo em re-renders).
  const abriuWhatsappRef = useRef(false);
  useEffect(() => {
    if (estado.sucesso && !abriuWhatsappRef.current) {
      abriuWhatsappRef.current = true;
      window.open(estado.sucesso.whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }, [estado.sucesso]);

  /** Passo 3 tem o grupo de checkboxes "vestibulares": precisa de pelo
   * menos um marcado, o que `required` por input não garante sozinho. */
  function validarPasso3(): boolean {
    const container = passo3Ref.current;
    if (!container) return true;
    const checkboxes = Array.from(
      container.querySelectorAll<HTMLInputElement>(
        'input[name="vestibulares"]',
      ),
    );
    const algumMarcado = checkboxes.some((c) => c.checked);
    if (!algumMarcado) {
      checkboxes.forEach((c) =>
        c.setCustomValidity("Selecione ao menos um vestibular."),
      );
      checkboxes[0]?.reportValidity();
      return false;
    }
    checkboxes.forEach((c) => c.setCustomValidity(""));
    const outrosCampos = Array.from(
      container.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        'select, input:not([name="vestibulares"])',
      ),
    );
    return outrosCampos.every((campo) => campo.reportValidity());
  }

  function aoClicarProximo() {
    if (passo === 1 && validarCampos(passo1Ref.current)) setPasso(2);
    else if (passo === 2 && validarCampos(passo2Ref.current)) setPasso(3);
    else if (passo === 3 && validarPasso3()) setPasso(4);
  }

  function voltar() {
    setPasso((p) => Math.max(p - 1, 1));
  }

  // Sucesso: substitui todo o wizard pela tela de confirmação.
  if (estado.sucesso) {
    return (
      <div className="fade-modo text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-verde text-verde-ink">
          <IconCircleCheck size={30} aria-hidden />
        </span>
        <h2 className="titulo-impacto mt-5 text-2xl text-ink sm:text-3xl">
          Pré-matrícula enviada!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Recebemos seus dados. Já vamos abrir o WhatsApp pra você confirmar
          sua vaga com a nossa equipe.
        </p>
        <p className="mt-1.5 text-sm text-muted">
          Se a janela não abriu sozinha, use o botão abaixo.
        </p>
        <a
          href={estado.sucesso.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-verde mt-6 w-full"
        >
          <IconBrandWhatsapp className="size-5" aria-hidden />
          Abrir WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de progresso: trilho + preenchimento roxo (verde é só o
          botão final de envio, nunca decoração — DESIGN.md regra 1). */}
      <div className="mb-7">
        <div className="flex items-center justify-between text-xs font-medium text-muted">
          <span>
            Passo {passo} de {TOTAL_PASSOS}
          </span>
          <span>{TITULOS_PASSO[passo]}</span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_PASSOS}
          aria-valuenow={passo}
          aria-label="Progresso da matrícula"
        >
          <div
            className="h-full rounded-full bg-roxo transition-[width] duration-300 ease-out"
            style={{ width: `${(passo / TOTAL_PASSOS) * 100}%` }}
          />
        </div>
      </div>

      <div aria-live="polite">
        {estado.erro && (
          <div className="caixa-revisar mb-5">{estado.erro}</div>
        )}
      </div>

      <form action={acao} className="space-y-6">
        {/* PASSO 1 — Dados pessoais */}
        <div ref={passo1Ref} hidden={passo !== 1} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-ink">
              Nome completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              autoComplete="name"
              placeholder="Seu nome completo"
              className="input-4k mt-1.5"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dataNascimento"
                className="block text-sm font-medium text-ink"
              >
                Data de nascimento
              </label>
              <input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                required
                autoComplete="bday"
                className="input-4k mt-1.5"
              />
            </div>
            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-ink"
              >
                Telefone (com DDD)
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="(61) 90000-0000"
                className="input-4k mt-1.5"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="voce@exemplo.com"
              className="input-4k mt-1.5"
            />
          </div>
          <div>
            <label
              htmlFor="endereco"
              className="block text-sm font-medium text-ink"
            >
              Endereço
            </label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              required
              autoComplete="street-address"
              placeholder="Rua, número, bairro"
              className="input-4k mt-1.5"
            />
          </div>
        </div>

        {/* PASSO 2 — Formação */}
        <div ref={passo2Ref} hidden={passo !== 2} className="space-y-4">
          <div>
            <label
              htmlFor="escolaOrigem"
              className="block text-sm font-medium text-ink"
            >
              Escola de origem
            </label>
            <input
              id="escolaOrigem"
              name="escolaOrigem"
              type="text"
              required
              placeholder="Nome da escola"
              className="input-4k mt-1.5"
            />
          </div>
          <div>
            <label
              htmlFor="serieStatus"
              className="block text-sm font-medium text-ink"
            >
              Série atual
            </label>
            <select
              id="serieStatus"
              name="serieStatus"
              required
              defaultValue=""
              className="input-4k mt-1.5"
            >
              <option value="" disabled>
                Selecione
              </option>
              {Object.entries(ROTULO_SERIE_STATUS).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>
          <fieldset>
            <legend className="block text-sm font-medium text-ink">
              Já fez cursinho antes?
            </legend>
            <div className="mt-1.5 grid grid-cols-2 gap-3">
              {(
                [
                  { valor: "sim", rotulo: "Sim" },
                  { valor: "nao", rotulo: "Não" },
                ] as const
              ).map(({ valor, rotulo }) => (
                <label key={valor} className="cursor-pointer">
                  <input
                    type="radio"
                    name="jaFezCursinho"
                    value={valor}
                    required
                    className="peer sr-only"
                  />
                  <span className="flex items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors peer-checked:border-roxo peer-checked:bg-surface-alt peer-checked:text-roxo peer-focus-visible:outline-2 peer-focus-visible:outline-roxo peer-focus-visible:outline-offset-2">
                    {rotulo}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* PASSO 3 — Objetivo */}
        <div ref={passo3Ref} hidden={passo !== 3} className="space-y-5">
          <fieldset>
            <legend className="block text-sm font-medium text-ink">
              Vestibular(es) alvo
            </legend>
            <div className="mt-1.5 space-y-2">
              {(
                Object.entries(ROTULO_VESTIBULAR) as [VestibularAlvo, string][]
              ).map(([valor, rotulo]) => (
                <label
                  key={valor}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink transition-colors has-checked:border-roxo has-checked:bg-surface-alt"
                >
                  <input
                    type="checkbox"
                    name="vestibulares"
                    value={valor}
                    className="size-4.5 shrink-0 accent-[var(--roxo-4k)]"
                    onChange={(e) => {
                      if (valor === "outro")
                        setMostrarVestibularOutro(e.target.checked);
                    }}
                  />
                  {rotulo}
                </label>
              ))}
            </div>
            {mostrarVestibularOutro && (
              <input
                name="vestibularOutro"
                type="text"
                required
                placeholder="Qual vestibular?"
                aria-label="Qual outro vestibular"
                className="input-4k mt-3"
              />
            )}
          </fieldset>

          <div>
            <label
              htmlFor="cursoPretendido"
              className="block text-sm font-medium text-ink"
            >
              Curso pretendido
            </label>
            <select
              id="cursoPretendido"
              name="cursoPretendido"
              required
              defaultValue=""
              className="input-4k mt-1.5"
              onChange={(e) =>
                setMostrarCursoOutro(e.target.value === "Outro")
              }
            >
              <option value="" disabled>
                Selecione
              </option>
              {CURSOS_PRETENDIDOS.map((curso) => (
                <option key={curso} value={curso}>
                  {curso}
                </option>
              ))}
            </select>
            {mostrarCursoOutro && (
              <input
                name="cursoOutro"
                type="text"
                required
                placeholder="Qual curso?"
                aria-label="Qual outro curso"
                className="input-4k mt-3"
              />
            )}
          </div>

          <div>
            <label
              htmlFor="turnoDesejado"
              className="block text-sm font-medium text-ink"
            >
              Turno desejado
            </label>
            <select
              id="turnoDesejado"
              name="turnoDesejado"
              required
              defaultValue=""
              className="input-4k mt-1.5"
            >
              <option value="" disabled>
                Selecione
              </option>
              {Object.entries(ROTULO_TURNO).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PASSO 4 — Quase lá */}
        <div hidden={passo !== 4} className="space-y-4">
          <div>
            <label
              htmlFor="comoConheceu"
              className="block text-sm font-medium text-ink"
            >
              Como você conheceu o 4K?
            </label>
            <select
              id="comoConheceu"
              name="comoConheceu"
              required
              defaultValue=""
              className="input-4k mt-1.5"
              onChange={(e) =>
                setMostrarComoConheceuOutro(e.target.value === "Outro")
              }
            >
              <option value="" disabled>
                Selecione
              </option>
              {COMO_CONHECEU_OPCOES.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
            {mostrarComoConheceuOutro && (
              <input
                name="comoConheceuOutro"
                type="text"
                required
                placeholder="Como assim?"
                aria-label="Outra forma de conhecer o 4K"
                className="input-4k mt-3"
              />
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-ink transition-colors has-checked:border-roxo has-checked:bg-surface-alt">
            <input
              type="checkbox"
              name="aceiteLgpd"
              required
              className="mt-0.5 size-4.5 shrink-0 accent-[var(--roxo-4k)]"
            />
            <span>
              Li e aceito a{" "}
              <Link
                href="/politica-de-privacidade"
                target="_blank"
                className="font-medium text-roxo underline underline-offset-2 hover:opacity-80"
              >
                Política de Privacidade
              </Link>{" "}
              e autorizo o uso dos meus dados para contato sobre a matrícula.
            </span>
          </label>
        </div>

        {/* Navegação */}
        <div className="flex gap-3 pt-2">
          {passo > 1 && (
            <button
              type="button"
              onClick={voltar}
              className="btn btn-contorno flex-1"
            >
              Voltar
            </button>
          )}
          {passo < TOTAL_PASSOS && (
            <button
              type="button"
              onClick={aoClicarProximo}
              className="btn btn-roxo flex-1"
            >
              Próximo
            </button>
          )}
          {passo === TOTAL_PASSOS && (
            <button
              type="submit"
              disabled={enviando}
              className="btn btn-verde flex-1 disabled:cursor-default disabled:opacity-70"
            >
              {enviando ? "Enviando…" : "Enviar e abrir WhatsApp"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
