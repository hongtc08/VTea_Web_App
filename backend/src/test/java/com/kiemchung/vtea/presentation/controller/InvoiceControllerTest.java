package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.InvoiceService;
import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Mục đích file: Unit test cho InvoiceController nhằm kiểm tra xác thực JWT
 * và phản hồi HTTP khi tạo hóa đơn thành công hoặc khi giá/dữ liệu không hợp lệ.
 */
@ExtendWith(MockitoExtension.class)
class InvoiceControllerTest {

    @Mock
    private InvoiceService invoiceService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private InvoiceController invoiceController;

    @Test
    void createInvoice_Success_Returns201() {
        CreateInvoiceRequest request = new CreateInvoiceRequest();
        InvoiceResponse expected = new InvoiceResponse();
        expected.setInvoiceId(1);
        expected.setTotalAmount(new BigDecimal("33000"));

        when(authentication.getName()).thenReturn("staff1");
        when(invoiceService.createInvoice("staff1", request)).thenReturn(expected);

        ResponseEntity<?> response = invoiceController.createInvoice(request, authentication);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(expected, response.getBody());
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
}
