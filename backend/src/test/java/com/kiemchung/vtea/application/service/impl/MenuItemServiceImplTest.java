package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.request.CreateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import com.kiemchung.vtea.domain.entity.Category;
import com.kiemchung.vtea.domain.entity.Product;
import com.kiemchung.vtea.domain.repository.CategoryRepository;
import com.kiemchung.vtea.domain.repository.ProductRepository;
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
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private MenuItemServiceImpl service;

    private Category sampleCategory;
    private Product sampleProduct;
    private CreateMenuItemRequest createRequest;

    @BeforeEach
    void setUp() {
        sampleCategory = new Category();
        sampleCategory.setCategoryId(1);
        sampleCategory.setName("Trà sữa");
        sampleCategory.setIsAvailable(true);

        sampleProduct = new Product();
        sampleProduct.setProductId(1);
        sampleProduct.setName("Trà Sữa Truyền Thống");
        sampleProduct.setPrice(new BigDecimal("35000"));
        sampleProduct.setImageUrl("/images/tra-sua.png");
        sampleProduct.setIsAvailable(true);
        sampleProduct.setCategory(sampleCategory);

        createRequest = new CreateMenuItemRequest();
        createRequest.setName("Trà Sữa Truyền Thống");
        createRequest.setDescription("Thơm ngon đậm vị");
        createRequest.setPrice(new BigDecimal("35000"));
        createRequest.setImageUrl("/images/tra-sua.png");
        createRequest.setCategory("Trà sữa");
    }

    @Test
    void getAllMenuItems_Success() {
        Product productNoCatNoId = new Product();
        productNoCatNoId.setProductId(null);
        productNoCatNoId.setName("Món lẻ");
        productNoCatNoId.setPrice(new BigDecimal("10000"));
        productNoCatNoId.setIsAvailable(true);
        productNoCatNoId.setCategory(null);

        when(productRepository.findByIsAvailableTrue()).thenReturn(List.of(sampleProduct, productNoCatNoId));

        List<MenuItemResponse> result = service.getAllMenuItems();

        assertEquals(2, result.size());
        MenuItemResponse res = result.get(0);
        assertEquals(1L, res.getId());
        assertEquals("Trà Sữa Truyền Thống", res.getName());
        assertEquals(new BigDecimal("35000"), res.getPrice());
        assertEquals("/images/tra-sua.png", res.getImageUrl());
        assertEquals("Trà sữa", res.getCategory());

        assertNull(result.get(1).getId());
        assertNull(result.get(1).getCategory());
        verify(productRepository, times(1)).findByIsAvailableTrue();
    }

    @Test
    void getMenuItemById_Success() {
        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));

        MenuItemResponse res = service.getMenuItemById(1L);

        assertNotNull(res);
        assertEquals(1L, res.getId());
        assertEquals("Trà Sữa Truyền Thống", res.getName());
        verify(productRepository, times(1)).findById(1);
    }

    @Test
    void getMenuItemById_NotFoundOrUnavailable_ThrowsException() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.getMenuItemById(99L));
        assertTrue(ex.getMessage().contains("Không tìm thấy món nước với ID: 99"));

        sampleProduct.setIsAvailable(false);
        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        assertThrows(RuntimeException.class, () -> service.getMenuItemById(1L));
    }

    @Test
    void createMenuItem_Success_ExistingCategory() {
        when(productRepository.existsByName("Trà Sữa Truyền Thống")).thenReturn(false);
        when(categoryRepository.findByNameIgnoreCase("Trà sữa")).thenReturn(Optional.of(sampleCategory));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        MenuItemResponse res = service.createMenuItem(createRequest);

        assertNotNull(res);
        assertEquals("Trà Sữa Truyền Thống", res.getName());
        assertEquals("Trà sữa", res.getCategory());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createMenuItem_Success_NewDefaultCategory() {
        createRequest.setCategory("  ");
        when(productRepository.existsByName("Trà Sữa Truyền Thống")).thenReturn(false);
        when(categoryRepository.findByNameIgnoreCase("Khác")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenAnswer(i -> i.getArguments()[0]);
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        MenuItemResponse res = service.createMenuItem(createRequest);

        assertNotNull(res);
        assertEquals("Khác", res.getCategory());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createMenuItem_Success_NullCategory() {
        createRequest.setCategory(null);
        when(productRepository.existsByName("Trà Sữa Truyền Thống")).thenReturn(false);
        when(categoryRepository.findByNameIgnoreCase("Khác")).thenReturn(Optional.of(sampleCategory));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        MenuItemResponse res = service.createMenuItem(createRequest);

        assertNotNull(res);
    }

    @Test
    void createMenuItem_ThrowsException_WhenNameBlankOrNull() {
        createRequest.setName("   ");
        assertThrows(RuntimeException.class, () -> service.createMenuItem(createRequest));

        createRequest.setName(null);
        assertThrows(RuntimeException.class, () -> service.createMenuItem(createRequest));
    }

    @Test
    void createMenuItem_ThrowsException_WhenPriceInvalid() {
        createRequest.setPrice(BigDecimal.ZERO);
        assertThrows(RuntimeException.class, () -> service.createMenuItem(createRequest));

        createRequest.setPrice(null);
        assertThrows(RuntimeException.class, () -> service.createMenuItem(createRequest));
    }

    @Test
    void createMenuItem_ThrowsException_WhenNameExists() {
        when(productRepository.existsByName("Trà Sữa Truyền Thống")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.createMenuItem(createRequest));
        assertEquals("Tên món nước đã tồn tại!", ex.getMessage());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateMenuItem_Success_AllFields() {
        UpdateMenuItemRequest updateRequest = new UpdateMenuItemRequest();
        updateRequest.setName("Trà Đào Cam Sả");
        updateRequest.setPrice(new BigDecimal("45000"));
        updateRequest.setImageUrl("/images/tra-dao.png");
        updateRequest.setCategory("Trà");

        Category newCat = new Category();
        newCat.setCategoryId(2);
        newCat.setName("Trà");

        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.existsByName("Trà Đào Cam Sả")).thenReturn(false);
        when(categoryRepository.findByNameIgnoreCase("Trà")).thenReturn(Optional.of(newCat));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        MenuItemResponse res = service.updateMenuItem(1L, updateRequest);

        assertEquals("Trà Đào Cam Sả", res.getName());
        assertEquals(new BigDecimal("45000"), res.getPrice());
        assertEquals("/images/tra-dao.png", res.getImageUrl());
        assertEquals("Trà", res.getCategory());
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    void updateMenuItem_SameName_DoesNotCheckDuplicate() {
        UpdateMenuItemRequest updateRequest = new UpdateMenuItemRequest();
        updateRequest.setName("trà sữa truyền thống");
        updateRequest.setCategory("   ");

        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        MenuItemResponse res = service.updateMenuItem(1L, updateRequest);

        assertEquals("trà sữa truyền thống", res.getName());
        verify(productRepository, never()).existsByName(anyString());
    }

    @Test
    void updateMenuItem_ThrowsException_WhenNewNameExists() {
        UpdateMenuItemRequest updateRequest = new UpdateMenuItemRequest();
        updateRequest.setName("Món Trùng");

        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.existsByName("Món Trùng")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> service.updateMenuItem(1L, updateRequest));
    }

    @Test
    void updateMenuItem_ThrowsException_WhenPriceInvalid() {
        UpdateMenuItemRequest updateRequest = new UpdateMenuItemRequest();
        updateRequest.setName("   ");
        updateRequest.setPrice(new BigDecimal("-5000"));

        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));

        assertThrows(RuntimeException.class, () -> service.updateMenuItem(1L, updateRequest));
    }

    @Test
    void updateMenuItem_Success_NullFields() {
        UpdateMenuItemRequest emptyRequest = new UpdateMenuItemRequest();

        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        MenuItemResponse res = service.updateMenuItem(1L, emptyRequest);

        assertEquals("Trà Sữa Truyền Thống", res.getName());
        assertEquals(new BigDecimal("35000"), res.getPrice());
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    void updateMenuItem_NotFound_ThrowsException() {
        UpdateMenuItemRequest updateRequest = new UpdateMenuItemRequest();
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.updateMenuItem(99L, updateRequest));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void deleteMenuItem_Success() {
        when(productRepository.findById(1)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArguments()[0]);

        service.deleteMenuItem(1L);

        assertFalse(sampleProduct.getIsAvailable());
        verify(productRepository, times(1)).findById(1);
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    void deleteMenuItem_NotFound_ThrowsException() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.deleteMenuItem(99L));
        verify(productRepository, never()).save(any(Product.class));
    }
}
