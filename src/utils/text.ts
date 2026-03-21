const mojibakePattern = /[ÃÂ]/;

export function fixDisplayText(value?: string | null) {
  if (!value) {
    return "";
  }

  if (!mojibakePattern.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(Array.from(value), (char) =>
      char.charCodeAt(0)
    );

    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return value;
  }
}
