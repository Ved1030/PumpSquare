// PDFs uploaded by the admin are stored privately as `private:<storage key>`
// and served through the access-checked /api/files proxy, which is also what
// keeps draft catalogues unreachable. Images keep their public URL.
const PRIVATE_PREFIX = "private:";

export function isPrivateUpload(value: string | null | undefined) {
  const key = value?.startsWith(PRIVATE_PREFIX) ? value.slice(PRIVATE_PREFIX.length) : null;
  // documents/… is the legacy layout; new uploads live in products/{id}/documents/…
  return Boolean(key && (key.startsWith("documents/") || /^products\/[0-9a-f-]{36}\/documents\//.test(key)));
}

export function toPrivateFileKey(value: string | null | undefined) {
  if (!isPrivateUpload(value)) return null;
  return value!.slice(PRIVATE_PREFIX.length);
}

export function fileProxyUrl(value: string | null | undefined, download = false) {
  if (!value) return null;
  const key = toPrivateFileKey(value);
  if (!key) return value;
  return `/api/files/${key.split("/").map(encodeURIComponent).join("/")}${download ? "?download=1" : ""}`;
}
