package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.MenuItemService;
import com.kiemchung.vtea.domain.dto.request.CreateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
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
class MenuItemControllerTest {

    @Mock
    private MenuItemService service;

    @InjectMocks
    private MenuItemController controller;

    private MenuItemResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new MenuItemResponse(1L, "Trà Sữa", "Ngon", new BigDecimal("30000"), "url", "Trà sữa");
    }

    @Test
    void testGetMenu() {
        when(service.getAllMenuItems()).thenReturn(List.of(sampleResponse));

        ResponseEntity<List<MenuItemResponse>> response = controller.getMenu();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("Trà Sữa", response.getBody().get(0).getName());
    }

    @Test
    void testGetMenuItemById_Success() {
        when(service.getMenuItemById(1L)).thenReturn(sampleResponse);

        ResponseEntity<?> response = controller.getMenuItemById(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testGetMenuItemById_NotFound() {
        when(service.getMenuItemById(99L)).thenThrow(new RuntimeException("Not found"));

        ResponseEntity<?> response = controller.getMenuItemById(99L);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Not found", response.getBody());
    }

    @Test
    void testCreateMenuItem_Success() {
        CreateMenuItemRequest req = new CreateMenuItemRequest();
        when(service.createMenuItem(any(CreateMenuItemRequest.class))).thenReturn(sampleResponse);

        ResponseEntity<?> response = controller.createMenuItem(req);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testCreateMenuItem_BadRequest() {
        CreateMenuItemRequest req = new CreateMenuItemRequest();
        when(service.createMenuItem(any(CreateMenuItemRequest.class))).thenThrow(new RuntimeException("Exists"));

        ResponseEntity<?> response = controller.createMenuItem(req);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Exists", response.getBody());
    }

    @Test
    void testUpdateMenuItem_Success() {
        UpdateMenuItemRequest req = new UpdateMenuItemRequest();
        when(service.updateMenuItem(eq(1L), any(UpdateMenuItemRequest.class))).thenReturn(sampleResponse);

        ResponseEntity<?> response = controller.updateMenuItem(1L, req);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testUpdateMenuItem_NotFound() {
        UpdateMenuItemRequest req = new UpdateMenuItemRequest();
        when(service.updateMenuItem(eq(99L), any(UpdateMenuItemRequest.class))).thenThrow(new RuntimeException("Not found"));

        ResponseEntity<?> response = controller.updateMenuItem(99L, req);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Not found", response.getBody());
    }

    @Test
    void testDeleteMenuItem_Success() {
        doNothing().when(service).deleteMenuItem(1L);

        ResponseEntity<?> response = controller.deleteMenuItem(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Xóa món nước thành công!", response.getBody());
    }

    @Test
    void testDeleteMenuItem_NotFound() {
        doThrow(new RuntimeException("Not found")).when(service).deleteMenuItem(99L);

        ResponseEntity<?> response = controller.deleteMenuItem(99L);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Not found", response.getBody());
    }
}
