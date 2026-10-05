package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import com.kiemchung.vtea.domain.entity.MenuItem;
import com.kiemchung.vtea.domain.repository.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class MenuItemServiceImplTest {

    @Mock
    private MenuItemRepository repository;

    @InjectMocks
    private MenuItemServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllMenuItems() {
        // Prepare mock entity
        MenuItem item = new MenuItem();
        item.setId(1L);
        item.setName("Tra Sua");
        item.setDescription("Ngon");
        item.setPrice(new BigDecimal("30000"));
        item.setImageUrl("url");
        item.setCategory("Trà sữa");

        when(repository.findAll()).thenReturn(Arrays.asList(item));

        // Execute service
        List<MenuItemResponse> result = service.getAllMenuItems();

        // Assert response
        assertEquals(1, result.size());
        MenuItemResponse res = result.get(0);
        assertEquals(1L, res.getId());
        assertEquals("Tra Sua", res.getName());
        assertEquals("Ngon", res.getDescription());
        assertEquals(new BigDecimal("30000"), res.getPrice());
        assertEquals("url", res.getImageUrl());
        assertEquals("Trà sữa", res.getCategory());
    }
}
