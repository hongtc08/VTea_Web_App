package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;

/**
 * Định nghĩa interface nghiệp vụ xử lý hóa đơn và bảo mật thanh toán.
 */
public interface InvoiceService {

    /**
     * Tạo hóa đơn mới: tự động truy vấn giá gốc từ DB, tính toán lại tổng tiền (gồm VAT 10%)
     * và đối chiếu (chéo check) với dữ liệu giá từ Frontend gửi lên.
     */
    InvoiceResponse createInvoice(String username, CreateInvoiceRequest request);
}

