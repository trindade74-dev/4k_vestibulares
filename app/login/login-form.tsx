"use client";

import { useActionState, useState } from "react";
import { IconMailFilled } from "@tabler/icons-react";
import {
  cadastrar,
  entrar,
  pedirRecuperacao,
  type EstadoAuth,
} from "@/lib/auth/actions";

type Modo = "entrar" | "cadastro" | "recuperar";

const estadoInicial: EstadoAuth = {};

/**
 * Tela única de autenticação com três modos alternáveis por estado
 * client (sem mudar rota). Cada modo tem seu próprio useActionState
 * para os erros não vazarem de um form para o outro.
 */
export function LoginForm({ linkInvalido }: { linkInvalido?: boolean }) {
  const [modo, setModo] = useState<Modo>("entrar");
  const [emailCadastro, setEmailCadastro] = useState("");

  const [estadoEntrar, acaoEntrar, entrando] = useActionState(
    entrar,
    estadoInicial,
  );
  const [estadoCadastro, acaoCadastro, cadastrando] = useActionState(
    cadastrar,
    estadoInicial,
  );
  const [estadoRecuperar, acaoRecuperar, recuperando] = useActionState(
    pedirRecuperacao,
    estadoInicial,
  );

  /* Cadastro concluído: substitui todo o card pelo estado de confirmação */
  if (estadoCadastro.sucesso === "confira-email") {
    return (
      <div className="fade-modo text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-surface-alt text-roxo">
          <IconMailFilled size={26} aria-hidden />
        </span>
        <h1 className="titulo-impacto mt-4 text-2xl text-ink">
          Confira seu e-mail
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enviamos um link de confirmação para{" "}
          <strong className="font-semibold text-ink">
            {emailCadastro || "seu e-mail"}
          </strong>
          . Abra a mensagem e clique no link para ativar sua conta.
        </p>
        <p className="mt-2 text-sm text-muted">
          Não chegou? Olhe também a caixa de spam.
        </p>
        <button
          type="button"
          onClick={() => setModo("entrar")}
          className="btn btn-contorno mt-6 w-full"
        >
          Voltar para entrar
        </button>
      </div>
    );
  }

  const erroDoModo =
    modo === "entrar"
      ? estadoEntrar.erro
      : modo === "cadastro"
        ? estadoCadastro.erro
        : estadoRecuperar.erro;

  return (
    <div key={modo} className="fade-modo">
      {/* Erros do modo ativo (e banner de link inválido no modo entrar) */}
      <div aria-live="polite">
        {modo === "entrar" && linkInvalido && !erroDoModo && (
          <div className="caixa-revisar mb-5">
            Link expirado ou inválido. Faça login ou peça um novo link.
          </div>
        )}
        {erroDoModo && <div className="caixa-revisar mb-5">{erroDoModo}</div>}
      </div>

      {modo === "entrar" && (
        <>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            Entrar na plataforma
          </h1>
          <form action={acaoEntrar} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="entrar-email"
                className="block text-sm font-medium text-ink"
              >
                E-mail
              </label>
              <input
                id="entrar-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="voce@exemplo.com"
                className="input-4k mt-1.5"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="entrar-senha"
                  className="block text-sm font-medium text-ink"
                >
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setModo("recuperar")}
                  className="text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <input
                id="entrar-senha"
                name="senha"
                type="password"
                required
                autoComplete="current-password"
                className="input-4k mt-1.5"
              />
            </div>
            <button
              type="submit"
              disabled={entrando}
              className="btn btn-verde w-full disabled:cursor-default disabled:opacity-70"
            >
              {entrando ? "Entrando…" : "Entrar"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Não tem conta?{" "}
            <button
              type="button"
              onClick={() => setModo("cadastro")}
              className="font-medium text-roxo underline-offset-2 hover:underline"
            >
              Criar conta
            </button>
          </p>
        </>
      )}

      {modo === "cadastro" && (
        <>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            Criar conta
          </h1>
          <form action={acaoCadastro} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="cadastro-nome"
                className="block text-sm font-medium text-ink"
              >
                Nome
              </label>
              <input
                id="cadastro-nome"
                name="nome"
                type="text"
                required
                autoComplete="name"
                placeholder="Seu nome completo"
                className="input-4k mt-1.5"
              />
            </div>
            <div>
              <label
                htmlFor="cadastro-email"
                className="block text-sm font-medium text-ink"
              >
                E-mail
              </label>
              <input
                id="cadastro-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="voce@exemplo.com"
                className="input-4k mt-1.5"
                value={emailCadastro}
                onChange={(e) => setEmailCadastro(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="cadastro-senha"
                className="block text-sm font-medium text-ink"
              >
                Senha
              </label>
              <input
                id="cadastro-senha"
                name="senha"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                aria-describedby="cadastro-senha-dica"
                className="input-4k mt-1.5"
              />
              <p id="cadastro-senha-dica" className="mt-1.5 text-xs text-muted">
                Mínimo 6 caracteres
              </p>
            </div>
            <button
              type="submit"
              disabled={cadastrando}
              className="btn btn-verde w-full disabled:cursor-default disabled:opacity-70"
            >
              {cadastrando ? "Criando conta…" : "Criar conta"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-muted">
            Já tem conta?{" "}
            <button
              type="button"
              onClick={() => setModo("entrar")}
              className="font-medium text-roxo underline-offset-2 hover:underline"
            >
              Entrar
            </button>
          </p>
        </>
      )}

      {modo === "recuperar" && (
        <>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            Recuperar senha
          </h1>
          {estadoRecuperar.sucesso === "link-enviado" ? (
            <div className="mt-5">
              <div className="caixa-acerto">
                Se o e-mail existir, enviamos o link de redefinição. Confira sua
                caixa de entrada e o spam.
              </div>
              <button
                type="button"
                onClick={() => setModo("entrar")}
                className="btn btn-contorno mt-5 w-full"
              >
                Voltar para entrar
              </button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted">
                Informe seu e-mail e enviaremos um link para redefinir a senha.
              </p>
              <form action={acaoRecuperar} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="recuperar-email"
                    className="block text-sm font-medium text-ink"
                  >
                    E-mail
                  </label>
                  <input
                    id="recuperar-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    className="input-4k mt-1.5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={recuperando}
                  className="btn btn-verde w-full disabled:cursor-default disabled:opacity-70"
                >
                  {recuperando ? "Enviando…" : "Enviar link"}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-muted">
                Lembrou a senha?{" "}
                <button
                  type="button"
                  onClick={() => setModo("entrar")}
                  className="font-medium text-roxo underline-offset-2 hover:underline"
                >
                  Voltar para entrar
                </button>
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}
