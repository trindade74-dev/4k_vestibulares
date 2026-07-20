"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Estado devolvido às telas via useActionState. */
export type EstadoAuth = {
  erro?: string;
  sucesso?: "confira-email" | "link-enviado";
};

/** Destino pós-login conforme o tipo do usuário (RPC meu_tipo). */
async function destinoPorTipo(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const { data: tipo } = await supabase.rpc("meu_tipo");
  return tipo === "professor" ? "/professor" : "/aluno";
}

export async function entrar(
  _prev: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { erro: "Confirme seu e-mail antes de entrar. Confira sua caixa de entrada." };
    }
    return { erro: "E-mail ou senha incorretos." };
  }

  redirect(await destinoPorTipo(supabase));
}

export async function cadastrar(
  _prev: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  if (!nome) return { erro: "Informe seu nome." };
  if (!email) return { erro: "Informe seu e-mail." };
  if (senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome } },
  });

  if (error) {
    return { erro: "Não foi possível criar a conta. Tente novamente." };
  }

  // Com confirmação de e-mail ligada, signUp de e-mail já existente
  // devolve um user "obfuscado" sem identities.
  if (data.user?.identities?.length === 0) {
    return {
      erro: "Este e-mail já possui conta. Tente entrar ou recuperar a senha.",
    };
  }

  return { sucesso: "confira-email" };
}

export async function pedirRecuperacao(
  _prev: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) return { erro: "Informe seu e-mail." };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email);

  // Resposta sempre genérica: não revela se o e-mail existe.
  return { sucesso: "link-enviado" };
}

export async function atualizarSenha(
  _prev: EstadoAuth,
  formData: FormData,
): Promise<EstadoAuth> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 6) {
    return { erro: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (senha !== confirmacao) {
    return { erro: "As senhas não conferem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    if (error.code === "same_password") {
      return { erro: "A nova senha precisa ser diferente da atual." };
    }
    return { erro: "Não foi possível salvar a senha. Peça um novo link." };
  }

  redirect(await destinoPorTipo(supabase));
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
