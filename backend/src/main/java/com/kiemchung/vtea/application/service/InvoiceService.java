package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;

/**
 * Nghiệp vụ quản lý hóa đơn.
 */
public interface InvoiceService {

    /** Tạo hóa đơn mới cho nhân viên đang đăng nhập. */
    InvoiceResponse createInvoice(String username, CreateInvoiceRequest request);
}
