import {
  IconArticle,
  IconFileText,
  IconLink,
  IconVideo,
  type Icon,
} from "@tabler/icons-react";
import type { Material } from "@/lib/aluno/tipos";

const ICONE_POR_TIPO: Record<Material["tipo"], Icon> = {
  link: IconLink,
  pdf: IconFileText,
  video: IconVideo,
  texto: IconArticle,
};

const ROTULO_ABRIR: Record<Material["tipo"], string> = {
  link: "Abrir link",
  pdf: "Abrir PDF",
  video: "Assistir vídeo",
  texto: "Abrir material",
};

/** Card de um material publicado pelo professor: link externo ou texto inline. */
export function MaterialCard({ material }: { material: Material }) {
  const Icone = ICONE_POR_TIPO[material.tipo];

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-roxo">
          <Icone className="size-5" stroke={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ink">{material.titulo}</h3>
          {material.descricao && (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {material.descricao}
            </p>
          )}
        </div>
      </div>

      {material.tipo === "texto" ? (
        material.corpo && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink">
            {material.corpo}
          </p>
        )
      ) : (
        material.url && (
          <a
            href={material.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-contorno mt-4"
          >
            {ROTULO_ABRIR[material.tipo]}
          </a>
        )
      )}
    </div>
  );
}
