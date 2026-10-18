package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.InvoiceService;
import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các API hóa đơn (Tạo hóa đơn, Lấy danh sách lịch sử và Xem chi tiết hóa đơn).
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

    /**
     * API lấy danh sách lịch sử hóa đơn:
     * - ADMIN: Xem tất cả hóa đơn.
     * - STAFF: Chỉ xem các hóa đơn do chính mình tạo.
     * GET /api/invoices
     */
    @GetMapping
    public ResponseEntity<?> getInvoices(Authentication authentication) {
        try {
            return ResponseEntity.ok(invoiceService.getInvoices(authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API xem chi tiết 1 hóa đơn theo ID:
     * - ADMIN: Xem được mọi hóa đơn.
     * - STAFF: Chỉ xem được hóa đơn do chính mình tạo (nếu xem của người khác trả về 403 Forbidden).
     * GET /api/invoices/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Integer id, Authentication authentication) {
        try {
            return ResponseEntity.ok(invoiceService.getInvoiceById(id, authentication.getName()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
