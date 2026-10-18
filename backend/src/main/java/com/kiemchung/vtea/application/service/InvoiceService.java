package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;

import java.util.List;

/**
 * Nghiệp vụ quản lý hóa đơn.
 */
public interface InvoiceService {

    /** Tạo hóa đơn mới cho nhân viên đang đăng nhập. */
    InvoiceResponse createInvoice(String username, CreateInvoiceRequest request);

    /**
     * Lấy danh sách lịch sử hóa đơn:
     * - ADMIN: Xem tất cả hóa đơn.
     * - STAFF: Chỉ xem các hóa đơn do chính mình tạo.
     */
    List<InvoiceResponse> getInvoices(String username);

    /**
     * Xem chi tiết 1 hóa đơn theo ID:
     * - ADMIN: Xem được mọi hóa đơn.
     * - STAFF: Chỉ xem được hóa đơn do chính mình tạo.
     */
    InvoiceResponse getInvoiceById(Integer invoiceId, String username);
}
