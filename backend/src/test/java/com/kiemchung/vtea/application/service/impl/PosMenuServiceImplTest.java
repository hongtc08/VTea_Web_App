package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.response.PosMenuResponse;
import com.kiemchung.vtea.domain.entity.Category;
import com.kiemchung.vtea.domain.entity.Product;
import com.kiemchung.vtea.domain.entity.Topping;
import com.kiemchung.vtea.domain.repository.CategoryRepository;
import com.kiemchung.vtea.domain.repository.ProductRepository;
import com.kiemchung.vtea.domain.repository.ToppingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PosMenuServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ToppingRepository toppingRepository;

    @InjectMocks
    private PosMenuServiceImpl posMenuService;

    private Category sampleCategory;
    private Product sampleProductWithCat;
    private Product sampleProductWithoutCat;
    private Topping sampleTopping;

    @BeforeEach
    void setUp() {
        sampleCategory = new Category();
        sampleCategory.setCategoryId(1);
        sampleCategory.setName("Cà phê");
        sampleCategory.setIsAvailable(true);

        sampleProductWithCat = new Product();
        sampleProductWithCat.setProductId(10);
        sampleProductWithCat.setName("Bạc xỉu");
        sampleProductWithCat.setPrice(new BigDecimal("35000"));
        sampleProductWithCat.setImageUrl("/images/bac-xiu.png");
        sampleProductWithCat.setIsAvailable(true);
        sampleProductWithCat.setCategory(sampleCategory);

        sampleProductWithoutCat = new Product();
        sampleProductWithoutCat.setProductId(11);
        sampleProductWithoutCat.setName("Nước suối");
        sampleProductWithoutCat.setPrice(new BigDecimal("15000"));
        sampleProductWithoutCat.setImageUrl("/images/nuoc-suoi.png");
        sampleProductWithoutCat.setIsAvailable(true);
        sampleProductWithoutCat.setCategory(null);

        sampleTopping = new Topping();
        sampleTopping.setToppingId(100);
        sampleTopping.setName("Trân châu đen");
        sampleTopping.setPrice(new BigDecimal("5000"));
        sampleTopping.setImageUrl("/images/tran-chau.png");
        sampleTopping.setIsAvailable(true);
    }

    @Test
    void getPosMenu_Success_NoFilter() {
        when(categoryRepository.findByIsAvailableTrue()).thenReturn(List.of(sampleCategory));
        when(productRepository.searchAvailableProductsForPos(null, null, null))
                .thenReturn(List.of(sampleProductWithCat, sampleProductWithoutCat));
        when(toppingRepository.findByIsAvailableTrue()).thenReturn(List.of(sampleTopping));

        PosMenuResponse response = posMenuService.getPosMenu(null, null, null);

        assertNotNull(response);
        assertEquals(1, response.getCategories().size());
        assertEquals("Cà phê", response.getCategories().get(0).getName());

        assertEquals(2, response.getProducts().size());
        assertEquals("Bạc xỉu", response.getProducts().get(0).getName());
        assertEquals(1, response.getProducts().get(0).getCategoryId());
        assertEquals("Cà phê", response.getProducts().get(0).getCategoryName());

        assertEquals("Nước suối", response.getProducts().get(1).getName());
        assertNull(response.getProducts().get(1).getCategoryId());
        assertNull(response.getProducts().get(1).getCategoryName());

        assertEquals(1, response.getToppings().size());
        assertEquals("Trân châu đen", response.getToppings().get(0).getName());

        verify(categoryRepository, times(1)).findByIsAvailableTrue();
        verify(productRepository, times(1)).searchAvailableProductsForPos(null, null, null);
        verify(toppingRepository, times(1)).findByIsAvailableTrue();
    }

    @Test
    void getPosMenu_Success_WithKeywordAndCategory() {
        when(categoryRepository.findByIsAvailableTrue()).thenReturn(List.of(sampleCategory));
        when(productRepository.searchAvailableProductsForPos("bạc", 1, "Cà phê"))
                .thenReturn(List.of(sampleProductWithCat));
        when(toppingRepository.findByIsAvailableTrue()).thenReturn(List.of(sampleTopping));

        PosMenuResponse response = posMenuService.getPosMenu("  bạc  ", 1, " Cà phê ");

        assertNotNull(response);
        assertEquals(1, response.getProducts().size());
        assertEquals("Bạc xỉu", response.getProducts().get(0).getName());
        verify(productRepository, times(1)).searchAvailableProductsForPos("bạc", 1, "Cà phê");
    }

    @Test
    void getPosMenu_BlankKeywordAndTatCaCategory_TreatedAsNull() {
        when(categoryRepository.findByIsAvailableTrue()).thenReturn(List.of());
        when(productRepository.searchAvailableProductsForPos(null, 2, null)).thenReturn(List.of());
        when(toppingRepository.findByIsAvailableTrue()).thenReturn(List.of());

        PosMenuResponse response = posMenuService.getPosMenu("   ", 2, "Tất cả");
        assertNotNull(response);
        assertTrue(response.getProducts().isEmpty());

        PosMenuResponse response2 = posMenuService.getPosMenu("", 2, "   ");
        assertNotNull(response2);

        verify(productRepository, times(2)).searchAvailableProductsForPos(null, 2, null);
    }
}
