package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.ToppingService;
import com.kiemchung.vtea.domain.dto.request.CreateToppingRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateToppingRequest;
import com.kiemchung.vtea.domain.dto.response.ToppingResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ToppingControllerTest {

    @Mock
    private ToppingService toppingService;

    @InjectMocks
    private ToppingController toppingController;

    private ToppingResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new ToppingResponse(1, "Trân châu đen", new BigDecimal("5000"), "url", true);
    }

    @Test
    void testGetAllToppings() {
        when(toppingService.getAllToppings()).thenReturn(List.of(sampleResponse));

        ResponseEntity<List<ToppingResponse>> response = toppingController.getAllToppings();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("Trân châu đen", response.getBody().get(0).getName());
    }

    @Test
    void testGetToppingById_Success() {
        when(toppingService.getToppingById(1)).thenReturn(sampleResponse);

        ResponseEntity<?> response = toppingController.getToppingById(1);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testGetToppingById_NotFound() {
        when(toppingService.getToppingById(99)).thenThrow(new RuntimeException("Not found"));

        ResponseEntity<?> response = toppingController.getToppingById(99);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Not found", response.getBody());
    }

    @Test
    void testCreateTopping_Success() {
        CreateToppingRequest req = new CreateToppingRequest();
        when(toppingService.createTopping(any(CreateToppingRequest.class))).thenReturn(sampleResponse);

        ResponseEntity<?> response = toppingController.createTopping(req);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testCreateTopping_BadRequest() {
        CreateToppingRequest req = new CreateToppingRequest();
        when(toppingService.createTopping(any(CreateToppingRequest.class))).thenThrow(new RuntimeException("Exists"));

        ResponseEntity<?> response = toppingController.createTopping(req);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Exists", response.getBody());
    }

    @Test
    void testUpdateTopping_Success() {
        UpdateToppingRequest req = new UpdateToppingRequest();
        when(toppingService.updateTopping(eq(1), any(UpdateToppingRequest.class))).thenReturn(sampleResponse);

        ResponseEntity<?> response = toppingController.updateTopping(1, req);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testUpdateTopping_NotFound() {
        UpdateToppingRequest req = new UpdateToppingRequest();
        when(toppingService.updateTopping(eq(99), any(UpdateToppingRequest.class))).thenThrow(new RuntimeException("Not found"));

        ResponseEntity<?> response = toppingController.updateTopping(99, req);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Not found", response.getBody());
    }

    @Test
    void testDeleteTopping_Success() {
        doNothing().when(toppingService).deleteTopping(1);

        ResponseEntity<?> response = toppingController.deleteTopping(1);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Xóa topping thành công!", response.getBody());
    }

    @Test
    void testDeleteTopping_NotFound() {
        doThrow(new RuntimeException("Not found")).when(toppingService).deleteTopping(99);

        ResponseEntity<?> response = toppingController.deleteTopping(99);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Not found", response.getBody());
    }
}
