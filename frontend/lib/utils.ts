/**
 * Chuẩn hóa chuỗi tiếng Việt: loại bỏ dấu, chuyển về chữ thường, chuyển đ/Đ thành d
 */
export function normalizeVietnamese(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Kiểm tra xem chuỗi target có chứa từ khóa tìm kiếm query không
 * Hỗ trợ so khớp linh hoạt cả có dấu, không dấu và không phân biệt hoa thường.
 */
export function matchesSearchTerm(target: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const rawTarget = target.toLowerCase();
  const rawQuery = query.toLowerCase().trim();

  // So khớp trực tiếp chuỗi gốc
  if (rawTarget.includes(rawQuery)) return true;

  // So khớp sau khi đã chuẩn hóa loại bỏ dấu tiếng Việt
  const normTarget = normalizeVietnamese(target);
  const normQuery = normalizeVietnamese(query);

  return normTarget.includes(normQuery);
}
