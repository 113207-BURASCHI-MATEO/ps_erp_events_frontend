export function formatIaResponse(raw: string): string {
  if (!raw) return '';

  // Negritas simples con **texto**
  let formatted = raw.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Bullets: convertir líneas con - o • en <ul><li>
  if (/^- |• /.test(raw)) {
    const lines = raw.split('\n');
    const bulletItems = lines
      .filter(
        (line) => line.trim().startsWith('-') || line.trim().startsWith('•')
      )
      .map((line) => `<li>${line.replace(/^[-•]\s*/, '')}</li>`)
      .join('');
    formatted = `<ul>${bulletItems}</ul>`;
  } else {
    // Saltos de línea para bloques normales
    formatted = formatted.replace(/\n/g, '<br>');
  }

  return formatted;
}
