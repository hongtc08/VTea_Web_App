package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.MenuItemService;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class MenuItemControllerTest {

    @Mock
    private MenuItemService service;

    @InjectMocks
    private MenuItemController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetMenu() {
        MenuItemResponse res = new MenuItemResponse(1L, "Tra Sua", "Ngon", new BigDecimal("30000"), "url", "Trà sữa");
        when(service.getAllMenuItems()).thenReturn(Arrays.asList(res));

        ResponseEntity<List<MenuItemResponse>> response = controller.getMenu();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("Tra Sua", response.getBody().get(0).getName());
    }
}
