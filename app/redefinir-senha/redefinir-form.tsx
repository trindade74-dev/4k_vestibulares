"use client";

import { useActionState, useState } from "react";
import { atualizarSenha, type EstadoAuth } from "@/lib/auth/actions";

const estadoInicial: EstadoAuth = {};

export function RedefinirForm() {
  const [estado, acao, salvando] = useActionState(
    atualizarSenha,
    estadoInicial,
  );
  const [erroLocal, setErroLocal] = useState<string | null>(null);

  /* Validação de igualdade client-side antes de submeter
     (a action valida de novo no servidor). */
  function aoSubmeter(evento: React.FormEvent<HTMLFormElement>) {
    const dados = new FormData(evento.currentTarget);
    if (dados.get("senha") !== dados.get("confirmacao")) {
      evento.preventDefault();
      setErroLocal("As senhas não conferem.");
      return;
    }
    setErroLocal(null);
  }

  const erro = erroLocal ?? estado.erro;

  return (
    <>
      <div aria-live="polite">
        {erro && <div className="caixa-revisar mt-5">{erro}</div>}
      </div>

      <form action={acao} onSubmit={aoSubmeter} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="nova-senha"
            className="block text-sm font-medium text-ink"
          >
            Nova senha
          </label>
          <input
            id="nova-senha"
            name="senha"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            aria-describedby="nova-senha-dica"
            className="input-4k mt-1.5"
          />
          <p id="nova-senha-dica" className="mt-1.5 text-xs text-muted">
            Mínimo 6 caracteres
          </p>
        </div>
        <div>
          <label
            htmlFor="confirmar-senha"
            className="block text-sm font-medium text-ink"
          >
            Confirmar nova senha
          </label>
          <input
            id="confirmar-senha"
            name="confirmacao"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="input-4k mt-1.5"
          />
        </div>
        <button
          type="submit"
          disabled={salvando}
          className="btn btn-verde w-full disabled:cursor-default disabled:opacity-70"
        >
          {salvando ? "Salvando…" : "Salvar nova senha"}
        </button>
      </form>
    </>
  );
}
