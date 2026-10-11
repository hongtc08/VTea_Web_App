/**
 * Chuyển đổi ngày tháng thành: DD/MM/YYYY.
 */
export function formatDate(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Chuyển đổi ngày tháng thành định dạng YYYY-MM-DD dành cho HTML <input type="date">.
 */
export function formatDateForInput(dateInput?: string | number | Date | null): string {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  const str = String(dateInput).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [d, m, y] = str.split('/');
    return `${y}-${m}-${d}`;
  }
  try {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch {
    // fallback
  }
  return new Date().toISOString().split('T')[0];
}

/**
 * Chuyển đổi ngày tháng thành: HH:mm DD/MM/YYYY.
 */
export function formatDateTime(dateInput?: string | number | Date | null): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return String(dateInput);
  }
}
