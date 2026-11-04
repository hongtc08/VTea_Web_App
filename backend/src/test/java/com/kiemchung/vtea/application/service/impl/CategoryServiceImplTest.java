package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.request.CategoryRequest;
import com.kiemchung.vtea.domain.dto.response.CategoryResponse;
import com.kiemchung.vtea.domain.entity.Category;
import com.kiemchung.vtea.domain.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category sampleCategory;
    private CategoryRequest createRequest;

    @BeforeEach
    void setUp() {
        sampleCategory = new Category();
        sampleCategory.setCategoryId(1);
        sampleCategory.setName("Trà sữa");
        sampleCategory.setIsAvailable(true);

        createRequest = new CategoryRequest("Trà sữa", true);
    }

    @Test
    void getAllCategories_Success() {
        when(categoryRepository.findAll()).thenReturn(List.of(sampleCategory));

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertEquals(1, result.size());
        CategoryResponse res = result.get(0);
        assertEquals(1, res.getCategoryId());
        assertEquals("Trà sữa", res.getName());
        assertTrue(res.getIsAvailable());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getAvailableCategories_Success() {
        when(categoryRepository.findByIsAvailableTrue()).thenReturn(List.of(sampleCategory));

        List<CategoryResponse> result = categoryService.getAvailableCategories();

        assertEquals(1, result.size());
        CategoryResponse res = result.get(0);
        assertEquals(1, res.getCategoryId());
        assertEquals("Trà sữa", res.getName());
        assertTrue(res.getIsAvailable());
        verify(categoryRepository, times(1)).findByIsAvailableTrue();
    }

    @Test
    void getCategoryById_Success() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(sampleCategory));

        CategoryResponse res = categoryService.getCategoryById(1);

        assertNotNull(res);
        assertEquals(1, res.getCategoryId());
        assertEquals("Trà sữa", res.getName());
        assertTrue(res.getIsAvailable());
        verify(categoryRepository, times(1)).findById(1);
    }

    @Test
    void getCategoryById_NotFound_ThrowsException() {
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> categoryService.getCategoryById(99));
        assertTrue(ex.getMessage().contains("Không tìm thấy danh mục với ID: 99"));
        verify(categoryRepository, times(1)).findById(99);
    }

    @Test
    void createCategory_Success_WithExplicitAvailable() {
        when(categoryRepository.existsByNameIgnoreCase("Trà sữa")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);

        CategoryResponse res = categoryService.createCategory(createRequest);

        assertNotNull(res);
        assertEquals("Trà sữa", res.getName());
        assertTrue(res.getIsAvailable());
        verify(categoryRepository, times(1)).existsByNameIgnoreCase("Trà sữa");
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createCategory_Success_WithDefaultAvailable() {
        CategoryRequest reqWithNullAvailable = new CategoryRequest("  Cà phê  ", null);
        when(categoryRepository.existsByNameIgnoreCase("Cà phê")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(i -> i.getArguments()[0]);

        CategoryResponse res = categoryService.createCategory(reqWithNullAvailable);

        assertNotNull(res);
        assertEquals("Cà phê", res.getName());
        assertTrue(res.getIsAvailable());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createCategory_ThrowsException_WhenNameNullOrBlank() {
        CategoryRequest blankRequest = new CategoryRequest("   ", true);
        RuntimeException ex1 = assertThrows(RuntimeException.class, () -> categoryService.createCategory(blankRequest));
        assertEquals("Tên danh mục không được để trống!", ex1.getMessage());

        CategoryRequest nullRequest = new CategoryRequest(null, true);
        RuntimeException ex2 = assertThrows(RuntimeException.class, () -> categoryService.createCategory(nullRequest));
        assertEquals("Tên danh mục không được để trống!", ex2.getMessage());

        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void createCategory_ThrowsException_WhenNameExists() {
        when(categoryRepository.existsByNameIgnoreCase("Trà sữa")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> categoryService.createCategory(createRequest));
        assertEquals("Tên danh mục đã tồn tại!", ex.getMessage());
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void updateCategory_Success_NewNameAndAvailability() {
        CategoryRequest updateRequest = new CategoryRequest("Trà trái cây", false);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.existsByNameIgnoreCase("Trà trái cây")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(i -> i.getArguments()[0]);

        CategoryResponse res = categoryService.updateCategory(1, updateRequest);

        assertEquals("Trà trái cây", res.getName());
        assertFalse(res.getIsAvailable());
        verify(categoryRepository, times(1)).existsByNameIgnoreCase("Trà trái cây");
        verify(categoryRepository, times(1)).save(sampleCategory);
    }

    @Test
    void updateCategory_SameNameIgnoreCase_DoesNotCheckDuplicate() {
        CategoryRequest updateRequest = new CategoryRequest("trà sữa", true);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.save(any(Category.class))).thenAnswer(i -> i.getArguments()[0]);

        CategoryResponse res = categoryService.updateCategory(1, updateRequest);

        assertEquals("Trà sữa", res.getName());
        verify(categoryRepository, never()).existsByNameIgnoreCase(anyString());
        verify(categoryRepository, times(1)).save(sampleCategory);
    }

    @Test
    void updateCategory_Success_WhenFieldsNullOrBlank() {
        CategoryRequest nullFieldsRequest = new CategoryRequest(null, null);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.save(any(Category.class))).thenAnswer(i -> i.getArguments()[0]);

        CategoryResponse res1 = categoryService.updateCategory(1, nullFieldsRequest);
        assertEquals("Trà sữa", res1.getName());
        assertTrue(res1.getIsAvailable());

        CategoryRequest blankNameRequest = new CategoryRequest("   ", null);
        CategoryResponse res2 = categoryService.updateCategory(1, blankNameRequest);
        assertEquals("Trà sữa", res2.getName());
    }

    @Test
    void updateCategory_ThrowsException_WhenNewNameExists() {
        CategoryRequest updateRequest = new CategoryRequest("Đá xay", true);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.existsByNameIgnoreCase("Đá xay")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> categoryService.updateCategory(1, updateRequest));
        assertEquals("Tên danh mục đã tồn tại!", ex.getMessage());
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void updateCategory_NotFound_ThrowsException() {
        CategoryRequest updateRequest = new CategoryRequest("Đá xay", true);
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> categoryService.updateCategory(99, updateRequest));
        assertTrue(ex.getMessage().contains("Không tìm thấy danh mục với ID: 99"));
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void deleteCategory_Success() {
        when(categoryRepository.findById(1)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.save(any(Category.class))).thenAnswer(i -> i.getArguments()[0]);

        categoryService.deleteCategory(1);

        assertFalse(sampleCategory.getIsAvailable());
        verify(categoryRepository, times(1)).findById(1);
        verify(categoryRepository, times(1)).save(sampleCategory);
    }

    @Test
    void deleteCategory_NotFound_ThrowsException() {
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> categoryService.deleteCategory(99));
        assertTrue(ex.getMessage().contains("Không tìm thấy danh mục với ID: 99"));
        verify(categoryRepository, never()).save(any(Category.class));
    }
}
