package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.PosMenuService;
import com.kiemchung.vtea.domain.dto.response.CategoryResponse;
import com.kiemchung.vtea.domain.dto.response.PosMenuResponse;
import com.kiemchung.vtea.domain.dto.response.PosProductResponse;
import com.kiemchung.vtea.domain.dto.response.ToppingResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PosMenuControllerTest {

    @Mock
    private PosMenuService posMenuService;

    @InjectMocks
    private PosMenuController posMenuController;

    @Test
    void testGetPosMenu_WithKeyword() {
        PosMenuResponse sampleResponse = new PosMenuResponse(
                List.of(new CategoryResponse(1, "Cà phê", true)),
                List.of(new PosProductResponse(10, "Bạc xỉu", new BigDecimal("35000"), "url", 1, "Cà phê")),
                List.of(new ToppingResponse(100, "Trân châu đen", new BigDecimal("5000"), "url", true))
        );

        when(posMenuService.getPosMenu("bạc", 1, "Cà phê")).thenReturn(sampleResponse);

        ResponseEntity<PosMenuResponse> response = posMenuController.getPosMenu("bạc", null, 1, "Cà phê");

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getCategories().size());
        assertEquals(1, response.getBody().getProducts().size());
        assertEquals(1, response.getBody().getToppings().size());
        verify(posMenuService, times(1)).getPosMenu("bạc", 1, "Cà phê");
    }

    @Test
    void testGetPosMenu_WithSearchFallback() {
        PosMenuResponse sampleResponse = new PosMenuResponse(List.of(), List.of(), List.of());
        when(posMenuService.getPosMenu("trà", null, null)).thenReturn(sampleResponse);

        ResponseEntity<PosMenuResponse> response = posMenuController.getPosMenu("  ", "trà", null, null);

        assertEquals(200, response.getStatusCode().value());
        verify(posMenuService, times(1)).getPosMenu("trà", null, null);
    }
}
