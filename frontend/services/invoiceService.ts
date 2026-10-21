import { apiFetch } from '@/lib/api';
import { InvoiceResponse } from '@/types/invoiceApi';

export const invoiceService = {
  /**
   * Lấy danh sách lịch sử hóa đơn:
   * - ADMIN: Xem tất cả hóa đơn của hệ thống.
   * - STAFF: Chỉ xem các hóa đơn do chính mình tạo.
   * GET /api/invoices
   */
  async getInvoices(): Promise<InvoiceResponse[]> {
    const data = await apiFetch<InvoiceResponse[]>('/api/invoices');
    return Array.isArray(data) ? data : [];
  },

  /**
   * Xem chi tiết 1 hóa đơn theo ID:
   * GET /api/invoices/{id}
   */
  async getInvoiceById(id: number | string): Promise<InvoiceResponse> {
    return await apiFetch<InvoiceResponse>(`/api/invoices/${id}`);
  },
};

