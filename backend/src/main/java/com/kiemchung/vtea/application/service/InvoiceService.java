package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;

import java.util.List;

/**
 * Định nghĩa interface nghiệp vụ xử lý hóa đơn và bảo mật thanh toán.
 */
public interface InvoiceService {

    /**
     * Tạo hóa đơn mới: tự động truy vấn giá gốc từ DB, tính toán lại tổng tiền (gồm VAT 10%)
     * và đối chiếu (chéo check) với dữ liệu giá từ Frontend gửi lên.
     */
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

