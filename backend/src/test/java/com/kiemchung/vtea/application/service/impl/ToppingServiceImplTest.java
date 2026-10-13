package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.request.CreateToppingRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateToppingRequest;
import com.kiemchung.vtea.domain.dto.response.ToppingResponse;
import com.kiemchung.vtea.domain.entity.Topping;
import com.kiemchung.vtea.domain.repository.ToppingRepository;
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
class ToppingServiceImplTest {

    @Mock
    private ToppingRepository toppingRepository;

    @InjectMocks
    private ToppingServiceImpl toppingService;

    private Topping sampleTopping;
    private CreateToppingRequest createRequest;

    @BeforeEach
    void setUp() {
        sampleTopping = new Topping();
        sampleTopping.setToppingId(1);
        sampleTopping.setName("Trân châu đen");
        sampleTopping.setPrice(new BigDecimal("5000"));
        sampleTopping.setImageUrl("/images/toppings/tran-chau.jpg");
        sampleTopping.setIsAvailable(true);

        createRequest = new CreateToppingRequest();
        createRequest.setName("Trân châu đen");
        createRequest.setPrice(new BigDecimal("5000"));
        createRequest.setImageUrl("/images/toppings/tran-chau.jpg");
        createRequest.setIsAvailable(true);
    }

    @Test
    void getAllToppings_Success() {
        when(toppingRepository.findByIsAvailableTrue()).thenReturn(List.of(sampleTopping));

        List<ToppingResponse> result = toppingService.getAllToppings();

        assertEquals(1, result.size());
        ToppingResponse res = result.get(0);
        assertEquals(1, res.getToppingId());
        assertEquals("Trân châu đen", res.getName());
        assertEquals(new BigDecimal("5000"), res.getPrice());
        assertEquals("/images/toppings/tran-chau.jpg", res.getImageUrl());
        assertTrue(res.getIsAvailable());
        verify(toppingRepository, times(1)).findByIsAvailableTrue();
    }

