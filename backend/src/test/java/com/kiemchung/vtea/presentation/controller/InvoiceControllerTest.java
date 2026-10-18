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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

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
        when(authentication.getName()).thenReturn("staff1");
    }

    @Test
    void testCreateInvoice_Success() {
        CreateInvoiceRequest req = new CreateInvoiceRequest();
        when(invoiceService.createInvoice("staff1", req)).thenReturn(sampleResponse);

        ResponseEntity<?> res = invoiceController.createInvoice(req, authentication);

        assertEquals(201, res.getStatusCode().value());
        assertEquals(sampleResponse, res.getBody());
    }

    @Test
    void testCreateInvoice_BadRequest() {
        CreateInvoiceRequest req = new CreateInvoiceRequest();
        when(invoiceService.createInvoice("staff1", req)).thenThrow(new IllegalArgumentException("Invalid"));

        ResponseEntity<?> res = invoiceController.createInvoice(req, authentication);

        assertEquals(400, res.getStatusCode().value());
        assertEquals("Invalid", res.getBody());
    }

    @Test
    void testGetInvoices_Success() {
        when(invoiceService.getInvoices("staff1")).thenReturn(List.of(sampleResponse));

        ResponseEntity<?> res = invoiceController.getInvoices(authentication);

        assertEquals(200, res.getStatusCode().value());
        assertEquals(List.of(sampleResponse), res.getBody());
    }

    @Test
    void testGetInvoices_BadRequest() {
        when(invoiceService.getInvoices("staff1")).thenThrow(new IllegalArgumentException("User not found"));

        ResponseEntity<?> res = invoiceController.getInvoices(authentication);

        assertEquals(400, res.getStatusCode().value());
        assertEquals("User not found", res.getBody());
    }

    @Test
    void testGetInvoiceById_Success() {
        when(invoiceService.getInvoiceById(100, "staff1")).thenReturn(sampleResponse);

        ResponseEntity<?> res = invoiceController.getInvoiceById(100, authentication);

        assertEquals(200, res.getStatusCode().value());
        assertEquals(sampleResponse, res.getBody());
    }

    @Test
    void testGetInvoiceById_Forbidden() {
        when(invoiceService.getInvoiceById(100, "staff1")).thenThrow(new AccessDeniedException("Forbidden"));

        ResponseEntity<?> res = invoiceController.getInvoiceById(100, authentication);

        assertEquals(403, res.getStatusCode().value());
        assertEquals("Forbidden", res.getBody());
    }

    @Test
    void testGetInvoiceById_NotFound() {
        when(invoiceService.getInvoiceById(999, "staff1")).thenThrow(new IllegalArgumentException("Not found"));

        ResponseEntity<?> res = invoiceController.getInvoiceById(999, authentication);

        assertEquals(404, res.getStatusCode().value());
        assertEquals("Not found", res.getBody());
    }
}
