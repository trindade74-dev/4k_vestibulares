export const WHATSAPP_NUMERO = "556195632944";

export const WHATSAPP_URL = linkWhatsApp(
  "Olá, gostaria de mais informações",
);

export const MAPS_URL = "https://maps.app.goo.gl/Y948wXvZxcvgdm2EA";

/** Monta um link wa.me com texto pré-preenchido (sempre URL-encoded). */
export function linkWhatsApp(texto: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}
