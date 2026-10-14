package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.InvoiceService;
import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các API hóa đơn.
 */
@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    /**
     * API tạo hóa đơn (STAFF và ADMIN đều dùng được).
     * POST /api/invoices — nhân viên tạo hóa đơn lấy từ JWT, không nhận từ body.
     */
    @PostMapping
    public ResponseEntity<?> createInvoice(@RequestBody CreateInvoiceRequest request, Authentication authentication) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(invoiceService.createInvoice(authentication.getName(), request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
