/**
 * Fetch an image by URL and return it as a `data:` URL.
 *
 * This runs server-side during SSR (e.g. on the org edit page), where the
 * browser-only `FileReader` is unavailable, so it builds the base64 payload
 * from the response bytes via `Buffer` instead.
 */
export const getBase64FromImageURL = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = res.headers.get("content-type") ?? "application/octet-stream";

  return `data:${ contentType };base64,${ base64 }`;
};
