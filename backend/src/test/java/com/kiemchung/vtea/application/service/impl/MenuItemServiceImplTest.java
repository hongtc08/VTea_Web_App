package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.request.CreateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import com.kiemchung.vtea.domain.entity.MenuItem;
import com.kiemchung.vtea.domain.repository.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuItemServiceImplTest {

    @Mock
    private MenuItemRepository repository;

    @InjectMocks
    private MenuItemServiceImpl service;

    private MenuItem sampleItem;
    private CreateMenuItemRequest createRequest;

    @BeforeEach
    void setUp() {
        sampleItem = new MenuItem();
        sampleItem.setId(1L);
        sampleItem.setName("Trà Sữa Truyền Thống");
        sampleItem.setDescription("Thơm ngon đậm vị");
        sampleItem.setPrice(new BigDecimal("35000"));
        sampleItem.setImageUrl("/images/tra-sua.png");
        sampleItem.setCategory("Trà sữa");

        createRequest = new CreateMenuItemRequest();
        createRequest.setName("Trà Sữa Truyền Thống");
        createRequest.setDescription("Thơm ngon đậm vị");
        createRequest.setPrice(new BigDecimal("35000"));
        createRequest.setImageUrl("/images/tra-sua.png");
        createRequest.setCategory("Trà sữa");
    }

    @Test
    void getAllMenuItems_Success() {
        when(repository.findAll()).thenReturn(List.of(sampleItem));

        List<MenuItemResponse> result = service.getAllMenuItems();

        assertEquals(1, result.size());
        MenuItemResponse res = result.get(0);
        assertEquals(1L, res.getId());
        assertEquals("Trà Sữa Truyền Thống", res.getName());
        assertEquals("Thơm ngon đậm vị", res.getDescription());
        assertEquals(new BigDecimal("35000"), res.getPrice());
        assertEquals("/images/tra-sua.png", res.getImageUrl());
        assertEquals("Trà sữa", res.getCategory());
        verify(repository, times(1)).findAll();
    }

    @Test
    void getMenuItemById_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));

        MenuItemResponse res = service.getMenuItemById(1L);

        assertNotNull(res);
        assertEquals(1L, res.getId());
        assertEquals("Trà Sữa Truyền Thống", res.getName());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void getMenuItemById_NotFound_ThrowsException() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.getMenuItemById(99L));
        assertTrue(ex.getMessage().contains("Không tìm thấy món nước với ID: 99"));
        verify(repository, times(1)).findById(99L);
    }

    @Test
    void createMenuItem_Success() {
        when(repository.existsByName("Trà Sữa Truyền Thống")).thenReturn(false);
        when(repository.save(any(MenuItem.class))).thenReturn(sampleItem);

        MenuItemResponse res = service.createMenuItem(createRequest);

        assertNotNull(res);
        assertEquals("Trà Sữa Truyền Thống", res.getName());
        assertEquals(new BigDecimal("35000"), res.getPrice());
        verify(repository, times(1)).existsByName("Trà Sữa Truyền Thống");
        verify(repository, times(1)).save(any(MenuItem.class));
    }

    @Test
    void createMenuItem_ThrowsException_WhenNameExists() {
        when(repository.existsByName("Trà Sữa Truyền Thống")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.createMenuItem(createRequest));
        assertEquals("Tên món nước đã tồn tại!", ex.getMessage());
        verify(repository, never()).save(any(MenuItem.class));
    }

    @Test
    void updateMenuItem_Success_AllFields() {
        UpdateMenuItemRequest updateRequest = new UpdateMenuItemRequest();
        updateRequest.setName("Trà Đào Cam Sả");
        updateRequest.setDescription("Mát lạnh");
        updateRequest.setPrice(new BigDecimal("45000"));
        updateRequest.setImageUrl("/images/tra-dao.png");
        updateRequest.setCategory("Trà");

        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));
        when(repository.save(any(MenuItem.class))).thenAnswer(i -> i.getArguments()[0]);

        MenuItemResponse res = service.updateMenuItem(1L, updateRequest);

        assertEquals("Trà Đào Cam Sả", res.getName());
        assertEquals("Mát lạnh", res.getDescription());
        assertEquals(new BigDecimal("45000"), res.getPrice());
        assertEquals("/images/tra-dao.png", res.getImageUrl());
        assertEquals("Trà", res.getCategory());
        verify(repository, times(1)).save(sampleItem);
    }

    @Test
    void updateMenuItem_Success_NullFields() {
        UpdateMenuItemRequest emptyRequest = new UpdateMenuItemRequest();

        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));
        when(repository.save(any(MenuItem.class))).thenAnswer(i -> i.getArguments()[0]);

        MenuItemResponse res = service.updateMenuItem(1L, emptyRequest);

        assertEquals("Trà Sữa Truyền Thống", res.getName());
        assertEquals("Thơm ngon đậm vị", res.getDescription());
        assertEquals(new BigDecimal("35000"), res.getPrice());
        verify(repository, times(1)).save(sampleItem);
    }

    @Test
    void updateMenuItem_NotFound_ThrowsException() {
        UpdateMenuItemRequest updateRequest = new UpdateMenuItemRequest();
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.updateMenuItem(99L, updateRequest));
        verify(repository, never()).save(any(MenuItem.class));
    }

    @Test
    void deleteMenuItem_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleItem));

        service.deleteMenuItem(1L);

        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).delete(sampleItem);
    }

    @Test
    void deleteMenuItem_NotFound_ThrowsException() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.deleteMenuItem(99L));
        verify(repository, never()).delete(any(MenuItem.class));
    }
}
