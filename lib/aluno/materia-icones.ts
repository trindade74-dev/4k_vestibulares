import {
  IconAtom,
  IconBook2,
  IconDna2,
  IconFlask,
  IconMap2,
  IconMathFunction,
  IconPencil,
  IconBuildingMonument,
  IconBookmark,
  type Icon,
} from "@tabler/icons-react";

/** Ícone Tabler por matéria (chave = nome normalizado sem acento, minúsculo). */
const ICONES: Record<string, Icon> = {
  matematica: IconMathFunction,
  portugues: IconBook2,
  biologia: IconDna2,
  quimica: IconFlask,
  fisica: IconAtom,
  historia: IconBuildingMonument,
  geografia: IconMap2,
  redacao: IconPencil,
};

function normalizar(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos combinados
    .toLowerCase()
    .trim();
}

/** Retorna o ícone da matéria, com um fallback neutro. */
export function iconeDaMateria(nome: string): Icon {
  return ICONES[normalizar(nome)] ?? IconBookmark;
}
