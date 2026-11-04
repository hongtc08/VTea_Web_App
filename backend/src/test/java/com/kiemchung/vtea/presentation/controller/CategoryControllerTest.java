package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.CategoryService;
import com.kiemchung.vtea.domain.dto.request.CategoryRequest;
import com.kiemchung.vtea.domain.dto.response.CategoryResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;

    private CategoryResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new CategoryResponse(1, "Trà sữa", true);
    }

    @Test
    void testGetAllCategories() {
        when(categoryService.getAllCategories()).thenReturn(List.of(sampleResponse));

        ResponseEntity<List<CategoryResponse>> response = categoryController.getAllCategories();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("Trà sữa", response.getBody().get(0).getName());
    }

    @Test
    void testGetAvailableCategories() {
        when(categoryService.getAvailableCategories()).thenReturn(List.of(sampleResponse));

        ResponseEntity<List<CategoryResponse>> response = categoryController.getAvailableCategories();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("Trà sữa", response.getBody().get(0).getName());
    }

    @Test
    void testGetCategoryById_Success() {
        when(categoryService.getCategoryById(1)).thenReturn(sampleResponse);

        ResponseEntity<?> response = categoryController.getCategoryById(1);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testGetCategoryById_NotFound() {
        when(categoryService.getCategoryById(99)).thenThrow(new RuntimeException("Không tìm thấy danh mục với ID: 99"));

        ResponseEntity<?> response = categoryController.getCategoryById(99);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Không tìm thấy danh mục với ID: 99", response.getBody());
    }

    @Test
    void testCreateCategory_Success() {
        CategoryRequest req = new CategoryRequest("Trà sữa", true);
        when(categoryService.createCategory(any(CategoryRequest.class))).thenReturn(sampleResponse);

        ResponseEntity<?> response = categoryController.createCategory(req);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testCreateCategory_BadRequest() {
        CategoryRequest req = new CategoryRequest("Trà sữa", true);
        when(categoryService.createCategory(any(CategoryRequest.class))).thenThrow(new RuntimeException("Tên danh mục đã tồn tại!"));

        ResponseEntity<?> response = categoryController.createCategory(req);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Tên danh mục đã tồn tại!", response.getBody());
    }

    @Test
    void testUpdateCategory_Success() {
        CategoryRequest req = new CategoryRequest("Trà trái cây", true);
        when(categoryService.updateCategory(eq(1), any(CategoryRequest.class))).thenReturn(sampleResponse);

        ResponseEntity<?> response = categoryController.updateCategory(1, req);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void testUpdateCategory_NotFound() {
        CategoryRequest req = new CategoryRequest("Trà trái cây", true);
        when(categoryService.updateCategory(eq(99), any(CategoryRequest.class)))
                .thenThrow(new RuntimeException("Không tìm thấy danh mục với ID: 99"));

        ResponseEntity<?> response = categoryController.updateCategory(99, req);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Không tìm thấy danh mục với ID: 99", response.getBody());
    }

    @Test
    void testUpdateCategory_BadRequest() {
        CategoryRequest req = new CategoryRequest("Trà sữa", true);
        when(categoryService.updateCategory(eq(1), any(CategoryRequest.class)))
                .thenThrow(new RuntimeException("Tên danh mục đã tồn tại!"));

        ResponseEntity<?> response = categoryController.updateCategory(1, req);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Tên danh mục đã tồn tại!", response.getBody());
    }

    @Test
    void testDeleteCategory_Success() {
        doNothing().when(categoryService).deleteCategory(1);

        ResponseEntity<?> response = categoryController.deleteCategory(1);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Xóa danh mục thành công!", response.getBody());
    }

    @Test
    void testDeleteCategory_NotFound() {
        doThrow(new RuntimeException("Không tìm thấy danh mục với ID: 99")).when(categoryService).deleteCategory(99);

        ResponseEntity<?> response = categoryController.deleteCategory(99);

        assertEquals(404, response.getStatusCode().value());
        assertEquals("Không tìm thấy danh mục với ID: 99", response.getBody());
    }
}