    @Test
    void getToppingById_Success() {
        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));

        ToppingResponse res = toppingService.getToppingById(1);

        assertNotNull(res);
        assertEquals(1, res.getToppingId());
        assertEquals("Trân châu đen", res.getName());
        verify(toppingRepository, times(1)).findById(1);
    }

    @Test
    void getToppingById_NotFoundOrUnavailable_ThrowsException() {
        when(toppingRepository.findById(99)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> toppingService.getToppingById(99));
        assertTrue(ex.getMessage().contains("Không tìm thấy topping với ID: 99"));

        sampleTopping.setIsAvailable(false);
        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));
        assertThrows(RuntimeException.class, () -> toppingService.getToppingById(1));
    }

    @Test
    void createTopping_Success_WithExplicitAvailable() {
        when(toppingRepository.existsByName("Trân châu đen")).thenReturn(false);
        when(toppingRepository.save(any(Topping.class))).thenReturn(sampleTopping);

        ToppingResponse res = toppingService.createTopping(createRequest);

        assertNotNull(res);
        assertEquals("Trân châu đen", res.getName());
        assertTrue(res.getIsAvailable());
        verify(toppingRepository, times(1)).existsByName("Trân châu đen");
        verify(toppingRepository, times(1)).save(any(Topping.class));
    }

    @Test
    void createTopping_Success_WithDefaultAvailable() {
        createRequest.setIsAvailable(null);
        when(toppingRepository.existsByName("Trân châu đen")).thenReturn(false);
        when(toppingRepository.save(any(Topping.class))).thenAnswer(i -> i.getArguments()[0]);

        ToppingResponse res = toppingService.createTopping(createRequest);

        assertNotNull(res);
        assertTrue(res.getIsAvailable());
        verify(toppingRepository, times(1)).save(any(Topping.class));
    }

    @Test
    void createTopping_ThrowsException_WhenNameBlankOrNull() {
        createRequest.setName("  ");
        assertThrows(RuntimeException.class, () -> toppingService.createTopping(createRequest));

        createRequest.setName(null);
        assertThrows(RuntimeException.class, () -> toppingService.createTopping(createRequest));
    }

    @Test
    void createTopping_ThrowsException_WhenPriceInvalid() {
        createRequest.setPrice(BigDecimal.ZERO);
        assertThrows(RuntimeException.class, () -> toppingService.createTopping(createRequest));

        createRequest.setPrice(null);
        assertThrows(RuntimeException.class, () -> toppingService.createTopping(createRequest));
    }

    @Test
    void createTopping_ThrowsException_WhenNameExists() {
        when(toppingRepository.existsByName("Trân châu đen")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> toppingService.createTopping(createRequest));
        assertEquals("Tên topping đã tồn tại!", ex.getMessage());
        verify(toppingRepository, never()).save(any(Topping.class));
    }

    @Test
    void updateTopping_Success_AllFields() {
        UpdateToppingRequest updateRequest = new UpdateToppingRequest();
        updateRequest.setName("Trân châu trắng");
        updateRequest.setPrice(new BigDecimal("8000"));
        updateRequest.setImageUrl("/images/toppings/tc-trang.jpg");
        updateRequest.setIsAvailable(false);

        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));
        when(toppingRepository.existsByName("Trân châu trắng")).thenReturn(false);
        when(toppingRepository.save(any(Topping.class))).thenAnswer(i -> i.getArguments()[0]);

        ToppingResponse res = toppingService.updateTopping(1, updateRequest);

        assertEquals("Trân châu trắng", res.getName());
        assertEquals(new BigDecimal("8000"), res.getPrice());
        assertEquals("/images/toppings/tc-trang.jpg", res.getImageUrl());
        assertFalse(res.getIsAvailable());
        verify(toppingRepository, times(1)).save(sampleTopping);
    }

    @Test
    void updateTopping_SameName_DoesNotCheckDuplicate() {
        UpdateToppingRequest updateRequest = new UpdateToppingRequest();
        updateRequest.setName("trân châu đen");

        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));
        when(toppingRepository.save(any(Topping.class))).thenAnswer(i -> i.getArguments()[0]);

        ToppingResponse res = toppingService.updateTopping(1, updateRequest);

        assertEquals("trân châu đen", res.getName());
        verify(toppingRepository, never()).existsByName(anyString());
    }

    @Test
    void updateTopping_ThrowsException_WhenNewNameExists() {
        UpdateToppingRequest updateRequest = new UpdateToppingRequest();
        updateRequest.setName("Trân châu trắng");

        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));
        when(toppingRepository.existsByName("Trân châu trắng")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> toppingService.updateTopping(1, updateRequest));
    }

    @Test
    void updateTopping_ThrowsException_WhenPriceInvalid() {
        UpdateToppingRequest updateRequest = new UpdateToppingRequest();
        updateRequest.setName("   ");
        updateRequest.setPrice(new BigDecimal("-1000"));

        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));

        assertThrows(RuntimeException.class, () -> toppingService.updateTopping(1, updateRequest));
    }

    @Test
    void updateTopping_Success_NullFields() {
        UpdateToppingRequest emptyRequest = new UpdateToppingRequest();

        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));
        when(toppingRepository.save(any(Topping.class))).thenAnswer(i -> i.getArguments()[0]);

        ToppingResponse res = toppingService.updateTopping(1, emptyRequest);

        assertEquals("Trân châu đen", res.getName());
        assertEquals(new BigDecimal("5000"), res.getPrice());
        assertTrue(res.getIsAvailable());
        verify(toppingRepository, times(1)).save(sampleTopping);
    }

    @Test
    void updateTopping_NotFound_ThrowsException() {
        UpdateToppingRequest updateRequest = new UpdateToppingRequest();
        when(toppingRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> toppingService.updateTopping(99, updateRequest));
        verify(toppingRepository, never()).save(any(Topping.class));
    }

    @Test
    void deleteTopping_Success() {
        when(toppingRepository.findById(1)).thenReturn(Optional.of(sampleTopping));
        when(toppingRepository.save(any(Topping.class))).thenAnswer(i -> i.getArguments()[0]);

        toppingService.deleteTopping(1);

        assertFalse(sampleTopping.getIsAvailable());
        verify(toppingRepository, times(1)).findById(1);
        verify(toppingRepository, times(1)).save(sampleTopping);
    }

    @Test
    void deleteTopping_NotFound_ThrowsException() {
        when(toppingRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> toppingService.deleteTopping(99));
        verify(toppingRepository, never()).save(any(Topping.class));
    }
}
