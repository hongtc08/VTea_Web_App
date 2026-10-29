package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.InvoiceService;
import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Mục đích file: Unit test cho InvoiceController nhằm kiểm tra xác thực JWT
 * và phản hồi HTTP khi tạo hóa đơn, lấy danh sách lịch sử và xem chi tiết hóa đơn.
 */
@ExtendWith(MockitoExtension.class)
class InvoiceControllerTest {

    @Mock
    private InvoiceService invoiceService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private InvoiceController invoiceController;

    private InvoiceResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new InvoiceResponse();
        sampleResponse.setInvoiceId(100);
        sampleResponse.setTotalAmount(new BigDecimal("33000"));
    }

    @Test
    void createInvoice_Success_Returns201() {
        CreateInvoiceRequest request = new CreateInvoiceRequest();
        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.createInvoice("staff1", request)).thenReturn(sampleResponse);

        ResponseEntity<?> response = invoiceController.createInvoice(request, authentication);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void createInvoice_Unauthenticated_Returns401() {
        CreateInvoiceRequest request = new CreateInvoiceRequest();

        ResponseEntity<?> nullAuthResponse = invoiceController.createInvoice(request, null);
        assertEquals(401, nullAuthResponse.getStatusCode().value());

        when(authentication.getName()).thenReturn(null);
        ResponseEntity<?> nullNameResponse = invoiceController.createInvoice(request, authentication);
        assertEquals(401, nullNameResponse.getStatusCode().value());

        when(authentication.getName()).thenReturn("   ");
        ResponseEntity<?> blankUserResponse = invoiceController.createInvoice(request, authentication);
        assertEquals(401, blankUserResponse.getStatusCode().value());

        verify(invoiceService, never()).createInvoice(any(), any());
    }

    @Test
    void createInvoice_PriceMismatchOrValidationFailed_Returns400() {
        CreateInvoiceRequest request = new CreateInvoiceRequest();
        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.createInvoice("staff1", request))
                .thenThrow(new IllegalArgumentException("Tổng tiền thanh toán từ client không khớp với giá tính toán tại hệ thống!"));

        ResponseEntity<?> response = invoiceController.createInvoice(request, authentication);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Tổng tiền thanh toán từ client không khớp với giá tính toán tại hệ thống!", response.getBody());
    }

    @Test
    void testGetInvoices_Success() {
        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.getInvoices("staff1")).thenReturn(List.of(sampleResponse));

        ResponseEntity<?> res = invoiceController.getInvoices(authentication);

        assertEquals(200, res.getStatusCode().value());
        assertEquals(List.of(sampleResponse), res.getBody());
    }

    @Test
    void testGetInvoices_BadRequest() {
        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.getInvoices("staff1")).thenThrow(new IllegalArgumentException("User not found"));

        ResponseEntity<?> res = invoiceController.getInvoices(authentication);

        assertEquals(400, res.getStatusCode().value());
        assertEquals("User not found", res.getBody());
    }

    @Test
    void testGetInvoiceById_Success() {
        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.getInvoiceById(100, "staff1")).thenReturn(sampleResponse);

        ResponseEntity<?> res = invoiceController.getInvoiceById(100, authentication);

        assertEquals(200, res.getStatusCode().value());
        assertEquals(sampleResponse, res.getBody());
    }

    @Test
    void testGetInvoiceById_Forbidden() {
        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.getInvoiceById(100, "staff1")).thenThrow(new AccessDeniedException("Forbidden"));

        ResponseEntity<?> res = invoiceController.getInvoiceById(100, authentication);

        assertEquals(403, res.getStatusCode().value());
        assertEquals("Forbidden", res.getBody());
    }

    @Test
    void testGetInvoiceById_NotFound() {
        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.getInvoiceById(999, "staff1")).thenThrow(new IllegalArgumentException("Not found"));

        ResponseEntity<?> res = invoiceController.getInvoiceById(999, authentication);

        assertEquals(404, res.getStatusCode().value());
        assertEquals("Not found", res.getBody());
    }
}
