/**
 * Emits a schema.org block. Kept in one place so every structured-data
 * payload is serialised — and escaped — identically.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

/**
 * JSON.stringify does not escape `<`, `>` or `&`, so a literal `</script>`
 * anywhere in the data would terminate the tag early and let the remainder
 * execute as markup. Escaping them as unicode keeps the JSON semantically
 * identical while making a breakout impossible.
 *
 * U+2028/U+2029 are also escaped: they are valid JSON but illegal raw in
 * JavaScript string literals, and would otherwise be a parse error.
 */
function serialize(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
